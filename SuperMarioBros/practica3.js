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
        			jumpSpeed: -400,
        			speed: 200,
        			x: 150,
        			y: 380,
        			direction: "right",
        		});

        		this.add('2d, platformerControls');
        	},

        	step: function(dt) {

        	}

        });


        Q.scene("level1",function(stage) {
            Q.stageTMX("level.tmx",stage);

            var player = stage.insert(new Q.Mario());

            stage.add("viewport").follow(player);
            stage.viewport.offsetX = -20;
			stage.viewport.offsetY = 150;
        });   

        Q.loadTMX("level.tmx, mario_small.png, mario_small.json", function() {
        	Q.compileSheets("mario_small.png","mario_small.json");
            Q.stageScene("level1");
        });   

});