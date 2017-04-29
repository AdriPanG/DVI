window.addEventListener("load",function() {

		var Q = Quintus({audioSupported: [ 'mp3','ogg' ]})
            .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
            .setup({
                width: 320,
                height: 480,
        }).controls().touch().enableSound();

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
        			direction: "right",
        			moverse: true,
        			muerto: false,
        			caminaMeta: false,
        			meta: false
        		});

        		this.add('2d, platformerControls, animation, tween');

        		this.on("die", this, "die");
        		this.on("win", this, "win");
        	},    

        	die: function(){
        		Q.audio.stop("music_main.mp3");

        		Q.audio.play('music_die.mp3');
        		this.p.muerto = true;
        		this.p.moverse = false;
        		var callDestroy = function(){        			
        			this.destroy();
        			setTimeout(function() {
					 	if(Q.state.get("lives") === 0){
	        				Q.stageScene("looseGame", 1);
	        			} else {
	        				Q.state.dec("lives",1); 
	        				Q.clearStages();
				    		Q.stageScene("level1");
	        			}
					}, 2000);        			
        		} 
        		var caeHaciaAbajo = function(){     
        			this.animate({ x: this.p.x, y: this.p.y + (620 - this.p.y), angle: 0},0.6,{callback: callDestroy}); 
        		} 
        		this.animate({ x: this.p.x, y: this.p.y - 75, angle: 0},0.3,{callback: caeHaciaAbajo}); 
        	}, 	

        	win: function(){
        		this.p.moverse = false;
        	},

        	step: function(dt) {
        		if(this.p.muerto){
        			this.play("mario_die");
        		} else {
        			if(this.p.x >= 2850){
        				this.p.speed = 0;
        				this.p.jumpSpeed = 0;
        				if(this.p.caminaMeta && this.p.landed > 0){
        					this.play("marioR")
        					this.p.x += dt * 100;
        					if(this.p.x >= 3135){        						
        						this.destroy();
        					}
        				}
        				else{
        					Q.audio.stop("music_main.mp3");
        					if(!this.p.meta){
        						Q.audio.play('music_level_complete.mp3');
        						this.p.meta = true;
        					}
        					if (this.p.landed > 0) this.p.caminaMeta = true;
        					else
        					this.animate({ x: this.p.x, y: this.p.y + (528 - this.p.y), angle: 0},1,{callback: function(){
	        					this.p.caminaMeta = true;
	        				}}); 
        				}        				
        			}
        			else{
        				if(this.p.moverse){
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
		        		}
		        		else{
		        			this.play("stand_" + this.p.direction);
		        			this.p.speed = 0;
		        			this.p.jumpSpeed = 0;
		        		}

		        		if(this.p.y > 580){
		        			this.trigger("die");
						}
        			}	        		
        		}

        		
				
        	}

        });

        Q.component("defaultEnemy", {
        	added: function() {
        		var collisioned = false;
        		this.entity.add('2d, aiBounce, animation');
        		this.entity.play("walk");
        		this.entity.on("died",this,"die");
				this.entity.on('bump.top',this,'top');
				this.entity.on('bump.left,bump.right,bump.bottom',this,'coll');
			},

			top: function(collision) {
				if(collision.obj.isA("Mario")) {
					if(!this.collisioned){
	    				this.entity.play("die");
	    				collision.obj.p.vy = -200;
	    				this.collisioned = true;
    				}
    			}
			 },

			 coll: function(collision){
			 	if(collision.obj.isA("Mario")) {
    				if(!this.collisioned){    					
    					collision.obj.trigger("die");
    					this.collisioned = true;
    				}
    			}
			 },

			die: function() {
        		this.entity.destroy();
        	}
		});

        Q.animations("goomba anim", {
					"walk":{frames: [0,1], rate: 1/5},
					"die":{frames: [2], rate: 1/3, loop: false, trigger: "died"}
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

        		this.add("defaultEnemy");
        	},

        	step: function(dt) {
        		
        	}
        });

        Q.animations("bloopa anim", {
					"walk":{frames: [0,1], rate: 1/3},
					"die":{frames: [2], rate: 1/3, loop: false, trigger: "died"}
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

        		this.add("defaultEnemy");
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

        Q.animations("koopa anim", {
        			"walk":{frames: [0,1], rate: 1/5},
					"walk_right":{frames: [0,1], rate: 1/5},
					"walk_left":{frames: [4,5], rate: 1/5},
					"caparazon":{frames: [8], rate: 1/3},
					"die":{frames: [10], rate: 1/3, loop: false, trigger: "died"}
		});

        Q.Sprite.extend("Koopa",{
        	
        	init: function(p) {
        		this._super(p, {
        			sprite: "koopa anim",
        			sheet: "koopa",
        			speed: 180,
        			xAnt: 0,
        			frame: 0,
        			vx: 100,
        			x: 1600,
        			y: 380,
        			firstCollision: false
        		});

        		this.add("defaultEnemy");
        		this.on('bump.top',this,'top');
        	},

        	top: function(collision) {
        		if(collision.obj.isA("Mario")) {
					this.play("caparazon");
	    			this.p.firstCollision = true;
    			}
			 },

        	step: function(dt) {
        		if(!this.p.firstCollision){
	        		if(this.p.xAnt > this.p.x)
	        			this.play("walk_left");
	        		else
	        			this.play("walk_right");
	        		this.p.xAnt = this.p.x;        		
	        	}
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
        			sensor: true,
        			puntuado: false
        		});

				this.add("tween");

        		this.on("sensor");		
        	},

        	sensor: function() {
        		var callDestroy = function(){        			
        			this.destroy();
        		}        		
        		this.animate({ x: this.p.x, y: this.p.y - 50, angle: 0},0.3,{callback: callDestroy}); 
        		if(!this.p.puntuado){
        			Q.audio.play('coin.mp3');
    				Q.state.inc("score",50);
    				this.p.puntuado = true;
    			}        		
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
        		Q.stageScene("winGame", 1);
        		this.p.sensor = false;
        		//Bloquear a Mario para que no se mueva
        		Q("Mario").trigger("win");
        	} 

        });	
	

        Q.scene("looseGame",function(stage) {        	
			var container = stage.insert(new Q.UI.Container({
			   	x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
			}));

			var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
			                                                  label: "Play Again" }));         
			var label = container.insert(new Q.UI.Text({x: 0, y: -10 - button.p.h, 
			                                                   label: "Game over" }));
			button.on("click",function() {
			   	Q.clearStages();
			    Q.stageScene("mainTitle");
			});

			container.fit(20);
		});

		Q.scene("winGame",function(stage) {
        	Q.audio.stop("music_main.mp3");

        	Q.audio.play('music_level_complete.mp3');
			var container = stage.insert(new Q.UI.Container({
			   	x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
			}));

			var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
			                                                  label: "Play Again" }));         
			var label = container.insert(new Q.UI.Text({x: 0, y: -10 - button.p.h, 
			                                                   label: "Mario wins" }));
			button.on("click",function() {
			   	Q.clearStages();
			    Q.stageScene("mainTitle");
			});

			container.fit(20);
		});

		Q.scene("mainTitle",function(stage) {
			Q.audio.stop("music_level_complete.mp3");

			var container = stage.insert(new Q.UI.Container({
			   	x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
			}));

			var button = container.insert(new Q.UI.Button({asset: "mainTitle.png", x: 0, y: 0}, function() {
										Q.clearStages();
										Q.stageScene("level1");
								}, { keyActionName: 'confirm' }));   
								      
			button.on("click",function() {
				Q.clearStages();
				Q.stageScene("level1");				
			});		

			Q.state.reset({ score: 0, lives: 2 });

			container.fit(20);
		});

        Q.scene("level1",function(stage) {
            Q.stageTMX("level.tmx",stage);

		   	var player = stage.insert(new Q.Mario());

            stage.insert(new Q.Goomba());
            stage.insert(new Q.Bloopa());
            stage.insert(new Q.Koopa());
            //stage.insert(new Q.Princess());

            // Monedas
            stage.insert(new Q.Coin({x:350, y: 470}));
            stage.insert(new Q.Coin({x:650, y: 300}));
            stage.insert(new Q.Coin({x:850, y: 420}));
            stage.insert(new Q.Coin({x:1150, y: 470}));
            stage.insert(new Q.Coin({x:1900, y: 380}));
            stage.insert(new Q.Coin({x:1900, y: 420}));
            stage.insert(new Q.Coin({x:1900, y: 460}));
            stage.insert(new Q.Coin({x:1920, y: 400}));
            stage.insert(new Q.Coin({x:1940, y: 420}));
            stage.insert(new Q.Coin({x:1960, y: 400}));
            stage.insert(new Q.Coin({x:1980, y: 380}));
            stage.insert(new Q.Coin({x:1980, y: 420}));
            stage.insert(new Q.Coin({x:1980, y: 460}));               

            stage.add("viewport").follow(player, {x: true, y: true}, {minX: -200, maxX: 256*16, minY: 125, maxY: 32*16});

            Q.audio.play('music_main.mp3',{ loop: true });

            Q.stageScene("scoreLabel", 1);
            
        }); 

        Q.scene("scoreLabel",function(stage) {
			var container = stage.insert(new Q.UI.Container({
			   	x: Q.width/2, y: 0, fill: "rgba(0,0,0,0.0)"
			}));

			Q.UI.Text.extend("Score",{
				init: function(p) {
					this._super({
						label: p.label,
						x: 0,
						y: 0
					});

					Q.state.on("change.score",this,"score");
					//Q.state.on("change.lives",this,"lives");
				},

				score: function(score) {
					this.p.label = "Score: " + score + " Lives: " + Q.state.get("lives");
				}
			});

			var label = container.insert(new Q.Score({label: "Score: " + Q.state.get("score") + " Lives: " + Q.state.get("lives")}));

			container.fit(20);	
		});

        ;  

        Q.loadTMX("level.tmx, mainTitle.png, mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json, koopa.json, koopa.png, princess.png, coin.png, coin.json, music_main.mp3, music_die.mp3, music_level_complete.mp3, coin.mp3", function() {
        	Q.compileSheets("mario_small.png", "mario_small.json");
        	Q.compileSheets("goomba.png", "goomba.json");
        	Q.compileSheets("bloopa.png", "bloopa.json");
        	Q.compileSheets("koopa.png", "koopa.json");
        	Q.compileSheets("coin.png", "coin.json");
            Q.stageScene("mainTitle");
        });   

});