game.PathNodeEntity = me.Entity.extend({

    /* -----
     constructor
     ------ */
    init: function (x,y,settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // set the default horizontal & vertical speed (accel vector)

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

		//this.body.removeShapeAt(0);
		//this.body.addShape(new me.Rect(x,y,10,10));
		this.position = this.pos;
		this.node = settings.type;
		this.neighbors = pathfinding.NavMesh[settings.type];
		this.body.setCollisionType = me.collision.types.NO_OBJECT;

		pathfinding.Nodes[settings.type] = this;
    },

    onCollision : function (response, other) {
        return false;
    }
})