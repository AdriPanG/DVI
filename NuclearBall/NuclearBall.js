window.addEventListener("load",function() {

	var Q = Quintus({audioSupported: [ 'mp3','ogg' ]})
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        .setup({
            width: 800,
            height: 467,
    }).controls().touch().enableSound();

    Q.Sprite.extend("Ball",{

        init: function(p) {
            this._super(p, {
                sheet: "Ball",
                frame: 0,
                scale: 2,
                jumpSpeed: -8000
            });

            this.add('2d, platformerControls');
            
        }

    });

    Q.Sprite.extend("WallsTopBot",{

        init: function(p) {
            this._super(p, {
                sheet: "Walls1",
            });            
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
        }

    });

   	Q.scene("mainTitle",function(stage) {

        Q.stageTMX("level1.tmx",stage);

        stage.add("viewport");

        Q.stage().viewport.scale = 0.261;

	});

    Q.loadTMX("level1.tmx, ballsprites.png", function() {
    	Q.stageScene("mainTitle");
    });   

});