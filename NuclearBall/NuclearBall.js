window.addEventListener("load",function() {

	var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio, SVG, Physics")
        .setup('NuclearBall', {
            width: 800,
            height: 467,
    }).touch();

    var point;

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
                seconds: 10,
                maxAltura: 1527,
                alturaAnterior: 1650,
                ratioVelocidad: 0,
                retry: true
            });

            this.add('physics');
        },

        fire: function() {
            this.p.dx = Math.cos(this.p.angle / 180 * Math.PI),
            this.p.dy = Math.sin(this.p.angle / 180 * Math.PI),
            this.physics.velocity(this.p.dx*888*this.p.ratioVelocidad,this.p.dy*888*this.p.ratioVelocidad);
        },

        step: function(dt){
            this.p.seconds -= dt;
            if(this.p.y > this.p.alturaAnterior)
                this.p.maxAltura = this.p.alturaAnterior;
            if(this.p.seconds < 0 && this.p.maxAltura > 1527){
                if(Q.state.get("lives") === 0 && Q.state.get("moneda")){                    
                    if(this.p.retry){
                        this.p.retry = false;
                        var randNum = Math.floor((Math.random() * 2) + 1);
                        Q.stage(0).insert(new Q.Coin({rand: randNum}));
                    }
                } else if (Q.state.get("lives") === 0 && this.p.retry) {
                    this.destroy();
                    Q.stageScene("loseGame", 1);
                } else {
                    this.destroy();
                    Q.stageScene("tryAgain", 1);
                }
            }
            this.p.alturaAnterior = this.p.y;
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
            });         

            this.add('physics');   
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
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
                restitution: 0,
            });         

            this.add('physics, 2d');
            this.on('bump.bottom',this,'bottom');
        },

        bottom: function(collision) {
            if(collision.obj.isA("Ball")) {
                collision.obj.destroy();
                Q.stageScene("tryAgain", 1);                    
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
                w: 256                
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
                density: 1,
                h: 256,
                w: 68
            });         

            this.add('physics');   
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
            Q.state.set({moneda: false});
            Q.stageScene("tryAgain", 1);
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
        }

    });

    Q.animations("explosion anim", {
                    "explota":{frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], rate: 1/5, loop: false, trigger: "fin"}
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
            this.play("explota");
        },

        fin: function(){            
            Q.stageScene("nextLevel", 1);
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
        }

    });

    Q.scene("nextLevel",function(stage) {
        stage.container = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));

        stage.container.button = stage.container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                          label: "Next Level" }));         
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
            x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));

        stage.container.button = stage.container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                          label: "Play Again" }, function() {
                                        Q.clearStages();
                                        Q.stageScene("level1");
                            }, { keyActionName: 'action' }));         
        var label = stage.container.insert(new Q.UI.Text({x: 0, y: -10 - stage.container.button.p.h, 
                                                               label: "You lose", color: "white"}));

        stage.container.button.on("click",function() {
            Q.clearStages();                            
            Q.stageScene("mainTitle", 2); 
        });

        stage.container.fit(20);
    });

    Q.scene("tryAgain",function(stage) {
        stage.container = stage.insert(new Q.UI.Container({
            x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));

        stage.container.button = stage.container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                          label: "Try Again" } ));         
        var label = stage.container.insert(new Q.UI.Text({x: 0, y: -10 - stage.container.button.p.h, 
                                                               label: "You failed", color: "white"}));

        stage.container.button.on("click",function() {
            Q.state.dec("lives",1);  
            Q.clearStages();                            
            Q.stageScene("level" + Q.state.get("level")); 
        });

        stage.container.fit(20);
    });

    Q.scene("mainTitle",function(stage) {
            var container = container = stage.insert(new Q.UI.Container({
                x: Q.width/2, y: 5, fill: "rgba(0,0,0,0.0)"
            }));   
                                     
            var button = stage.insert(new Q.UI.Button({asset: "ball.png", x: Q.width/2 - 180, y: Q.height/2 + 60}));
            button.on("click",function() {
                Q.state.set({score: 0, lives: 3, level: 1, lanzada: -1, moneda: true, bomba: true, assetBall: "ball.png"});
                Q.clearStages();
                Q.stageScene("level1");             
            });

            var button = stage.insert(new Q.UI.Button({asset: "ball2.png", x: Q.width/2 - 60, y: Q.height/2 + 60}));
            button.on("click",function() {
                Q.state.set({score: 0, lives: 3, level: 1, lanzada: -1, moneda: true, bomba: true, assetBall: "ball2.png"});
                Q.clearStages();
                Q.stageScene("level1");             
            });

            var button = stage.insert(new Q.UI.Button({asset: "ball3.png", x: Q.width/2 + 60, y: Q.height/2 + 60}));
            button.on("click",function() {
                Q.state.set({score: 0, lives: 3, level: 1, lanzada: -1, moneda: true, bomba: true, assetBall: "ball3.png"});
                Q.clearStages();
                Q.stageScene("level1");             
            });

            var button = stage.insert(new Q.UI.Button({asset: "ball4.png", x: Q.width/2 + 180, y: Q.height/2 + 60}));
            button.on("click",function() {
                Q.state.set({score: 0, lives: 3, level: 1, lanzada: -1, moneda: true, bomba: true, assetBall: "ball4.png"});
                Q.clearStages();
                Q.stageScene("level1");             
            });

            container.fit(20);

            stage.insert(new Q.Sprite({asset:'mainTitle.png',scale:1,x:0,y:0, cy:0}),container);
        });

   	Q.scene("level1",function(stage) {

        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.flecha = stage.insert(new Q.Flecha({x: 280, y: 1650}));
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall")}));        
        stage.insert(new Q.Barrel());
        stage.insert(new Q.Box());
        stage.insert(new Q.Box({y:1100}));
        stage.insert(new Q.Box({y:1350}));
        stage.insert(new Q.Box({y:1600}));        

        var boxGirada = new Q.Box({x: 500, y:500, angle: 45, dx: 10, dy: 10});
        stage.insert(boxGirada);
        boxGirada.physics.angle(45);        
             
        Q.stage().viewport.scale = 0.261;  

        Q.state.set({lanzada: -1, level: 1, score : 0});

        Q.stageScene("HUD", 2);


	});

	Q.scene("level2",function(stage) {

        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.flecha = stage.insert(new Q.Flecha({x: 280, y: 1650}));
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), maxAltura: 1030,
                alturaAnterior: 900}));
        stage.insert(new Q.Barrel({x:2840, y: 1024}));
        stage.insert(new Q.Box({x:2040, y:650}));
        stage.insert(new Q.Box({x:2296, y:800}));
        stage.insert(new Q.Box({x:2552, y:950})); 
        stage.insert(new Q.Box({x:2840, y: 1354}));
        stage.insert(new Q.Box({x:2840, y: 1600}));   

             
        Q.stage().viewport.scale = 0.261;  

        Q.state.set({lanzada: -1, level: 2});

        Q.stageScene("HUD", 2);

	});

    Q.scene("level3",function(stage) {

        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.flecha = stage.insert(new Q.Flecha({x: 2840, y: 1650}));
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), x: 2840, maxAltura: 1030,
                alturaAnterior: 900}));
        stage.insert(new Q.Barrel({x:1520}));
        //stage.insert(new Q.Box({x:2040, y:650}));
        stage.insert(new Q.Box({x:2121, y:862}));
        stage.insert(new Q.Box({x:2021, y:1108})); 
        stage.insert(new Q.Box({x:1921, y: 1354}));
        stage.insert(new Q.Box({x:1821, y: 1600}));   

             
        Q.stage().viewport.scale = 0.261;  

        Q.state.set({lanzada: -1, level: 3});

        Q.stageScene("HUD", 2);

    });

    Q.scene("level4",function(stage) {

        stage.add("world");
        Q.stageTMX("level1.tmx",stage);   
        stage.add("viewport");
        stage.flecha = stage.insert(new Q.Flecha({x: 2840, y: 1650}));
        stage.ball = stage.insert(new Q.Ball({asset: Q.state.get("assetBall"), x: 2840, maxAltura: 1030,
                alturaAnterior: 900}));
        stage.insert(new Q.Barrel({x:280}));
        //stage.insert(new Q.Box({x:581, y:862}));
        stage.insert(new Q.Box({x:600, y:1108})); 
        stage.insert(new Q.Box({x:600, y: 1354}));
        stage.insert(new Q.Box({x:600, y: 1600})); 

        var spikeGirado = new Q.Spike();
        stage.insert(spikeGirado);
        spikeGirado.physics.angle(180); 
             
        Q.stage().viewport.scale = 0.261;  

        Q.state.set({lanzada: -1, level: 4});

        Q.stageScene("HUD", 2);

    });


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
            //e.preventDefault();  
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
            //e.preventDefault();
        } 
    }

    Q._each(["touchend","mouseup"],function(evt) {
        Q.wrapper.addEventListener(evt,canonFire);
    });


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
                    size: 18,
                    color: "white",
                });

                Q.state.on("change.score",this,"score");
            },

            score: function(score) {
                this.p.label = "Level: " + Q.state.get("level") + "  Score: " + Q.state.get("score");
            }
        });

        var label = container.insert(new Q.Live({label: "Level: " + Q.state.get("level") + "  Score: " + Q.state.get("score")}));

        if(Q.state.get("bomba")){
            var button = stage.insert(new Q.UI.Button({asset: "bomb.png", scale: 0.8, x: Q.width - 55, y: 55}));

            button.on("click",function() {
                Q.state.set({lanzada: -1, bomba: false});
                Q.stageScene("nextLevel", 1);             
            });
        }

        for(var i = 0; i < Q.state.get("lives"); i++){
            stage.insert(new Q.Sprite({asset:'vida.png',scale:1, x: -(Q.width/2) + 50 + (i*40), y: 30, cy:0}),container);
        }        

        container.fit(20);  
    });

    Q.loadTMX("level1.tmx, coin.png, coin.json, flecha.png, flecha.json, mainTitle.png, ball.png, ball2.png, ball3.png, ball4.png, bomb.png, vida.png, Spike.png, explosion.png, explosion.json", function() {
        Q.compileSheets("coin.png", "coin.json");
        Q.compileSheets("flecha.png", "flecha.json");
        Q.compileSheets("explosion.png", "explosion.json");
        Q.stageScene("mainTitle", 2);
    });   
});