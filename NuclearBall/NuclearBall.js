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
                r: 18,
                restitution: 0.5,
                density: 1,
                x: 280,
                y: 1700,
                dx: 0,
                dy: 0,
                angle: 0,
            });

            this.add('physics,2d');
            this.on("die", this, "die");
            this.on("win", this, "win");
        },

        win: function(){
            this.p.dx = 0,
            this.p.dy = 0
        },

        fire: function() {
            this.p.dx = Math.cos(this.p.angle / 180 * Math.PI),
            this.p.dy = Math.sin(this.p.angle / 180 * Math.PI),
            this.physics.velocity(this.p.dx*2000,this.p.dy*2000);
        },

        die: function() {
            //this.play("die");
            this.destroy();
        },

        step: function(dt){
            
        }

    });

    Q.Sprite.extend("Barrel",{
        init: function(p) {
            this._super(p, {
                sheet: "BarrelRed",
                scale: 1.7,
                type:'static',
                shape: 'polygon',
                x: 2780,
                y: 1527,
                gravity: 0,
                density: 0,
                collisioned: false,
                sensor: true
            }); 

            this.add('physics,aiBounce,2d');
            this.on('bump.top',this,'top');
            this.on('bump.left,bump.right,bump.bottom',this,'coll');
            this.on("sensor");
        },

        sensor: function() {
            Q.stageScene("winGame", 1);
            this.p.sensor = false;
            Q("Ball").trigger("win");
        }, 

        top: function(collision) {
            if(collision.obj.isA("Ball")) {
                if(!this.p.collisioned){
                    collision.obj.trigger("die");
                    //this.destroy();
                    this.p.collisioned = true;
                }
            }
        },

        coll: function(collision){
            if(collision.obj.isA("Ball")) {
                if(!this.p.collisioned){                     
                    collision.obj.trigger("die");
                    this.p.collisioned = true;
                }
            }
        },

        step: function(dt){
            this.p.y = this.p.y;
            this.p.x = this.p.x;
        }
    });

    Q.Sprite.extend("WallsTopBot",{

        init: function(p) {
            this._super(p, {
                sheet: "Walls1",
                type:'static',
                shape: 'polygon',
                gravity: 0,
                density: 1
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
            //Q.audio.stop("music_main.mp3");

            //Q.audio.play('music_level_complete.mp3');
        var container = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));

        var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                          label: "Play Again" }, function() {
                                        Q.clearStages();
                                        //Q.stageScene("mainTitle");
                            }, { keyActionName: 'action' }));         
        var label = container.insert(new Q.UI.Text({x: 0, y: -10 - button.p.h, 
                                                               label: "Mexico wins" /*+ Q.state.get("score") + " points" */, color: "white"}));
        button.on("click",function() {
            Q.clearStages();
            //Q.stageScene("mainTitle");
        });

        container.fit(20);
    });

   	Q.scene("level1",function(stage) {

        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball());
        stage.insert(new Q.Barrel());
             
        Q.stage().viewport.scale = 0.261;  

        Q.state.set({"lanzada" : 0})

	});  

     var cannonMove = function(e) {
        if(Q.stage(0) && Q.state.get("lanzada") == 0){
            var ball = Q.stage(0).ball,
            touch = e.changedTouches ?  
                    e.changedTouches[0] : e,
            canvas = document.getElementById("NuclearBall"),
            ClientRect = canvas.getBoundingClientRect(),
            point = {
                x: Math.round((e.clientX - ClientRect.left)  / 0.261),
                y: Math.round((e.clientY - ClientRect.top) / 0.261)
            };
       
            var angle = Math.atan2(point.y - ball.p.y,
                               point.x - ball.p.x);
            ball.physics.angle(angle * 180 / Math.PI);
            e.preventDefault();  
        }
    };  

    Q._each(["touchstart","mousemove","touchmove"],function(evt) {            
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