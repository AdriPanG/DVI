window.addEventListener("load",function() {

	var Q = Quintus({audioSupported: [ 'mp3', 'ogg' ]})
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio, SVG, Physics")
        .setup('NuclearBall', {
            width: 800,
            height: 467,
    }).touch().enableSound();

    var point;


    //////////////////////* SPRITES *//////////////////////


    Q.Sprite.extend("Ball",{

        init: function(p) {
            this._super(p, {
                asset: "ball.png",
                scale: 2,
                shape: 'circle',
                r: 76,
                restitution: 0.8,
                density: 0.1,
                friction: 0.2,
                x: 280,
                y: 1650,
                dx: 0,
                dy: 0,
                vx: 0,
                vy: 0,
                angle: 0,
                ratioVelocidad: 0
            });

            this.add('physics');
        },

        fire: function() {
            this.p.dx = Math.cos(this.p.angle / 180 * Math.PI),
            this.p.dy = Math.sin(this.p.angle / 180 * Math.PI),
            this.physics.velocity(this.p.dx*888*this.p.ratioVelocidad,this.p.dy*888*this.p.ratioVelocidad);
            Q.audio.play("throw.mp3");
        },

        step: function(dt){

        }

    });

    Q.Sprite.extend("Flecha",{
        init: function(p) {
            this._super(p, {
                sheet: "flecha",
                sprite:"flecha",
                cx: 0,
                opacity: 0.65,
                frame: 0        
            });            
        },

        step: function(dt){
            
        }
    });

    Q.Sprite.extend("Bomba",{
        init: function(p) {
            this._super(p, {
                asset: "bomb.png",
                scale: 3                 
            });            

            this.add('tween');            
            this.on('callFinish', this, 'callFinish');
            this.animate({ x: this.p.x, y: this.p.y + 500, angle: 0},1,{callback: function(){
                Q.state.set({lanzada: 1, bomba: false, score: Q.state.get("scoreLevel")});
                this.destroy();
                Q.stage(0).insert(new Q.Explosion({x: this.p.x + 15 , y: this.p.y - 77}));
            }}); 
        },

        step: function(dt){
            
        }
    });

    Q.Sprite.extend("Barrel",{
        init: function(p) {
            this._super(p, {
                asset: "BarrelRed.png",
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
                collision.obj.physics.velocity(0,0);
                collision.obj.physics.removed();
                Q.state.set({completed: true});
                Q.stage(0).insert(new Q.Explosion({x: this.p.x + 15 , y: this.p.y - 377}));
               	Q.state.inc("score",100);                                
            }
        },

        step: function(dt){
            this.p.y = this.p.y;
            this.p.x = this.p.x;
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
                y: 857,
                h: 256,
                w: 256,
                movil: false,
                velMov: 0,
                xIni: 0,
                yIni: 0,
                xFin: 0,
                yFin: 0,
                izq: false,
                der: true,
                arr: false,
                abaj: true,
                velRot: 0
            });         

            this.add('physics'); 
            this.on('contact',this,'contact');
        },

        contact: function(obj){
            if(obj.isA("Ball") && !Q.state.get("completed")) {
                Q.state.inc("score",10);
            }            
        },

        step: function(dt){
            if(this.p.movil){
                // Movimiento horizontal
                if(this.p.x > this.p.xFin){
                    this.p.der = false;
                    this.p.izq = true;
                } else if (this.p.x < this.p.xIni) {
                    this.p.der = true;
                    this.p.izq = false;
                } else if (this.p.xIni === this.p.xFin){
                    this.p.der = false;
                    this.p.izq = false;
                }
                if(this.p.der){
                    this.p.x += dt * this.p.velMov;
                } else if (this.p.izq) {
                    this.p.x -= dt * this.p.velMov;
                }

                // Movimiento vertical
                 if(this.p.y > this.p.yFin){
                    this.p.arr = false;
                    this.p.abaj = true;
                } else if (this.p.y < this.p.yIni) {
                    this.p.arr = true;
                    this.p.abaj = false;
                } else if (this.p.yIni === this.p.yFin){
                    this.p.arr = false;
                    this.p.abaj = false;
                }
                if(this.p.arr){
                    this.p.y += dt * this.p.velMov;
                } else if (this.p.abaj) {
                    this.p.y -= dt * this.p.velMov;
                }

                // Desplazar
                this.physics.position(this.p.x, this.p.y)

                //Rotación
                this.p.angle = (this.p.angle + dt * this.p.velRot) % 360;
                this.physics.angle(this.p.angle);       
            }
        }

    });

    Q.Sprite.extend("Saw",{

        init: function(p) {
            this._super(p, {
                asset: "saw.png",
                type:'static',
                shape: 'circle',
                r: 178,
                x: 1000,
                y: 500,
                angle: 0,
                movil: false,
                velMov: 0,
                xIni: 0,
                yIni: 0,
                xFin: 0,
                yFin: 0,
                izq: false,
                der: true,
                arr: false,
                abaj: true
            });         

            this.add('physics');
            this.on('contact',this,'bump');
        },

        bump: function(obj) {
            if(obj.isA("Ball") && !Q.state.get("completed")) {
                var x = obj.p.x,
                y = obj.p.y;
                obj.destroy();
                obj.physics.velocity(0,0);
                obj.physics.removed();
                if(!Q.state.get("retry")){
                    Q.state.set({retry: true});
                    Q.stage(0).insert(new Q.ExplosionBall({x: x, y: y}));                            
                }
            }
        },

        step: function(dt){
            if(this.p.movil){
                // Movimiento horizontal
                if(this.p.x > this.p.xFin){
                    this.p.der = false;
                    this.p.izq = true;
                } else if (this.p.x < this.p.xIni) {
                    this.p.der = true;
                    this.p.izq = false;
                } else if (this.p.xIni === this.p.xFin){
                    this.p.der = false;
                    this.p.izq = false;
                }
                if(this.p.der){
                    this.p.x += dt * this.p.velMov;
                } else if (this.p.izq) {
                    this.p.x -= dt * this.p.velMov;
                }

                // Movimiento vertical
                 if(this.p.y > this.p.yFin){
                    this.p.arr = false;
                    this.p.abaj = true;
                } else if (this.p.y < this.p.yIni) {
                    this.p.arr = true;
                    this.p.abaj = false;
                } else if (this.p.yIni === this.p.yFin){
                    this.p.arr = false;
                    this.p.abaj = false;
                }
                if(this.p.arr){
                    this.p.y += dt * this.p.velMov;
                } else if (this.p.abaj) {
                    this.p.y -= dt * this.p.velMov;
                }

                // Desplazar
                this.physics.position(this.p.x, this.p.y)

            }
            this.p.angle = (this.p.angle + dt * 100) % 360;
            this.physics.angle(this.p.angle);
        }

    });

    Q.Sprite.extend("Spike",{

        init: function(p) {
            this._super(p, {
                sheet: "Spike",
                type:'static',
                shape: 'polygon',
                scale: 1.5,
                x: 500,
                y: 200,
                h: 170,
                w: 256,
                gravity: 0,
                density: 1,
                restitution: 0
            });         

            this.add('physics, 2d');
            this.on('bump.bottom,bump.top',this,'topbottom');
        },

        topbottom: function(collision) {
            if(collision.obj.isA("Ball")) {
                var x = collision.obj.p.x,
                y = collision.obj.p.y;
                collision.obj.destroy();
                collision.obj.physics.velocity(0,0);
                collision.obj.physics.removed();
                if(!Q.state.get("retry")){
                    Q.state.set({retry: true});
                    Q.stage(0).insert(new Q.ExplosionBall({x: x, y: y}));                            
                }        
            }
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
                h: 68,
                w: 256,
                firstContact: true                
            });            

            this.add('physics');
            this.on('contact',this,'contact');
        },

        contact: function(obj){
            if(obj.isA("Ball") && !Q.state.get("completed") && Q.state.get("lanzada") === 1) {
                Q.state.inc("score",10);              
            }            
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
                density: 1,
                h: 256,
                w: 68
            });         

            this.add('physics');               
            this.on('contact',this,'contact');
        },

        contact: function(obj){
            if(obj.isA("Ball") && !Q.state.get("completed")) {
                Q.state.inc("score",10);
            }            
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
        }

    });

    Q.animations("coin anim", {
                    "true":{frames: [0,1,2,5,4,3,7,6,9,10,0,1,2,5,4,3,7,6,9,10,0], rate: 1/5, loop: false, trigger: "gana"},
                    "false":{frames: [0,1,2,5,4,3,7,6,9,10,0,1,2,5,4,3], rate: 1/5, loop: false, trigger: "pierde"}
    });

    Q.Sprite.extend("Coin",{

        init: function(p) {
            this._super(p, {
                sprite: "coin anim",
                sheet: "coin",
                x: 1530,
                y: 500,
                scale: 3,
                rand: 0
            });          

            this.add('animation');
            this.on("gana", this, "gana");
            this.on("pierde", this, "pierde");
            if(this.p.rand === 1) this.play("false");
            else this.play("true");
        },

        pierde: function(){
            Q.state.set({moneda: true});
            Q.stageScene("loseGame", 1);
        },

        gana: function(){
            Q.state.set({moneda: false, score: Q.state.get("scoreLevel")});
            Q.stageScene("extraTry", 1);
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
        }

    });

    Q.animations("explosion anim", {
                    "explota":{frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], rate: 1/5, loop: false, trigger: "fin"}
    });

    Q.animations("poison anim", {
                    "explota":{frames: [1,2,3,4,5,6,7], rate: 1/5, loop: false, trigger: "fin"}
    });

    Q.Sprite.extend("Explosion",{

        init: function(p) {
            this._super(p, {
                sprite: "explosion anim",
                sheet: "explosion",
                x: 2795,
                y: 1150,
                scale: 7,
                rand: 0
            });          

            this.add('animation');
            this.on("fin", this, "fin");
            if(Q.state.get("level") > 5){
                this.p.sprite = "poison anim";
                this.p.sheet = "poison";
                this.p.scale = 7;
                this.p.x = this.p.x + 35;
                this.p.y = this.p.y + 90;
                Q.audio.play("poison.mp3");
            } else {
                Q.audio.play("explosion.mp3");
            }

            this.play("explota");            
        },

        fin: function(){   
            Q.state.set({scoreLevel: Q.state.get("score")}); 
            if(Q.state.get("level") === 10){
                Q.stageScene("winGame", 1);
            } else {
                Q.stageScene("nextLevel", 1);
            }                 
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
        }

    });

    Q.animations("explosionBall anim", {
                    "explota":{frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21], rate: 1/5, loop: false, trigger: "fin"}
    });

    Q.Sprite.extend("ExplosionBall",{

        init: function(p) {
            this._super(p, {
                sprite: "explosionBall anim",
                sheet: "explosionBall",
                x: 2795,
                y: 1150,
                scale: 1.65,
                rand: 0
            });          

            this.add('animation');
            this.on("fin", this, "fin");
            this.play("explota");
            Q.audio.play("lose.mp3")
        },

        fin: function(){ 
            if(Q.state.get("lives") === 0 && Q.state.get("moneda")){                    
                   var randNum = Math.floor((Math.random() * 2) + 1);
                    Q.stage(0).insert(new Q.Coin({rand: randNum}));
            } else if (Q.state.get("lives") === 0) {
                Q.stageScene("loseGame", 1);
            } else {
                Q.state.set({score: Q.state.get("scoreLevel")});
                Q.stageScene("tryAgain", 1);
            }
        },

        step: function(dt){
            this.p.y = this.p.y;
            this.p.x = this.p.x;
        }

    });


    //////////////////////* INPUT JUGADOR *//////////////////////


     var cannonMove = function(e) {
        if(Q.stage(0) && Q.state.get("lanzada") === 0){
            var ball = Q.stage(0).ball,
            flecha = Q.stage(0).flecha,
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
            flecha.p.angle = angle * 180 / Math.PI;
            var scale = Math.sqrt(Math.pow((point.x - ball.p.x), 2) + Math.pow((point.y - ball.p.y), 2)) / 250;
            if(scale < 0.6)
                scale = 0.6;
            else if (scale > 4.5)
                scale = 4.5;
            flecha.p.scale = scale;
            ball.p.ratioVelocidad = scale;
        }
    };  

    Q._each(["touchstart", "mousemove","touchmove"],function(evt) { 
            Q.wrapper.addEventListener(evt,cannonMove);
    },this);

    var canonFire=function(e) {
        if(Q.stage(0) && Q.state.get("lanzada") === -1){
            Q.state.set({lanzada: 0});
        } else if(Q.stage(0) && Q.state.get("lanzada") === 0){
            Q.state.set({lanzada: 1});
            Q.stage(0).flecha.destroy();
            Q.stage(0).ball.fire();
        } 
    }

    Q._each(["touchend","mouseup"],function(evt) {
        Q.wrapper.addEventListener(evt,canonFire);
    });

    
    //////////////////////* ESCENAS *//////////////////////


    //////////////////////* MENUS *//////////////////////


    Q.scene("nextLevel",function(stage) {
        stage.container = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: Q.height/2
        }));
        stage.insert(new Q.Sprite({asset:'panelLC.png',scale:1,x:0,y:-12}),stage.container);
        stage.container.button = stage.container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                          asset: "ButtonNL.png"}));         
        var label = stage.container.insert(new Q.UI.Text({x: 0, y: -10 - stage.container.button.p.h, 
                                                               label: "Level completed", color: "white"}));
        stage.container.button.on("click",function() {
            Q.clearStages();
            Q.stageScene("level" + (Q.state.get("level") + 1));
        });
        stage.container.fit(20);
    });

    Q.scene("loseGame",function(stage) {
        stage.container = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: Q.height/2
        }));
        stage.insert(new Q.Sprite({asset:'panelLG.png',scale:1,x:0,y:-12}),stage.container);
        stage.container.button = stage.container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                          asset: "ButtonPA.png"}, function() {
                                        Q.clearStages();
                                        Q.stageScene("level1");
                            }, { keyActionName: 'action' }));         
        var label = stage.container.insert(new Q.UI.Text({x: 0, y: -10 - stage.container.button.p.h, 
                                                               label: "You lose: " + Q.state.get("score") + " pts", color: "white"}));
        stage.container.button.on("click",function() {
            Q.clearStages();                            
            Q.stageScene("mainTitle", 2); 
        });
        stage.container.fit(20);
    });

    Q.scene("tryAgain",function(stage) {
        stage.container = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: Q.height/2
        }));
        stage.insert(new Q.Sprite({asset:'panelLL.png',scale:1,x:0,y:-12}),stage.container);
        stage.container.button = stage.container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                          asset: "ButtonTA.png"} ));         
        var label = stage.container.insert(new Q.UI.Text({x: 0, y: -10 - stage.container.button.p.h, 
                                                               label: "You failed", color: "black"}));
        stage.container.button.on("click",function() {
            if(Q.state.get("lives") !== 0)
                Q.state.dec("lives",1);  
            Q.clearStages();                            
            Q.stageScene("level" + Q.state.get("level"));             
        });
        stage.container.fit(20);        
    });

     Q.scene("extraTry",function(stage) {
        stage.container = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: Q.height/2
        }));
        stage.insert(new Q.Sprite({asset:'panelLL.png',scale:1,x:0,y:-12}),stage.container);
        stage.container.button = stage.container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                          asset: "ButtonTA.png"} ));         
        var label = stage.container.insert(new Q.UI.Text({x: 0, y: -10 - stage.container.button.p.h, 
                                                               label: "Extra try!", color: "black"}));
        stage.container.button.on("click",function() {
            if(Q.state.get("lives") !== 0)
                Q.state.dec("lives",1);  
            Q.clearStages();                            
            Q.stageScene("level" + Q.state.get("level"));             
        });
        stage.container.fit(20);        
    });

    Q.scene("winGame",function(stage) {
        stage.container = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: Q.height/2
        }));
        stage.insert(new Q.Sprite({asset:'panelWG.png',scale:1,x:0,y:-12}),stage.container);
        stage.container.button = stage.container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                          asset: "ButtonFG.png"} ));         
        var label = stage.container.insert(new Q.UI.Text({x: 0, y: -10 - stage.container.button.p.h, 
                                                               label: "You win: " + Q.state.get("score") + " pts", color: "white"}));
        stage.container.button.on("click",function() {
            Q.clearStages();                            
            Q.stageScene("creditos1"); 
        });
        stage.container.fit(20);
    });

    Q.scene("mainTitle",function(stage) {
            Q.audio.stop();
            var container = container = stage.insert(new Q.UI.Container({
                x: Q.width/2, y: 5, fill: "rgba(0,0,0,0.0)"
            }));               

            /* Seleccion de Ball */                                     
            var buttonB1 = stage.insert(new Q.UI.Button({asset: "ball.png", x: Q.width/2 - 180, y: Q.height/2 + 60}));
            buttonB1.on("click",function() {
                Q.state.set({score: 0, scoreLevel: 0, lives: 5, level: 1, lanzada: -1, moneda: true, bomba: true, assetBall: "ball.png"});
                Q.clearStages();
                Q.stageScene("level6");    
                Q.audio.play('music.mp3',{ loop: true });       
            });
            var buttonB2 = stage.insert(new Q.UI.Button({asset: "ball2.png", x: Q.width/2 - 60, y: Q.height/2 + 60}));
            buttonB2.on("click",function() {
                Q.state.set({score: 0, scoreLevel: 0, lives: 5, level: 1, lanzada: -1, moneda: true, bomba: true, assetBall: "ball2.png"});
                Q.clearStages();
                Q.stageScene("level1");
                Q.audio.play('music.mp3',{ loop: true })             
            });
            var buttonB3 = stage.insert(new Q.UI.Button({asset: "ball3.png", x: Q.width/2 + 60, y: Q.height/2 + 60}));
            buttonB3.on("click",function() {
                Q.state.set({score: 0, scoreLevel: 0, lives: 5, level: 1, lanzada: -1, moneda: true, bomba: true, assetBall: "ball3.png"});
                Q.clearStages();
                Q.stageScene("level1");   
                Q.audio.play('music.mp3',{ loop: true })           
            });
            var buttonB4 = stage.insert(new Q.UI.Button({asset: "ball4.png", x: Q.width/2 + 180, y: Q.height/2 + 60}));
            buttonB4.on("click",function() {
                Q.state.set({score: 0, scoreLevel: 0, lives: 5, level: 1, lanzada: -1, moneda: true, bomba: true, assetBall: "ball4.png"});
                Q.clearStages();
                Q.stageScene("level1");  
                Q.audio.play('music.mp3',{ loop: true })            
            });

            /* Creditos */
            var buttonCredits = stage.insert(new Q.UI.Button({asset: "creditsButton.png", x: Q.width - 120, y: Q.height - 60}));
            buttonCredits.on("click",function() {
                Q.clearStages();
                Q.stageScene("creditos1",{ loop: true });             
            });
            container.fit(20);
            stage.insert(new Q.Sprite({asset:'mainTitle.png',scale:1,x:0,y:0, cy:0}),container);
        });


    //////////////////////* NIVELES *//////////////////////


    Q.scene("level1",function(stage) {
        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall")}));        
        stage.barrel = stage.insert(new Q.Barrel());
        stage.insert(new Q.Box());
        stage.insert(new Q.Box({y:1100}));
        stage.insert(new Q.Box({y:1350}));
        stage.insert(new Q.Box({y:1600}));
        var boxGirada = new Q.Box({x: 500, y:500, angle: 45, dx: 10, dy: 10});
        stage.insert(boxGirada);
        boxGirada.physics.angle(45);                     
        Q.stage().viewport.scale = 0.261;  
        Q.state.set({lanzada: -1, level: 1, score : 0, completed: false, retry : false});
        stage.flecha = stage.insert(new Q.Flecha({x: 280, y: 1650}));
        Q.stageScene("HUD", 2);
    });

    Q.scene("level2",function(stage) {
        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), maxAltura: 1030,
                alturaAnterior: 900}));
        stage.barrel = stage.insert(new Q.Barrel({x:2840, y: 1024}));
        stage.insert(new Q.Box({x:2040, y:650}));
        stage.insert(new Q.Box({x:2296, y:800}));
        stage.insert(new Q.Box({x:2552, y:950})); 
        stage.insert(new Q.Box({x:2840, y: 1354}));
        stage.insert(new Q.Box({x:2840, y: 1600}));                
        Q.stage().viewport.scale = 0.261;  
        Q.state.set({lanzada: -1, level: 2, completed: false, retry : false});
        stage.flecha = stage.insert(new Q.Flecha({x: 280, y: 1650}));
        Q.stageScene("HUD", 2);
    });

    Q.scene("level3",function(stage) {
        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), x: 2840, maxAltura: 1030,
                alturaAnterior: 900}));
        stage.barrel = stage.insert(new Q.Barrel({x:1520}));
        stage.insert(new Q.Box({x:2121, y:862}));
        stage.insert(new Q.Box({x:2021, y:1108})); 
        stage.insert(new Q.Box({x:1921, y: 1354}));
        stage.insert(new Q.Box({x:1821, y: 1600}));                
        Q.stage().viewport.scale = 0.261;  
        Q.state.set({lanzada: -1, level: 3, completed: false, retry : false});
        stage.flecha = stage.insert(new Q.Flecha({x: 2840, y: 1650}));
        Q.stageScene("HUD", 2);
    });

    Q.scene("level4",function(stage) {
        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), x: 2840, maxAltura: 1030,
                alturaAnterior: 900}));
        stage.barrel = stage.insert(new Q.Barrel({x:280}));
        stage.insert(new Q.Box({x:600, y:1108})); 
        stage.insert(new Q.Box({x:600, y: 1354}));
        stage.insert(new Q.Box({x:600, y: 1600})); 
        var spikeGirado = new Q.Spike();
        stage.insert(spikeGirado);
        spikeGirado.physics.angle(180);              
        Q.stage().viewport.scale = 0.261;  
        Q.state.set({lanzada: -1, level: 4, completed: false, retry : false});
        stage.flecha = stage.insert(new Q.Flecha({x: 2840, y: 1650}));
        Q.stageScene("HUD", 2);
    });


    Q.scene("level5",function(stage) {
        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), x: 1540, maxAltura: 1030,
                alturaAnterior: 900}));
        stage.barrel = stage.insert(new Q.Barrel({x: 2780}));
        //Techo
        var boxGirada1 = new Q.Box({x: 1400, y: 210, angle: 45, dx: 10, dy: 10});
        stage.insert(boxGirada1);
        boxGirada1.physics.angle(-10);
        var boxGirada2 = new Q.Box({x: 1445, y: 450, angle: 45, dx: 10, dy: 10});
        stage.insert(boxGirada2);
        boxGirada2.physics.angle(-10);
        var boxGirada3 = new Q.Box({x: 1490, y: 690, angle: 45, dx: 10, dy: 10});
        stage.insert(boxGirada3);
        boxGirada3.physics.angle(-10);
        var boxGirada4 = new Q.Box({x: 1535, y: 930, angle: 45, dx: 10, dy: 10});
        stage.insert(boxGirada4);
        boxGirada4.physics.angle(-10);
        //Suelo
        var boxGirada5 = new Q.Box({x: 2420, y: 1585, angle: 45, dx: 10, dy: 10});
        stage.insert(boxGirada5);
        boxGirada5.physics.angle(-10);
        var boxGirada6 = new Q.Box({x: 2375, y: 1345, angle: 45, dx: 10, dy: 10});
        stage.insert(boxGirada6);
        boxGirada6.physics.angle(-10);
        var boxGirada7 = new Q.Box({x: 2330, y: 1105, angle: 45, dx: 10, dy: 10});
        stage.insert(boxGirada7);
        boxGirada7.physics.angle(-10);
        var boxGirada8 = new Q.Box({x: 2285, y: 865, angle: 45, dx: 10, dy: 10});
        stage.insert(boxGirada8);
        boxGirada8.physics.angle(-10);
        var spikeGirado1 = new Q.Spike({x: 1700});
        stage.insert(spikeGirado1);
        spikeGirado1.physics.angle(180);
        var spikeGirado2 = new Q.Spike({x: 2050});
        stage.insert(spikeGirado2);
        spikeGirado2.physics.angle(180);
        var spikeGirado3 = new Q.Spike({x: 2400});
        stage.insert(spikeGirado3);
        spikeGirado3.physics.angle(180);
        var spikeGirado4 = new Q.Spike({x: 2750});
        stage.insert(spikeGirado4);
        spikeGirado4.physics.angle(180);             
        Q.stage().viewport.scale = 0.261;  
        Q.state.set({lanzada: -1, level: 5, completed: false, retry : false});
        stage.flecha = stage.insert(new Q.Flecha({x: 1540, y: 1650}));
        Q.stageScene("HUD", 2);
    });

    Q.scene("level6",function(stage) {
        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), x: 700, maxAltura: 1030,
                alturaAnterior: 900}));
        stage.barrel = stage.insert(new Q.Barrel({asset: "BarrelGreen.png", x: 2580}));
        stage.insert(new Q.Saw());
        stage.insert(new Q.Saw({x: 1300, y: 700}));
        stage.insert(new Q.Saw({x: 2000, y: 1300}));
        stage.insert(new Q.Saw({x: 2100, y: 500}));             
        Q.stage().viewport.scale = 0.261;  
        Q.state.set({lanzada: -1, level: 6, completed: false, retry : false});
        stage.flecha = stage.insert(new Q.Flecha({x: 700, y: 1650}));
        Q.stageScene("HUD", 2);
    });

    Q.scene("level7",function(stage) {
        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), x: 1700, maxAltura: 1030,
                alturaAnterior: 900}));
        stage.barrel = stage.insert(new Q.Barrel({asset: "BarrelGreen.png", x: 380}));
        stage.insert(new Q.Saw({x: 400, y: 700}));
        var spikeGirado1 = new Q.Spike({x: 245});
        stage.insert(spikeGirado1);
        spikeGirado1.physics.angle(180);
        var spikeGirado2 = new Q.Spike({x: 615});
        stage.insert(spikeGirado2);
        spikeGirado2.physics.angle(180);
        var spikeGirado3 = new Q.Spike({x: 985});
        stage.insert(spikeGirado3);
        spikeGirado3.physics.angle(180);
        var spikeGirado4 = new Q.Spike({x: 1355});
        stage.insert(spikeGirado4);
        spikeGirado4.physics.angle(180);
        var spikeGirado5 = new Q.Spike({x: 1725});
        stage.insert(spikeGirado5);
        spikeGirado5.physics.angle(180);
        var spikeGirado6 = new Q.Spike({x: 2085});
        stage.insert(spikeGirado6);
        spikeGirado6.physics.angle(180);
        var spikeGirado7 = new Q.Spike({x: 2465});
        stage.insert(spikeGirado7);
        spikeGirado7.physics.angle(180);
        var spikeGirado8 = new Q.Spike({x: 2825});
        stage.insert(spikeGirado8);
        spikeGirado8.physics.angle(180);
        stage.insert(new Q.Box({x:1950, y:1600, density: 0, type:'dynamic'}));
        stage.insert(new Q.Box({x:1950, y:1349, density: 0, type:'dynamic'}));
        stage.insert(new Q.Box({x:1950, y:1093, density: 0, type:'dynamic'}));
        stage.insert(new Q.Box({x:1950, y:849, density: 0, type:'dynamic'}));
        stage.insert(new Q.Box({x:1250, y:1600, density: 0, type:'dynamic'}));
        stage.insert(new Q.Box({x:1250, y:1349, density: 0, type:'dynamic'}));
        stage.insert(new Q.Box({x:1250, y:1093, density: 0, type:'dynamic'}));             
        Q.stage().viewport.scale = 0.261;  
        Q.state.set({lanzada: -1, level: 7, completed: false, retry : false});
        stage.flecha = stage.insert(new Q.Flecha({x: 1700, y: 1650}));
        Q.stageScene("HUD", 2);
    });


    Q.scene("level8",function(stage) {
        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), x: 200, y: 300, maxAltura: 1030,
                alturaAnterior: 900}));
        stage.barrel = stage.insert(new Q.Barrel({asset: "BarrelGreen.png", x: 1720}));
        stage.insert(new Q.Saw({x: 1100, y: 900}));
        stage.insert(new Q.Saw({x: 2000, y: 900}));
        stage.insert(new Q.Spike({x: 245, y: 1600}));
        stage.insert(new Q.Spike({x: 615, y: 1600}));
        stage.insert(new Q.Spike({x: 985, y: 1600}));
        stage.insert(new Q.Spike({x: 1355, y: 1600}));
        stage.insert(new Q.Spike({x: 2085, y: 1600}));
        stage.insert(new Q.Spike({x: 2465, y: 1600}));
        stage.insert(new Q.Spike({x: 2825, y: 1600}));
        stage.insert(new Q.Box({x:195, y:500}));
        stage.insert(new Q.Box({x:451, y:500}));             
        Q.stage().viewport.scale = 0.261;  
        Q.state.set({lanzada: -1, level: 8, completed: false, retry : false});
        stage.flecha = stage.insert(new Q.Flecha({x: 200, y: 300}));
        Q.stageScene("HUD", 2);
    });

    Q.scene("level9",function(stage) {
        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), maxAltura: 1020,
                alturaAnterior: 900}));
        stage.barrel = stage.insert(new Q.Barrel({asset: "BarrelGreen.png", x: 2715, y: 1020}));
        stage.insert(new Q.Box({x:2840, y:1600}));
        stage.insert(new Q.Box({x:2840, y:1349}));
        stage.insert(new Q.Box({x:2580, y:1600}));
        stage.insert(new Q.Box({x:2580, y:1349}));
        //movimiento vertical
        stage.insert(new Q.Box({x:2157, y:1140, movil: true, xIni: 2157, xFin: 2157, yIni: 300, yFin: 1500, velMov: 300, velRot: 50}));
        //movimiento horizontal
        stage.insert(new Q.Box({x:1520, y:630, movil: true, xIni: 800, xFin: 1800, yIni: 630, yFin: 630, velMov: 300, velRot: 150}));        
        var spikeGirado1 = new Q.Spike({x: 2085});
        stage.insert(spikeGirado1);
        spikeGirado1.physics.angle(180); 
        var spikeGirado2 = new Q.Spike({x: 2465});
        stage.insert(spikeGirado2);
        spikeGirado2.physics.angle(180);
        var spikeGirado3 = new Q.Spike({x: 2825});
        stage.insert(spikeGirado3);
        spikeGirado3.physics.angle(180);
        Q.stage().viewport.scale = 0.261;  
        Q.state.set({lanzada: -1, level: 9, completed: false, retry : false});
        stage.flecha = stage.insert(new Q.Flecha({x: 280, y: 1650}));
        Q.stageScene("HUD", 2);
    });

    Q.scene("level10",function(stage) {
        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), x: 500, maxAltura: 1020,
                alturaAnterior: 900}));
        stage.barrel = stage.insert(new Q.Barrel({asset: "BarrelGreen.png", x: 2500, y: 1520}));
        stage.insert(new Q.Box({x:2840, y:1600}));
        stage.insert(new Q.Box({x:2840, y:1349}));
        stage.insert(new Q.Box({x:2157, y:1600}));
        stage.insert(new Q.Box({x:2157, y:1349}));
        stage.insert(new Q.Saw({x: 400, y: 260, movil: true, xIni: 400, xFin: 1000, yIni: 260, yFin: 310, velMov: 300}));
        stage.insert(new Q.Saw({x: 1500, y: 610, movil: true, xIni: 900, xFin: 1500, yIni: 610, yFin: 660, velMov: 300}));
        stage.insert(new Q.Saw({x: 400, y: 960, movil: true, xIni: 400, xFin: 1000, yIni: 960, yFin: 1010, velMov: 300}));
        stage.insert(new Q.Saw({x: 1500, y: 1310, movil: true, xIni: 900, xFin: 1500, yIni: 1310, yFin: 1360, velMov: 300}));             
        Q.stage().viewport.scale = 0.261;  
        Q.state.set({lanzada: -1, level: 10, completed: false, retry : false});
        stage.flecha = stage.insert(new Q.Flecha({x: 500, y: 1650}));
        Q.stageScene("HUD", 2);
    });


    //////////////////////* HUD *//////////////////////


    Q.scene("HUD",function(stage) {
        var container = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: 0, fill: "rgba(0,0,0,0.0)",
        }));

        Q.UI.Text.extend("Live",{
            init: function(p) {
                this._super({
                    label: p.label,
                    x: 0,
                    y: 30,
                    size: 24,
                    color: "white",
                    family: "Fantasia",
                    outlineWidth: 8
                });

                Q.state.on("change.score",this,"score");
            },

            score: function(score) {
                this.p.label = "Level: " + Q.state.get("level") + "  Score: " + Q.state.get("score");
            }
        });

        var label = container.insert(new Q.Live({label: "Level: " + Q.state.get("level") + "  Score: " + Q.state.get("score")}));
        if(Q.state.get("bomba")){
            var bomba = stage.insert(new Q.UI.Button({asset: "bomb.png", scale: 0.8, x: Q.width - 130, y: 55}));

            bomba.on("click",function() {
                if(!Q.state.get("completed")){
                    if(Q.stage(1))
                        Q.stage(1).container.destroy();
                    Q.stage(0).flecha.destroy();
                    Q.stage(0).ball.destroy();
                    Q.stage(0).ball.physics.velocity(0,0);
                    Q.stage(0).ball.physics.removed();
                    Q.stage(0).insert(new Q.Bomba({x: Q.stage(0).barrel.p.x, y: Q.stage(0).barrel.p.y - 800}));
                    bomba.destroy();                                 
                }
            });            
        }

        var retry = stage.insert(new Q.UI.Button({asset: "retry.png", scale: 0.8, x: Q.width - 60, y: 60}));
        retry.on("click",function() {
            if(!Q.state.get("completed") && !Q.state.get("retry") && Q.state.get("lanzada") === 1){
                Q.state.set({retry : true});                
                Q.stage(0).ball.destroy();
                Q.stage(0).ball.physics.velocity(0,0);
                Q.stage(0).insert(new Q.ExplosionBall({x: Q.stage(0).ball.p.x, y: Q.stage(0).ball.p.y}));
                Q.stage(0).ball.physics.removed();
            }
        });

        for(var i = 0; i < Q.state.get("lives"); i++){
            stage.insert(new Q.Sprite({asset:'vida.png',scale:1, x: -(Q.width/2) + 50 + (i*40), y: 30, cy:0}),container);
        }        
        container.fit(20);  
    });


    //////////////////////* CREDITOS *//////////////////////


    Q.scene("creditos1",function(stage) {
            var container = container = stage.insert(new Q.UI.Container({
                x: Q.width/2, y: 5, fill: "rgba(0,0,0,0.0)"
            }));                                        
            var buttonSiguiente = stage.insert(new Q.UI.Button({asset: "siguiente.png", x: Q.width - 60, y: Q.height - 50}));
            buttonSiguiente.on("click",function() {
                Q.clearStages();
                Q.stageScene("creditos2");             
            });
            container.fit(20);
            stage.insert(new Q.Sprite({asset:'Creditos.png',scale:1,x:0,y:0, cy:0}),container);
        });

    Q.scene("creditos2",function(stage) {
            var container = container = stage.insert(new Q.UI.Container({
                x: Q.width/2, y: 5, fill: "rgba(0,0,0,0.0)"
            }));                                        
            var buttonSiguiente = stage.insert(new Q.UI.Button({asset: "siguiente.png", x: Q.width - 60, y: Q.height - 50}));
            buttonSiguiente.on("click",function() {
                Q.clearStages();
                Q.stageScene("creditos3");             
            });
            container.fit(20);
            stage.insert(new Q.Sprite({asset:'Creditos2.png',scale:1,x:0,y:0, cy:0}),container);
        });

    Q.scene("creditos3",function(stage) {
            var container = container = stage.insert(new Q.UI.Container({
                x: Q.width/2, y: 5, fill: "rgba(0,0,0,0.0)"
            }));                                        
            var buttonSiguiente = stage.insert(new Q.UI.Button({asset: "siguiente.png", x: Q.width - 60, y: Q.height - 50}));
            buttonSiguiente.on("click",function() {
                Q.clearStages();
                Q.stageScene("creditos4");             
            });
            container.fit(20);
            stage.insert(new Q.Sprite({asset:'Creditos3.png',scale:1,x:0,y:0, cy:0}),container);
        });

     Q.scene("creditos4",function(stage) {
            var container = container = stage.insert(new Q.UI.Container({
                x: Q.width/2, y: 5, fill: "rgba(0,0,0,0.0)"
            }));                                        
            var buttonCancelar = stage.insert(new Q.UI.Button({asset: "cancel.png", x: Q.width - 60, y: 60}));
            buttonCancelar.on("click",function() {
                Q.clearStages();
                Q.stageScene("mainTitle");             
            });
            container.fit(20);
            stage.insert(new Q.Sprite({asset:'Creditos4.png',scale:1,x:0,y:0, cy:0}),container);
        });


    //////////////////////* CARGA DE RECURSOS *//////////////////////


    Q.loadTMX("level1.tmx, coin.png, coin.json, flecha.png, flecha.json, mainTitle.png, ball.png, ball2.png, ball3.png, ball4.png, bomb.png, vida.png, Spike.png, saw.png, explosion.png, explosion.json, poison.png, poison.json, explosionBall.png, explosionBall.json, creditsButton.png, panelLL.png, panelLC.png, panelLG.png, panelWG.png, ButtonTA.png, ButtonNL.png, ButtonFG.png, ButtonPA.png, Creditos.png, Creditos2.png, Creditos3.png, Creditos4.png, cancel.png, retry.png, siguiente.png, music.mp3, explosion.mp3, poison.mp3, lose.mp3, throw.mp3, music.ogg, explosion.ogg, poison.ogg, lose.ogg, throw.ogg", function() {
        Q.compileSheets("coin.png", "coin.json");
        Q.compileSheets("flecha.png", "flecha.json");
        Q.compileSheets("explosion.png", "explosion.json");
        Q.compileSheets("poison.png", "poison.json");
        Q.compileSheets("explosionBall.png", "explosionBall.json");
        Q.stageScene("mainTitle", 2);
    });   
});