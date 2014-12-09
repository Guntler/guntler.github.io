
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		score : 0
	},
	
	
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	if (!me.video.init("screen",  me.video.CANVAS, 1280, 720, true, 'auto')) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(this, me.debug.Panel, "debug", me);
		});
	}

	// Initialize the audio.
	me.audio.init("ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		me.state.set(me.state.GAMEOVER, new game.GameOverScreen());
		
		// register our player entity in the object pool
		me.pool.register("mainPlayer", game.PlayerEntity);
		me.pool.register("bullet", game.BulletEntity, true);
		me.pool.register("enemy", game.EnemyEntity, true);
		me.pool.register("catbot", game.CatbotEntity, true);
		me.pool.register("spawner", game.SpawnerEntity, true);
		me.pool.register("PathNode", game.PathNodeEntity, true);
		me.pool.register("PlatformArea", game.PlatformAreaEntity, true);
		
		// Start the game.
		me.state.change(me.state.MENU);
	}
};
