game.resources = [

	/* Graphics. 
	 * @example
	 * {name: "example", type:"image", src: "data/img/example.png"},
	 */
	{name: "base", type:"image", src: "data/img/map/base.png"},
    {name: "metatiles32x32",  type:"image", src: "data/img/map/metatiles32x32.png"},
	// the main player spritesheet
	{name: "cat_fighter", type:"image", src: "data/img/sprite/cat_fighter.png"},
	{name: "skeleton", type:"image", src: "data/img/sprite/skeleton.png"},
	{name: "catbot", type:"image", src: "data/img/sprite/catbot.png"},
	// the parallax background
	{name: "bullet", type:"image", src: "data/img/sprite/bullet.png"},
	{name: "health0", type:"image", src: "data/img/gui/0.png"},
	{name: "health1", type:"image", src: "data/img/gui/1.png"},
	{name: "health2", type:"image", src: "data/img/gui/2.png"},
	{name: "health3", type:"image", src: "data/img/gui/3.png"},
	{name: "health4", type:"image", src: "data/img/gui/4.png"},
	{name: "health5", type:"image", src: "data/img/gui/5.png"},
	{name: "health6", type:"image", src: "data/img/gui/6.png"},
	{name: "health", type:"image", src: "data/img/gui/health.png"},
	{name: "gameover", type:"image", src: "data/img/gui/gameover.png"},
	{name: "32x32_font", type:"image", src: "data/img/font/32x32_font.png"},
    //{name: "area01_bkg1",         type:"image", src: "data/img/area01_bkg1.png"},

	/* Atlases 
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
		
	/* Maps. 
	 * @example
	 * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
	 * {name: "example01", type: "tmx", src: "data/map/example01.json"},
 	 */
	{name: "arena01", type: "tmx", src: "data/map/arena01.tmx"},

	/* Background music. 
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/"},
	 */
	{name: "dramatic", type: "audio", src: "data/bgm/"},

	/* Sound effects. 
	 * @example
	 * {name: "example_sfx", type: "audio", src: "data/sfx/"}
	 */
	{name: "laser5", type: "audio", src: "data/sfx/"},
	{name: "explosion", type: "audio", src: "data/sfx/"}
];
