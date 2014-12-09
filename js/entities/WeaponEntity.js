/**
 * Created by pbpdi_000 on 06/12/2014.
 */
//for the overworld
game.weapons = {
    melee: {
        name: 'Melee',
        image: "weapons",
        animation: [0, 1, 2, 3],
        spritewidth: 50,
        spriteheight: 50,
        rate: 225,
        damage: 1,
        cooldown: 0,
        attackRect: [[18, 27, 6, 13],[4, 22, 16, 5],[24, 22, 16, 5],[15, 5, 3, 15]] //down, left, right, up
    },
    pistol: {
        name: 'Pistol',
        image: "weapons",
        animation: [0, 1, 2, 3],
        spritewidth: 50,
        spriteheight: 50,
        rate: 225,
        damage: 1,
        cooldown: 0,
        attackRect: [[18, 27, 6, 13],[4, 22, 16, 5],[24, 22, 16, 5],[15, 5, 3, 15]] //down, left, right, up
    },
    smg: {
        name: 'SMG',
        image: "weapons",
        animation: [4, 5, 6, 7],
        spritewidth: 50,
        spriteheight: 50,
        rate: 225,
        damage: 1,
        cooldown: 0,
        attackRect: [[18, 27, 6, 13],[4, 22, 16, 5],[24, 22, 16, 5],[15, 5, 3, 15]] //down, left, right, up
    },
    bazooka: {
        name: 'Bazooka',
        image: "weapons",
        animation: [8, 9, 10, 11],
        spritewidth: 50,
        spriteheight: 50,
        rate: 225,
        damage: 1,
        cooldown: 0,
        attackRect: [[18, 27, 6, 13],[4, 22, 16, 5],[24, 22, 16, 5],[15, 5, 3, 15]] //down, left, right, up
    }
};

game.WeaponEntity = game.BaseEntity.extend({

    init: function (x, y, owner) {
        this.owner = owner;
        this.weapon = game.weapons[owner.currentWep];


        /*settings.image = this.weapon.image;
         settings.spritewidth = 44;
         settings.spriteheight = 40;
         settings.width = 44;
         settings.height = 44;*/
        this.needsDrawn = false;

        // call the constructor
        this._super(me.Entity, 'init', [x, y, {
            image: this.weapon.image,
            width: 44,
            height: 40,
            spritewidth: 44,
            spriteheight: 40
        }]);

        this.renderable.addAnimation("down", [0, 1, 2], 75);
        this.renderable.addAnimation("left", [3, 4, 5], 75);
        this.renderable.addAnimation("right", [6, 7, 8], 75);
        this.renderable.addAnimation("up", [9, 10, 11], 75);

        this.body.collidable = true;
        this.body.addShape(new me.Rect(16, 18, 14, 14));

        this.body.addShape(new me.Rect(this.weapon.attackRect[0][0], this.weapon.attackRect[0][1], this.weapon.attackRect[0][2], this.weapon.attackRect[0][3]));	//Down
        this.body.addShape(new me.Rect(this.weapon.attackRect[1][0], this.weapon.attackRect[1][1], this.weapon.attackRect[1][2], this.weapon.attackRect[1][3]));	//Left
        this.body.addShape(new me.Rect(this.weapon.attackRect[2][0], this.weapon.attackRect[2][1], this.weapon.attackRect[2][2], this.weapon.attackRect[2][3]));	//Right
        this.body.addShape(new me.Rect(this.weapon.attackRect[3][0], this.weapon.attackRect[3][1], this.weapon.attackRect[3][2], this.weapon.attackRect[3][3]));	//Up
        this.body.setShape(0);
        this.body.setCollisionType = me.collision.types.COLLECTABLE_OBJECT;

        this.direction = owner.direction;
        this.renderable.setCurrentAnimation(this.direction);
    },

    onCollision : function (response, other) {
        if (other.body.setCollisionType === me.collision.types.NO_OBJECT) {
            return false;
        }
        return true;
    },

    open : function(owner) {
        owner.equipWep(this.weapon);
    }
})