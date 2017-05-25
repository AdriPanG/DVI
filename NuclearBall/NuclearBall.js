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
        density: 4,
        x: p.dx * 50 + 10,
        y: p.dy * 50 + 210,
        seconds: 35
            });

            this.add('2d, platformerControls, aiBounce');
            this.add('physics');
        },

        step: function(dt){
            
        }

    });

    Q.Sprite.extend("WallsTopBot",{

        init: function(p) {
            this._super(p, {
                sheet: "Walls1",
                shape:'polygon',
                gravity: 0,
                density: 0
            });            

            //this.add('physics');
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
            });            
        },

        step: function(dt){
            this.y = this.p.y;
            this.x = this.p.x;
        }

    });

   	Q.scene("level1",function(stage) {

        stage.add("world");
        stage.add("viewport");

        Q.stageTMX("level1.tmx",stage);        

        Q.stage().viewport.scale = 0.261;  
	});

    Q.loadTMX("level1.tmx", function() {
        Q.stageScene("level1");
    });   

});