window.addEventListener("load",function() {

	var Q = Quintus({audioSupported: [ 'mp3','ogg' ]})
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        .setup({
            width: 840,
            height: 600,
    }).controls().touch().enableSound();

   	Q.scene("mainTitle",function(stage) {
		Q.stageTMX("level1.tmx",stage);
	});

    Q.loadTMX("level1.tmx", function() {
    	Q.stageScene("mainTitle");
    });   

});