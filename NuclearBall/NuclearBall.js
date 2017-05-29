window.addEventListener("load",function() {

	var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio, SVG, Physics")
        .setup('NuclearBall', {
            width: 800,
            height: 467,
    });

    Q.Sprite.extend("Ball",{

        init: function(p) {
            this._super(p, {
                sheet: "Ball",
                scale: 2,
                shape: 'circle',
                r: 80,
                restitution: 0.8,
                density: 0.1,
                friction: 0.2,
                x: 280,
                y: 1700,
                dx: 0,
                dy: 0,
                angle: 0,
            });

            this.add('physics');
        },

        fire: function() {
            this.p.dx = Math.cos(this.p.angle / 180 * Math.PI),
            this.p.dy = Math.sin(this.p.angle / 180 * Math.PI),
            this.physics.velocity(this.p.dx*2000,this.p.dy*2000);
        },

        step: function(dt){
            /*var maxCol = 10, collided = false;
            this.p.hit = false;
            while((collided = this.stage.search(this)) && maxCol > 0) {
                if(collided) {
                  this.p.hit = true;
                  this.p.x -= collided.separate[0];
                  this.p.y -= collided.separate[1];
                }
                maxCol--;
            }*/
            
        }

    });

    Q.Sprite.extend("Barrel",{
        init: function(p) {
            this._super(p, {
                sheet: "BarrelRed",
                scale: 1,
                type: 'static',
                shape: 'polygon',
                x: 2780,
                y: 1527,
                h: 405,
                w: 301,
                gravity: 0,
                restitution: 0,
                density: 1
            }); 

            this.add('physics, 2d');
            this.on('bump.top',this,'top');
        },

        top: function(collision) {
            if(collision.obj.isA("Ball")) {
                collision.obj.destroy();
                Q.stageScene("winGame", 1);
            }
        },

        step: function(dt){
            this.p.y = this.p.y;
            this.p.x = this.p.x;

            /*var maxCol = 3, collided = false;
            this.p.hit = false;
            while((collided = this.stage.search(this)) && maxCol > 0) {
                if(collided) {
                  this.p.hit = true;
                  this.p.x -= collided.separate[0];
                  this.p.y -= collided.separate[1];
                }
                maxCol--;
            }*/
        }
    });

    Q.Sprite.extend("Box",{

        init: function(p) {
            this._super(p, {
                sheet: "Box",
                type:'static',
                shape: 'polygon',
                scale: 1,
                gravity: 0,
                density: 1,
                x: 1780,
                y: 827,
                h: 300,
                w: 300,
            });         

            this.add('physics');   
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
        }

    });

    Q.Sprite.extend("WallsTopBot",{

        init: function(p) {
            this._super(p, {
                sheet: "Walls1",
                type:'static',
                shape: 'polygon',
                gravity: 0,
                
            });            

            this.add('physics');
        },

        step: function(dt){
            this.p.y = this.p.y;
            this.p.x = this.p.x;
        }

    });

    Q.Sprite.extend("WallsLeftRight",{

        init: function(p) {
            this._super(p, {
                sheet: "Walls2",
                type:'static',
                shape: 'polygon',
                gravity: 0,
                density: 1
            });         

            this.add('physics');   
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
        }

    });

    Q.scene("winGame",function(stage) {
        var container = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));

        var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                          label: "Play Again" }, function() {
                                        Q.clearStages();
                                        //Q.stageScene("level1");
                            }, { keyActionName: 'action' }));         
        var label = container.insert(new Q.UI.Text({x: 0, y: -10 - button.p.h, 
                                                               label: "Mexico wins", color: "white"}));
        button.on("click",function() {
            Q.clearStages();
            //Q.stageScene("level1");
        });

        container.fit(20);
    });

   	Q.scene("level1",function(stage) {

        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball());
        stage.insert(new Q.Barrel());
        stage.insert(new Q.Box());
             
        Q.stage().viewport.scale = 0.261;  

        Q.state.set({"lanzada" : 0})

	});  

     var cannonMove = function(e) {
        if(Q.stage(0) && Q.state.get("lanzada") == 0){
            var ball = Q.stage(0).ball,
            touch = e.changedTouches ?  
                    e.changedTouches[0] : e,
            canvas = document.getElementById("NuclearBall"),
            ClientRect = canvas.getBoundingClientRect();
            
            if(e.type === "mousemove"){
                point = {
                    x: Math.round((e.clientX - ClientRect.left)  / 0.261),
                    y: Math.round((e.clientY - ClientRect.top) / 0.261)
                };
            }
            else if(e.type === "touchmove"){
                point = {
                    x: Math.round((e.changedTouches[0].clientX - ClientRect.left)  / 0.261),
                    y: Math.round((e.changedTouches[0].clientY - ClientRect.top) / 0.261)
                };
            }
            
       
            var angle = Math.atan2(point.y - ball.p.y,
                               point.x - ball.p.x);

            ball.physics.angle(angle * 180 / Math.PI);
            e.preventDefault();  
        }
    };  

    Q._each(["mousemove","touchmove"],function(evt) { 
            Q.wrapper.addEventListener(evt,cannonMove);
        },this);

    var canonFire=function(e) {
        if(Q.state.get("lanzada") == 0){
            Q.state.set({"lanzada" : 1});
            Q.stage(0).ball.fire();
            e.preventDefault();
        }
    }

    Q._each(["touchend","mouseup"],function(evt) {
        Q.wrapper.addEventListener(evt,canonFire);
    });

    Q.loadTMX("level1.tmx", function() {
        Q.stageScene("level1");
    });   

});