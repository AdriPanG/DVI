window.addEventListener("load",function() {
		
		var Q = Quintus()
            .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
            .setup({
                width: 320,
                height: 480,
        }).controls().touch();  

        Q.Sprite.extend("Mario",{

        	init: function(p) {
        		this._super(p, {
        			sheet: "marioR",
        			sprite: "mario_small",
        			jumpSpeed: -420,
        			speed: 200,
        			x: 150,
        			y: 380,
        			direction: "right",
        		});

        		this.add('2d, platformerControls');
        	},

        	step: function(dt) {
        		if(this.p.y > 580){
					//Q.stageScene("endGame", 1, {label: "Game over"});
					this.p.x = 150;
					this.p.y = 380;
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
        			direction: "left",
        		});

        		this.add('2d, aiBounce');

        		this.on("bump.left,bump.right,bump.bottom",function(collision){
        			if(collision.obj.isA("Mario")) {
        				//Q.stageScene("endGame", 1, {label: "You Died"});
        				collision.obj.destroy();
        				Q.stageScene("level1");
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

        Q.scene("level1",function(stage) {
            Q.stageTMX("level.tmx",stage);

            var player = stage.insert(new Q.Mario());

            stage.insert(new Q.Goomba());

            stage.add("viewport").follow(player);
            stage.viewport.offsetX = -20;
			stage.viewport.offsetY = 160;
        });   

        Q.loadTMX("level.tmx, mario_small.png, mario_small.json, goomba.png, goomba.json", function() {
        	Q.compileSheets("mario_small.png", "mario_small.json");
        	Q.compileSheets("goomba.png", "goomba.json");
            Q.stageScene("level1");
        });   

});