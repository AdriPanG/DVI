window.addEventListener("load",function() {

		var Q = Quintus()
            .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
            .setup({
                width: 320,
                height: 480,
        }).controls().touch();  

        Q.animations("mario anim", {
					"marioR":{frames: [1,2,3], rate: 1/10},
					"marioL":{frames: [15,16,17], rate: 1/10},
					"stand_right":{frames: [0], rate: 1/10, loop: false},
					"stand_left":{frames: [14], rate: 1/10, loop: false},
					"jumping_right":{frames: [4], rate: 1/10, loop: false},
					"jumping_left":{frames: [18], rate: 1/10, loop: false},
					"mario_die":{frames: [12], rate: 1/10, loop: false}
		});

        Q.Sprite.extend("Mario",{

        	init: function(p) {
        		this._super(p, {
        			sprite: "mario anim",
        			sheet: "mario",
        			jumpSpeed: -420,
        			speed: 200,
        			x: 160,
        			y: 480,
        			vy: 10,
        			direction: "right"
        		});

        		this.add('2d, platformerControls, animation');
        	},        	

        	step: function(dt) {

        		if(this.p.jumping && this.p.landed < 0) {
					this.play("jumping_" + this.p.direction);
				} else if (this.p.landed > 0){    
					if(this.p.vx > 0) {
					 	this.play("marioR");
					 } else if(this.p.vx < 0) {
						this.play("marioL");
					 } else {
					 	this.play("stand_" + this.p.direction);
					 }
				}

        		if(this.p.y > 580){
        			this.play("mario_die");
   					Q.stageScene("endGame", 1, {label: "Game over"});
					this.p.y = 579;
				}
				
        	}

        });

        Q.animations("goomba anim", {
					"goomba_walk":{frames: [0,1], rate: 1/5},
					"goomba_die":{frames: [2], rate: 1/5, loop: false, trigger: "died"}
		});

        Q.Sprite.extend("Goomba",{
        	
        	init: function(p) {
        		this._super(p, {
        			sprite: "goomba anim",
        			sheet: "goomba",
        			speed: 180,
        			frame: 0,
        			vx: 100,
        			x: 1000,
        			y: 380,
        		});

        		this.add('2d, aiBounce, animation');

        		this.play("goomba_walk");

        		this.on("died",this,"goombadie");

        		this.on("bump.left,bump.right,bump.bottom",function(collision){
        			if(collision.obj.isA("Mario")) {
        				//player.play("mario_die");
        				Q.stageScene("endGame", 1, {label: "Game over"});
        				collision.obj.destroy();
        			}
        		});

        		this.on("bump.top",function(collision){
        			if(collision.obj.isA("Mario")) {
        				this.play("goomba_die");
        				collision.obj.p.vy = -200;
        			}
        		});
        	},

        	goombadie: function() {
        		this.destroy();
        	},

        	step: function(dt) {
        		
        	}
        });

        Q.animations("bloopa anim", {
					"bloopa_walk":{frames: [0,1], rate: 1/3},
					"bloopa_die":{frames: [2], rate: 1/3, loop: false, trigger: "died"}
		});

        Q.Sprite.extend("Bloopa",{
        	
        	init: function(p) {
        		this._super(p, {
        			sprite: "bloopa anim",
        			sheet: "bloopa",
        			gravity: 0,
        			frame: 0,
        			vy: 100,
        			x: 500,
        			y: 380,
        		});

        		this.timeJump = 0;
        		this.add('2d, aiBounce, animation');

        		this.play("bloopa_walk");

        		this.on("died",this,"bloopadie");

        		this.on("bump.left,bump.right,bump.bottom",function(collision){
        			if(collision.obj.isA("Mario")) {
        				//player.play("mario_die");
        				Q.stageScene("endGame", 1, {label: "Game over"});
        				collision.obj.destroy();
        			}
        		});

        		this.on("bump.top",function(collision){
        			if(collision.obj.isA("Mario")) {
        				this.play("bloopa_die");
        				collision.obj.p.vy = -200;
        			}
        		});
        	},

        	bloopadie: function() {
        		this.destroy();
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

        Q.Sprite.extend("Coin",{
        	
        	init: function(p) {
        		this._super(p, {
        			sprite: "coin",
        			sheet: "coin",
        			frame: 2,
        			x: 350,
        			y: 470,
        			sensor: true
        		});

				this.add("tween");

        		this.on("sensor");		
        	},

        	sensor: function() {
        		var callDestroy = function(){
        			this.destroy();
        		}
        		this.animate({ x: this.p.x, y: this.p.y - 50, angle: 0},0.3,{callback: callDestroy});         		
        	},

        	step: function(dt) {
        		
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
			    Q.stageScene("mainTitle");
			});

			container.fit(20);
		});

		Q.scene("mainTitle",function(stage) {
			var container = stage.insert(new Q.UI.Container({
			   	x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
			}));

			var button = container.insert(new Q.UI.Button({asset: "mainTitle.png", x: 0, y: 0}))         
			button.on("click",function() {
				Q.clearStages();
				Q.stageScene("level1");
			});

			container.fit(20);
		});

        Q.scene("level1",function(stage) {
            Q.stageTMX("level.tmx",stage);

		   	var player = stage.insert(new Q.Mario());

            stage.insert(new Q.Goomba());
            stage.insert(new Q.Bloopa());
            stage.insert(new Q.Princess());
            stage.insert(new Q.Coin());

            stage.add("viewport").follow(player, {x: true, y: true}, {minX: -200, maxX: 256*16, minY: 125, maxY: 32*16});
            
        });   

        Q.loadTMX("level.tmx, mainTitle.png, mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json, princess.png, coin.png, coin.json", function() {
        	Q.compileSheets("mario_small.png", "mario_small.json");
        	Q.compileSheets("goomba.png", "goomba.json");
        	Q.compileSheets("bloopa.png", "bloopa.json");
        	Q.compileSheets("coin.png", "coin.json");
            Q.stageScene("mainTitle");
        });   

});