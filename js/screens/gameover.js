game.GameOverScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		me.audio.stopTrack();
		// load a level
		var gImage =  me.loader.getImage('gameover');
		me.game.world.addChild(new me.Sprite(
			0,
			0,
			gImage
		), 12);

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);

		me.input.bindKey(me.input.KEY.C, "enter", false);
		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			if (action === "enter") {
				me.state.change(me.state.PLAY);
			}
		});
	},

	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});
