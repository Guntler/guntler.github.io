

/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

	init: function() {
		// call the constructor
		this._super(me.Container, 'init');
		
		// persistent across level change
		this.isPersistent = true;
		
		// non collidable
		this.collidable = false;
		
		// make sure our object is always draw first
		this.z = Infinity;

		// give a name
		this.name = "HUD";
		
		// add our child score object at the top left corner
		this.addChild(new game.HUD.HealthItem(1150, 665));
		this.addChild(new game.HUD.ScoreItem(300, 650));
	}
});


/** 
 * a basic HUD item
 */
game.HUD.HealthItem = me.Entity.extend({	
	/** 
	 * constructor
	 */
	init: function(x, y) {
		
		// call the parent constructor 
		// (size does not matter here)
		this._super(me.Entity, 'init', [x, y, {image: "health", width: 0, height: 0, spritewidth: 54, spriteheight: 17}, 500, 100]); 
		
		// local copy of the global score
		//this.health = pathfinding.playerEntity.health;
		
		//me.game.world.addChild(new this.MySprite());
		//this.sprites.push(new me.)

		// make sure we use screen coordinates
		this.floating = true;
		this.renderable._scale.x = 2;
		this.renderable._scale.y = 2;
		this.renderable.scaleFlag = true;
		//console.log(this.renderable);


			this.renderable.addAnimation("health6", [0]);
			this.renderable.addAnimation("health5", [1]);
			this.renderable.addAnimation("health4", [2]);
			this.renderable.addAnimation("health3", [3]);
			this.renderable.addAnimation("health2", [4]);
			this.renderable.addAnimation("health1", [5]);
			this.renderable.addAnimation("health0", [6]);
			// set the standing animation as default
			this.renderable.setCurrentAnimation("health6");

		
		this.sfont = new me.BitmapFont("32x32_font", 32);
        this.sfont.set("right", 0.5);
	},

	/**
	 * update function
	 */
	update : function () {
		if(me.state.isCurrent(me.state.GAMEOVER) || me.state.isCurrent(me.state.MENU)) {
			return false;
		}
		var health = pathfinding.playerEntity.health;
		
		if(health >= 100)
			this.renderable.setCurrentAnimation("health6");
		else if(health >= 80)
			this.renderable.setCurrentAnimation("health5");
		else if(health >= 60)
			this.renderable.setCurrentAnimation("health4");
		else if(health >= 40)
			this.renderable.setCurrentAnimation("health3");
		else if(health >= 20)
			this.renderable.setCurrentAnimation("health2");
		else if(health >= 0)
			this.renderable.setCurrentAnimation("health1");
		else
			this.renderable.setCurrentAnimation("health0");
		// we don't do anything fancy here, so just
		// return true if the score has been updated
		return false;
	},
	draw : function (renderer) {
		if(me.state.isCurrent(me.state.PLAY)) {
			this._super(me.Entity, 'draw', [renderer]);
			this.sfont.draw(renderer, "HEALTH", this.pos.x + 45, this.pos.y - 45);
		}
		else if(me.state.isCurrent(me.state.MENU)) {
			this.sfont.draw(renderer, "PRESS SHOOT (C) OR JUMP (X) TO START", this.pos.x - 200, this.pos.y - 300);
		}
		else {
			this.sfont.draw(renderer, "GAME OVER!!", this.pos.x + 45, this.pos.y - 45);
			this.sfont.draw(renderer, "PRESS C TO TRY AGAIN!", this.pos.x + 45, this.pos.y);
		}
    }
});

game.HUD.ScoreItem = me.Renderable.extend( {   
    /**
    * constructor
    */
    init: function(x, y) {
         
        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);
         
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("right");
		this.sfont = new me.BitmapFont("32x32_font", 32);
        this.sfont.set("right", 0.5);
 
        // make sure we use screen coordinates
        this.floating = true;
    },
 
    /**
    * update function
    */
    update : function (dt) {
        return false;
    },
 
    /**
    * draw the score
    */
    draw : function (renderer) {
		if(me.state.isCurrent(me.state.PLAY)) {
			this.font.draw(renderer, pathfinding.playerEntity.score, this.pos.x, this.pos.y);
			this.sfont.draw (renderer, "SCORE", this.pos.x-20, this.pos.y-30);
		}
		else if(me.state.isCurrent(me.state.MENU)) {
			this.sfont.draw(renderer, "HELLO! THANKS FOR PLAYING OUR SUBMISSION FOR THE 31ST EDITION", this.pos.x + 750, this.pos.y - 30);
			this.sfont.draw(renderer, "OF LUDUM DARE. THIS IS OUR FIRST ENTRY EVER, CATSTATION.", this.pos.x + 650, this.pos.y - 10);
			this.sfont.draw(renderer, "WE HOPE YOU ENJOY IT DESPITE THE SIMPLICITY OF THE GAME!", this.pos.x + 650, this.pos.y+10);
		}
		else {
			this.font.draw(renderer, game.persistent.player.score, this.pos.x, this.pos.y);
			this.sfont.draw (renderer, "FINAL SCORE!", this.pos.x-20, this.pos.y-30);
		}
    }
});
