game.enemies = {
    skeledoge: {
        name: 'Skeledoge',
        image: "skeleton",
        health:10,
        damage: 10,
        stun: true,
        explosiveDmg: 100,
        speedX: 3,
        speedY: 15,
        width: 16,
        height: 64,
        spritewidth: 64,
        spriteheight: 64,
        animations: [["stand",[0,1,2,3]],["walk",[8, 9, 10, 11]],["attack",[16,17,18,19]],
                        ["die",[24,25,26,27,28,29,30]],["jump",[40,41,42,43,44]],["air",[45,46]]],
        currentAnim: "stand",
        colRect: [14, 11,16, 64],
        attackRect: [[18, 27, 6, 13]] //down, left, right, up
    },
    catbot: {
        name: 'Catbot',
        image: "catbot",
        health:10,
        damage: 10,
        stun: true,
        explosiveDmg: 100,
        speedX: 4,
        speedY: 15,
        width: 16,
        height: 32,
        spritewidth: 50,
        spriteheight: 50,
        animations: [["stand",[0,1,2,3,4,5]],["walk",[18,19,20,21,22,23]],["attack",[9,10,11,12,13,14]],
                        ["die",[63,64,65,66,67,68,69,70,71]],["air",[40,41]]],
        currentAnim: "stand",
        colRect: [14, 11,16, 32],
        attackRect: [] //down, left, right, up
    }
};

game.EnemyEntity = game.BaseEntity.extend({
    init: function(x,y,spawner,enemy) {
        this.enemy = game.enemies[enemy];

        this._super(game.BaseEntity, 'init', [x+16, y+16,
            {image: this.enemy.image, width: this.enemy.width, height: this.enemy.height,
                spritewidth: this.enemy.spritewidth, spriteheight: this.enemy.spriteheight}]);

        var i=0;
        this.body.setVelocity(this.enemy.speedX, this.enemy.speedY);
        this.body.setMaxVelocity(this.enemy.speedX, this.enemy.speedY);
        //console.log();
        for(i=0;i<this.enemy.animations.length;i++) {
            this.renderable.addAnimation(this.enemy.animations[i][0],  this.enemy.animations[i][1]);
        }
        // set the standing animation as default
        this.renderable.setCurrentAnimation(this.enemy.currentAnim);

        this.alwaysUpdate = true;

        //this.attacking = true;
        this.body.addShape(new me.Rect(this.enemy.colRect[0],this.enemy.colRect[1],
                                this.enemy.colRect[2],this.enemy.colRect[3]));
		this.damage = this.enemy.damage;
		this.path = null;
		this.health = this.enemy.health;
		this.currentNode = 0;
		this.nextNode = 1;
		this.pathfindingInterval = 1000;
		this.timeToPathfind = 3000;
		this.doublejumpdelay = 250;
		this.timetodoublej = 500;
		this.arrived = true;
		this.firstexecution = true;
		this.spawner = spawner;
		this.stunTime = 400;
        this.wait = 20;
		this.cooldown = 150;
		this.lastfired = null;
		//this.body.setMaxVelocity(3, 15);
        this.body.setCollisionType = me.collision.types.ENEMY_OBJECT;
    },

	 update: function(dt) {
        if(this.health<=0) {
            if(!this.playedDead) {
                me.audio.play('explosion');
                this.playedDead = true;
            }
            this.switchAnimation("die");
            this.alive = false;
            this.spawner.amtAlive--;
            this.wait--;
            this.renderable.flicker(0);

            if(this.wait<=0) {
                me.game.world.removeChild(this);
				pathfinding.playerEntity.score += 100;
            }
        }

        if(!this.alive) {
            return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
        }

        if (this.stunnedTime <= 0) {
            this.isHurt = false;
            this.stunnedTime = 0;
        }
        else {
            this.stunnedTime -= dt;
        }

        if (!this.isHurt) {
			
            if (this.timeToPathfind <= 0 || this.arrived) {
                this.path = pathfinding.Astar(this, pathfinding.playerEntity);
                this.timeToPathfind = this.pathfindingInterval;
                this.currentNode = 0;
                this.nextNode = 1;
				this.firstexecution = true;
				//console.log(this.path);
				if(this.path != null)
					this.arrived = false;
            }
            else this.timeToPathfind -= dt;

            if (this.path != null && this.path.length > 0 && this.nextNode < this.path.length && !(this.arrived)) {
                var neighbors = this.path[this.currentNode].neighbors;
                var needsJump = false;
                for (var i = 0; i < neighbors.length; i++) {
                    if (neighbors[i].node == this.path[this.nextNode].node) {
                        needsJump = neighbors[i].requiresJump;
                    }
                }

                if (this.path[this.nextNode].position.x > this.pos.x) {
					if(this.path[this.nextNode].node == "end" && this.direction == "left" && !this.firstexecution) {
						this.arrived = true;
					}
					else {
						this.direction = "right";
						this.firstexecution = false;
						// unflip the sprite
						this.renderable.flipX(false);
						// update the entity velocity
						this.body.vel.x += this.body.accel.x * me.timer.tick;
						if (!this.jumping && !this.falling) {
							this.switchAnimation("walk");
						}
					}
                }
                else if (this.path[this.nextNode].position.x < this.pos.x) {
					if(this.path[this.nextNode].node == "end" && this.direction == "right" && !this.firstexecution) {
						this.arrived = true;
					}
					else {
						this.direction = "left";
						this.firstexecution = false;
						// flip the sprite on horizontal axis
						this.renderable.flipX(true);
						// update the entity velocity
						this.body.vel.x -= this.body.accel.x * me.timer.tick;

						if (!this.jumping && !this.falling) {
							this.switchAnimation("walk");
						}
					}
                }

                if (needsJump) {
                    if (!this.body.jumping && !this.body.falling) {
                        this.switchAnimation("air");

                        this.body.doubleJump = false;
                        // set current vel to the maximum defined value
                        // gravity will then do the rest
                        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                        // set the jumping flag
                        this.body.jumping = true;
						this.timetodoublej = this.doublejumpdelay;
                    }
                    else if ((this.body.jumping || this.body.falling) && !this.body.doubleJump && this.timetodoublej < 0) {
                        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                        this.body.doubleJump = true;
                    }
                }
				
				if(this.enemy.name == "Catbot") {
					if(pathfinding.playerEntity.pos.y < this.pos.y + 50 && pathfinding.playerEntity.pos.y > this.pos.y - 50)
						if(Math.random() > 0.995) {
							if(this.lastfired == null || this.lastfired <= 0) {
								me.audio.play('laser5');
								if(this.direction=="right")
									me.game.world.addChild(new me.pool.pull("bullet", this.pos.x, this.pos.y, this));
								else
									me.game.world.addChild(new me.pool.pull("bullet", this.pos.x, this.pos.y, this));
								this.lastfired = this.cooldown;
								//this.attacking = true;
								//me.audio.play("shoot");
							}
						}
				}
            }
        }
		
		if(this.lastfired != null)
			this.lastfired -= dt;
			
		/*if(this.lastfired<=0) {
			this.shooting = false;
		}*/
		
		this.timetodoublej -= dt;
        // check & update player movement
        this.body.update(dt);

        me.collision.check(this);

        if(this.body.vel.y != 0)
            this.switchAnimation("air");
        else {
            if(this.attacking) {
                this.switchAnimation("attack");
            }
        }

        // update animation if necessary
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x!=0 || this.body.vel.y!=0);
    },

    onCollision : function (response, other) {
        if(other.body.setCollisionType === me.collision.types.PROJECTILE_OBJECT) {
            if(other.owner.body.setCollisionType === me.collision.types.ENEMY_OBJECT) {
                return false;
            }
            else if(other.owner.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
                var kbMultiplier = 0;
                var stunMultiplier = 1;
                if (response.overlapV.x > 0) {
                    kbMultiplier=-1;
                }
                else if (response.overlapV.x < 0) {
                    kbMultiplier=1;
                }
                this.body.vel.x = kbMultiplier*500;
                this.body.vel.y = -5;
                this.stunnedTime = stunMultiplier*400;
                this.renderable.flicker(this.stunnedTime);
                this.isHurt = true;
                //this.hurt(20);
                return false;
            }
        }
        else if(other.body.setCollisionType === me.collision.types.PLAYER_OBJECT) {
            if(other.direction == "left" && other.attacking &&
                other.renderable.getCurrentAnimationFrame()==1||other.renderable.getCurrentAnimationFrame()==2) {
                kbMultiplier=-1;
            }
            return false;
        }
        else if(other.body.setCollisionType === me.collision.types.ENEMY_OBJECT) {
            return false;
        }
        else if (other.body.setCollisionType === me.collision.types.NO_OBJECT) {
			if(other.node != undefined && other.node != null && this.path != null && other.node == this.path[this.nextNode].node) {
				this.nextNode++;
				this.currentNode++;
			}
	
            return false;
        }
        else {return true;}
    }
});

game.CatbotEntity = game.EnemyEntity.extend({
    init: function(x,y,settings) {
        //this._super(me.Entity, 'init', [x+16, y+16, {image: "skeleton", width: 16, height: 32, spritewidth: 64, spriteheight: 64}]);
        this._super(game.EnemyEntity, 'init', [x, y, settings]);
        // define a standing animation (using the first frame)
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

        this.alwaysUpdate = true;

        this.attacking = false;
        this.stunTime = 400;

        this.body.setCollisionType = me.collision.types.ENEMY_OBJECT;
    }
});