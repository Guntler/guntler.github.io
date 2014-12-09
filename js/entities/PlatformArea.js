game.PlatformAreaEntity = me.Entity.extend({

    /* -----
     constructor
     ------ */
    init: function (x,y,settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // set the default horizontal & vertical speed (accel vector)

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

		this.position = this.body.pos;
		this.body.setCollisionType = me.collision.types.NO_OBJECT;
		
		this.area = settings.type;
		pathfinding.PlatformAreas[settings.type] = this;
    },

    onCollision : function (response, other) {
        return false;
    }
})