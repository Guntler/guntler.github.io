game.bullets = {
    hadouken: {
        name: 'Hadouken',
        image: "bullets",
        animation: [2, 3, 4, 5],
        rate: 225,
        damage: 30,
        stun: true,
        xDelay: 300,	//delay applied to enemy movement after being hit
        radius: 300,		//in pixels
        explosiveDmg: 100,
        speedX: 30,
        speedY: 0,
        width: 8,
        height: 8,
        spritewidth: 8,
        spriteheight: 8,
        attackRect: [[18, 27, 6, 13]] //down, left, right, up
    },
    pistolBullet: {
        name: 'Pistol Bullet',
        image: "bullets",
        animation: [2, 3, 4, 5],
        rate: 225,
        damage: 10,
        stun: true,
        xDelay: 300,	//delay applied to enemy movement after being hit
        radius: 300,		//in pixels
        explosiveDmg: 100,
        speedX: 20,
        speedY: 0,
        width: 8,
        height: 8,
        attackRect: [[18, 27, 6, 13]] //down, left, right, up
    }
};

/*-------------------
 a player entity
 http://opengameart.org/content/minimal-platformer
 -------------------------------- */
game.BulletEntity = me.Entity.extend({

    /* -----
     constructor
     ------ */
    init: function(x, y, owner) {
        // call the constructor
        this._super(me.Entity, 'init', [x+16, y+16, {image: "bullet", width: 8, height: 8, spritewidth: 8, spriteheight: 8}]);

        this.owner = owner;
        this.direction = this.owner.direction;
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(40, 0);
        //this.body.setMaxVelocity(vx, vy);
	

        // ensure the bullet is updated even when outside of the viewport
        this.alwaysUpdate = true;
        //this.z = 4;
        this.lifetime = 5000;
        this.body.setCollisionType = me.collision.types.PROJECTILE_OBJECT;
		this.body.addShape(new me.Rect(0,0,8,8));
        this.updated = false;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("glow",  [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("glow");
    },

    /* -----
     update the bullet pos
     ------ */
    update: function(dt) {
        if (this.direction=="left") {
            if(!this.updated) {
                this.body.pos.x -= 16;
                this.updated=true;
            }
            this.body.vel.x -= this.body.accel.x;
        }
        else
            this.body.vel.x += this.body.accel.x;
        this.body.vel.y = this.body.accel.y;

        // check & update bullet movement
        this.body.update(dt);

        me.collision.check(this);

        this.lifetime -= dt;
        if(this.lifetime <= 0)
            me.game.world.removeChild(this);

        // update animation if necessary
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
    },

    onCollision : function (response, other) {
        if(response.b.body.setCollisionType === me.collision.types.ENEMY_OBJECT) {
            if(this.owner.body.setCollisionType === me.collision.types.ENEMY_OBJECT) {
                return false;
            }
            else if(this.owner.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
                if(!response.b.alive) {
                    return false;
                }
                else {
                    response.b.hurt(20);    //TODO switch for damage
                    me.game.world.removeChild(this);
                    return true;
                }
            }
        }
        else if(response.b.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
            if(this.owner.body.setCollisionType === me.collision.types.ENEMY_OBJECT) {
                response.b.hurt(10);    //TODO switch for damage
                me.game.world.removeChild(this);
                return true;
            }
            else{return false;}
        }
        else if(response.b.body.setCollisionType === me.collision.types.WORLD_SHAPE
            || response.b.body.setCollisionType === me.collision.types.WORLD_BOUNDARY) {
            //TODO explode if has radius
            me.game.world.removeChild(this);
            return true;
        }
        else if (other.body.setCollisionType === me.collision.types.NO_OBJECT) {
            return false;
        }
        else {return false;}


    }
});