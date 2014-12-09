/**
 * Created by pbpdi_000 on 06/12/2014.
 */
game.BaseEntity = me.Entity.extend({

    /* -----
     constructor
     ------ */
    init: function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 15);
        this.body.setMaxVelocity(5, 15);
        this.body.setFriction(0.3, 0);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.invincible = false;
        this.health = 60;
        this.direction = "right";
        this.isHurt = false;
        this.stunnedTime = 0;
        this.alive = true;
        this.playedDead = false;
    },

    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    },

    hurt: function(val) {
        this.health-=val;
    },

    switchAnimation : function(name) {
        if (!this.renderable.isCurrentAnimation(name)) {
            this.renderable.setAnimationFrame();
            this.renderable.setCurrentAnimation(name);
        }
    }
})

