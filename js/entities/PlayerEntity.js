game.persistent = {
	player: {
		invincibilityFrames: 2000,
		score: 0,
		spawnersExhausted: 0
	}
}


game.PlayerEntity = game.BaseEntity.extend({
	
    /* -----
    constructor
    ------ */
    init: function(x, y, settings) {
        // call the constructor
        this._super(game.BaseEntity, 'init', [x, y, settings]);
		
		// define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk",  [0, 3, 0, 4]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0,21,0,20]);
		this.renderable.addAnimation("jump",  [0,7]);
		this.renderable.addAnimation("air",  [29,30]);
		this.renderable.addAnimation("standhold",  [70,71,72,73,74,75,76,77]);
		this.renderable.addAnimation("standshoot",  [80,81,82,83,84,85,86,87],100);
		this.renderable.addAnimation("walkhold",  [90,91,92,93,94,95,96,97]);
		this.renderable.addAnimation("walkshoot",  [100,101,102,103,104,105,106,107],100);
		this.renderable.addAnimation("die",  [140,141,142,143,144,145,146]);
		this.renderable.addAnimation("jumphold",  [110,111,112,113]);
		this.renderable.addAnimation("airhold",  [114,115]);
		this.renderable.addAnimation("hurt",  [0,1,2,1]);
		this.renderable.addAnimation("airshoot",  [125,124],100);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

		//this.body.addShape(new me.Rect(5,12,16,32));
		//this.updateColRect(23, 18, 4, 60);
		this.body.setCollisionType = me.collision.types.PLAYER_OBJECT;
		
		// set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.shooting = false;
		this.health = 120;
		this.currentWep = null;
		this.cooldown = 150;
		this.lastfired = null;
		this.score = 0;
		this.invincibleTime = 0;
		this.invincibilityFrames = false;
		this.wait = 20;

		pathfinding.playerEntity = this;
    },

	equipWep: function(weapon) {
		this.currentWep = weapon;
	},

	onCollision : function (response, other) {
		if (other.body.setCollisionType === me.collision.types.ENEMY_OBJECT) {
			if (!this.invincible && !this.isHurt && !this.invincibilityFrames) {
				var kbMultiplier = 0;
				var stunMultiplier = 1;
				if (response.overlapV.x > 0) {		//Collided from the left
					if (other.direction == "left" && other.attacking &&
						other.renderable.getCurrentAnimationFrame() == 1 || other.renderable.getCurrentAnimationFrame() == 2) {
						kbMultiplier = -1;
					}
					else {
						kbMultiplier = -1;
					}
				}
				else if (response.overlapV.x < 0) {		//Collided from the right
					if (other.direction == "right" && other.attacking &&
						other.renderable.getCurrentAnimationFrame() == 1 || other.renderable.getCurrentAnimationFrame() == 2) {
						kbMultiplier = 1;
					}
					else {
						kbMultiplier = 1;
					}
				}
				else if (response.overlapV.y > 0) {
					if (other.direction == "right")
						kbMultiplier = 2;
					else
						kbMultiplier = -2;
				}
				this.body.vel.x = kbMultiplier * 500;
				this.body.vel.y = -5;
				this.isHurt = true;
				this.stunnedTime = stunMultiplier * other.stunTime;
				this.invincibilityFrames = true;
				this.stunnedTime = stunMultiplier * other.stunTime;
				this.renderable.flicker(game.persistent.player.invincibilityFrames);
				this.hurt(other.enemy.damage);
				return true;
			} else {
				return false;
			}
		}
		else if (other.body.setCollisionType === me.collision.types.COLLECTABLE_OBJECT) {
			other.open(this);
			//console.log("Collided with collectable.");
		}
		else if (other.body.setCollisionType === me.collision.types.PROJECTILE_OBJECT) {
			if(other.owner.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
				return false;
			}
			else {
				return true;
			}
		}
		else if (other.body.setCollisionType === me.collision.types.NO_OBJECT) {
			return false;
		}
		return true;
	},

	handleInput : function() {
		if (me.input.isKeyPressed('left')) {
			this.direction = "left";
			// flip the sprite on horizontal axis
			this.renderable.flipX(true);
			// update the entity velocity
			this.body.vel.x -= this.body.accel.x * me.timer.tick;

			if(!this.jumping&&!this.falling) {
				if (this.shooting) {
					this.switchAnimation("walkshoot");
				} else {
					if (this.currentWep == null) {
						this.switchAnimation("walkhold");
					} else {
						this.switchAnimation("walk");
					}
				}
			}
		} else if (me.input.isKeyPressed('right')) {
			this.direction = "right";
			// unflip the sprite
			this.renderable.flipX(false);
			// update the entity velocity
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			if(!this.jumping&&!this.falling) {
				if (this.shooting) {
					this.switchAnimation("walkshoot");
				} else {
					if (this.currentWep == null) {
						this.switchAnimation("walkhold");
					} else {
						this.switchAnimation("walk");
					}
				}
			}
		} else {
			this.body.vel.x = 0;
			if(this.body.falling) {
				if(this.shooting) {
					this.switchAnimation("airshoot");
				} else {
					if(this.currentWeapon==null) {
						this.switchAnimation("airhold");
					} else {
						this.switchAnimation("air");
					}
				}
			} else {
				if(this.shooting) {
					this.switchAnimation("standshoot");
				} else {
					if(this.currentWeapon==null) {
						this.switchAnimation("standhold");
					} else {
						this.switchAnimation("stand");
					}
				}
			}
		}

		if (me.input.isKeyPressed('jump')) {
			if(this.shooting) {
				this.switchAnimation("airshoot");
			} else {
				if(this.currentWeapon==null) {
					this.switchAnimation("jumphold");
				} else {
					this.switchAnimation("jump");
				}
			}
			// make sure we are not already jumping or falling
			if (!this.body.jumping && !this.body.falling) {
				this.body.doubleJump = false;
				// set current vel to the maximum defined value
				// gravity will then do the rest
				this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
				// set the jumping flag
				this.body.jumping = true;
			}
			else if((this.body.jumping || this.body.falling) && !this.body.doubleJump) {
				this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
				this.body.doubleJump = true;
			}
		}

		if(me.input.isKeyPressed('shoot')) {
			if(this.lastfired == null || this.lastfired <= 0) {
				me.audio.play('laser5');
				if(this.direction=="right")
					me.game.world.addChild(new me.pool.pull("bullet", this.pos.x, this.pos.y, this));
				else
					me.game.world.addChild(new me.pool.pull("bullet", this.pos.x, this.pos.y, this));
				this.lastfired = this.cooldown;
				this.shooting = true;
				//me.audio.play("shoot");
			}
		}
	},
 
    /* -----
    update the player pos
    ------ */
    update: function(dt) {
		if(this.health<=0) {
			if(!this.playedDead) {
				me.audio.play('explosion');
				this.playedDead = true;
			}
			this.switchAnimation("die");
			this.alive = false;
			this.wait--;
			this.renderable.flicker(0);

			if(this.wait<=0) {
				me.state.change(me.state.GAMEOVER);
				game.persistent.player.score = this.score;
			}
		}

		if(!this.alive) {
			return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
		}

		if(this.stunnedTime<=0) {
			this.isHurt = false;
			this.stunnedTime = 0;
		}
		else {
			this.switchAnimation("hurt");
			this.stunnedTime -= dt;
		}

		if(!this.isHurt) {
			this.handleInput();
		}


		if(this.invincibleTime >= game.persistent.player.invincibilityFrames && this.invincibilityFrames) {
			this.invincibilityFrames=false;
			this.invincibleTime = 0;
		} else {
			if(this.invincibilityFrames)
				this.invincibleTime += dt;
		}


		if(this.lastfired != null)
			this.lastfired -= dt;

		if(this.lastfired<=0) {
			this.shooting = false;
		}
 
        // check & update player movement
        this.body.update(dt);
		
		me.collision.check(this);
 
        // update animation if necessary
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
    }
});

