window.addEventListener("load",function() {
		
		var Q = Quintus()
            .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
            .setup({
                width: 320,
                height: 480,
        }).controls().touch();  

        Q.animations("mario anim", {
					"marioR":{frames: [0,1,2], rate: 1/10},
					"marioL":{frames: [14,15,16], rate: 1/10},
					"stand_right":{frames: [0], rate: 1/10, loop: false},
					"stand_left":{frames: [14], rate: 1/10, loop: false}
		});

        Q.Sprite.extend("Mario",{

        	init: function(p) {
        		this._super(p, {
        			sprite: "mario anim",
        			sheet: "mario",
        			jumpSpeed: -420,
        			speed: 200,
        			x: 150,
        			y: 380,
        			direction: "right",
        		});

        		this.add('2d, platformerControls, animation');
        	},

        	step: function(dt) {
				if(this.p.vx > 0) {
				 	this.play("marioR");
				 } else if(this.p.vx < 0) {
					this.play("marioL");
				 } else {
				 	this.play("stand_" + this.p.direction);
				 }

        		if(this.p.y > 580){
   					Q.stageScene("endGame", 1, {label: "Game over"});
					this.p.y = 579;
				}
        	}

        });

        Q.Sprite.extend("Goomba",{
        	
        	init: function(p) {
        		this._super(p, {
        			sheet: "goomba",
        			sprite: "goomba",
        			speed: 180,
        			frame: 0,
        			vx: 100,
        			x: 800,
        			y: 380,
        		});

        		this.add('2d, aiBounce');

        		this.on("bump.left,bump.right,bump.bottom",function(collision){
        			if(collision.obj.isA("Mario")) {
        				Q.stageScene("endGame", 1, {label: "Game over"});
        				collision.obj.destroy();
        			}
        		});

        		this.on("bump.top",function(collision){
        			if(collision.obj.isA("Mario")) {
        				this.destroy();
        				collision.obj.p.vy = -200;
        			}
        		});
        	},

        	step: function(dt) {

        	}
        });

        Q.Sprite.extend("Bloopa",{
        	
        	init: function(p) {
        		this._super(p, {
        			sheet: "bloopa",
        			sprite: "bloopa",
        			gravity: 0,
        			frame: 0,
        			vy: 100,
        			x: 500,
        			y: 380,
        		});

        		this.timeJump = 0;
        		this.add('2d, aiBounce');

        		this.on("bump.left,bump.right,bump.bottom",function(collision){
        			if(collision.obj.isA("Mario")) {
        				Q.stageScene("endGame", 1, {label: "Game over"});
        				collision.obj.destroy();
        			}
        		});

        		this.on("bump.top",function(collision){
        			if(collision.obj.isA("Mario")) {
        				this.destroy();
        				collision.obj.p.vy = -200;
        			}
        		});
        	},

        	step: function(dt) {
        		
        		this.timeJump += dt;

				if(this.p.vy == 0){
					this.p.vy = -50;
					this.timeJump = 0;
				}

				if (this.timeJump >= 2)
					this.p.vy = 120;
	        	}
        });


        Q.Sprite.extend("Princess",{
        	
        	init: function(p) {
        		this._super(p, {
        			asset: "princess.png",
        			frame: 0,
        			x: 3000,
        			y: 520,
        			sensor: true,
        		});

        		this.on("sensor");
        	},

        	sensor: function() {
        		Q.stageScene("endGame", 1, {label: "Marios wins"});
        		this.p.sensor = false;
        		//Bloquear a Mario para que no se mueva
        	} 

        });			

        Q.scene("endGame",function(stage) {
			var container = stage.insert(new Q.UI.Container({
			   	x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
			}));

			var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
			                                                  label: "Play Again" }))         
			var label = container.insert(new Q.UI.Text({x: 0, y: -10 - button.p.h, 
			                                                   label: stage.options.label }));
			button.on("click",function() {
			   	Q.clearStages();
			    Q.stageScene("level1");
			});

			container.fit(20);
		});

        Q.scene("level1",function(stage) {
            var container = stage.insert(new Q.UI.Container({
			   	x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
			}));

			var button = container.insert(new Q.UI.Button({asset: "mainTitle.png", x: 0, y: 0}))         
			button.on("click",function() {
				Q.stageTMX("level.tmx",stage);

			   	var player = stage.insert(new Q.Mario());
 
	            stage.insert(new Q.Goomba());
	            stage.insert(new Q.Bloopa());
	            stage.insert(new Q.Princess());

	            stage.add("viewport").follow(player);
	            stage.viewport.offsetX = -20;
				stage.viewport.offsetY = 160;
			});

			container.fit(20);
            
        });   

        Q.loadTMX("level.tmx, mainTitle.png, mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json, princess.png", function() {
        	Q.compileSheets("mario_small.png", "mario_small.json");
        	Q.compileSheets("goomba.png", "goomba.json");
        	Q.compileSheets("bloopa.png", "bloopa.json");
            Q.stageScene("level1");
        });   

});