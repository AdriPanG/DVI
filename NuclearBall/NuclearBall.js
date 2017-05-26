window.addEventListener("load",function() {

	var Q = Quintus({audioSupported: [ 'mp3','ogg' ]})
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio, SVG, Physics")
        .setup({
            width: 800,
            height: 467,
    }).controls().touch().enableSound();

    Q.Sprite.extend("Ball",{

        init: function(p) {
            this._super(p, {
                sheet: "Ball",
                scale: 2,
                jumpSpeed: -8000,
                speed: 1200,
                shape: 'circle',
                color: 'red',
                r: 8,
                restitution: 0.5,
                density: 2,
                x: 280,
                y: 1700,
                dx: 0,
                dy: 0,
                angle: 0,
                seconds: 35
            });

            this.add('physics');
            this.on("fire",this,"fire");
        },

        fire: function() {
            this.p.dx = Math.cos(this.p.angle / 180 * Math.PI),
            this.p.dy = Math.sin(this.p.angle / 180 * Math.PI),
            console.log("x: " + this.p.dx + " y: " + this.p.dy);
          this.physics.velocity(this.p.dx*400,this.p.dy*400);
        },

        step: function(dt){
            
        }

    });

        Q.Sprite.extend('Cannon',{
            init: function(props) {
              this._super({
                shape:'polygon',
                color: 'black',
                points: [[ 0,0 ], [0,-500], [500,-1000], [800, -1100], [4000, -1100], 
                          [ 4000, 1100], [800, 1100], [500, 1000], [0, 500] ],
                x: 10,
                y: 210
              });
            },

            fire: function() {
              var dx = Math.cos(this.p.angle / 180 * Math.PI),
                  dy = Math.sin(this.p.angle / 180 * Math.PI),
                  ball = Q("Ball");
                  ball.p.dx = dx;
                  ball.p.dy = dy;
                  ball.angle = this.p.angle;
              ball.physics.velocity(dx*400,dy*400);
            }
      });

    Q.Sprite.extend("WallsTopBot",{

        init: function(p) {
            this._super(p, {
                sheet: "Walls1",
                type:'static',
                shape: 'polygon',
                gravity: 0,
                density: 0
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
            });         

            this.add('physics');   
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
        }

    });

   	Q.scene("level1",function(stage) {

        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.cannon = stage.insert(new Q.Cannon());
        stage.ball = stage.insert(new Q.Ball());

             
        Q.stage().viewport.scale = 0.261;  

	});  

     var cannonMove = function(e) {
        
            var ball = Q.stage(0).ball,
            touch = e.changedTouches ?  
                    e.changedTouches[0] : e,
            point = {
                x: Q.touchInput.touchPos.p.x, 
                y: Q.touchInput.touchPos.p.y 
            };            
       
            var angle = Math.atan2(point.y - ball.p.y,
                               point.x - ball.p.x);
            ball.p.angle = angle * 180 / Math.PI;
            e.preventDefault();
        };  

     Q._each(["touchstart","mousemove","touchmove"],function(evt) {
            Q.wrapper.addEventListener(evt,cannonMove);
        },this);

    var canonFire=function(e) {
        Q.stage(0).ball.fire();
        e.preventDefault();
    }

    Q._each(["touchend","mouseup"],function(evt) {
        Q.wrapper.addEventListener(evt,canonFire);
    });

    Q.loadTMX("level1.tmx", function() {
        Q.stageScene("level1");
    });   

});