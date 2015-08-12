// screen Size
var height = 800;
var width = 800;

// assets
var game;
var amanda;
var background;
var villagers;
var victor;
var ground;
var platforms;

// variables
var points = 0;
var velocity = 200;
var instructions;
var leftBar;
var numHits = 0;
var cursors;
// var SPACEBAR = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

if (isSafari)
{
	game = new Phaser.Game(width, height, Phaser.CANVAS, 'midDiv', { preload: preload, create: create, update: update });
}
else
{
	game = new Phaser.Game(width, height, Phaser.AUTO, 'midDiv', { preload: preload, create: create, update: update });
}

// loads assets
function preload() {

// load my world
game.load.image('background', '../img/kenney_backgroundElements/Samples/colored_talltrees.png');

// load the ground
game.load.image('ground', '../img/ground.png');

// load Amanda
game.load.spritesheet('amanda', '../img/Amanda.png', 64, 64, 260);

// load villain
game.load.spritesheet('victor', '../img/old_man.png', 64, 64, 260);

}

function create() {
  // load phaser
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // platforms (in case of obstacles if I have time)
  platforms = game.add.group();
  platforms.enableBody = true;
  ground = platforms.create(0, game.world.height - 136, 'ground');
	ground.scale.x = width / ground.width;
	ground.body.immovable = true;

  // add the player
  amanda = game.add.sprite((game.world.width * .01), (game.world.height - 200), 'amanda');
  game.physics.arcade.enable(amanda);
  amanda.body.collideWorldBounds = true;
	amanda.body.gravity.y = 200;
	amanda.frame = 26;

	// add angry villagers
	villagers = game.add.group();
	villagers.enableBody = true;
	victor = villagers.create((game.world.width + (game.world.width * .01)), (game.world.height - 200), 'victor');
	victor.body.velocity.x = -200;


  // add in background
  background = game.add.sprite(0, 0, 'background');
  background.scale.x = (width/background.width);
  background.scale.y = (height/background.height);
  game.world.sendToBack(background);

  // listen for keypresses
  cursors = game.input.keyboard.createCursorKeys();
	amanda.animations.add('left', [118, 119, 120, 121, 122, 123, 124, 125], 10, false);
	amanda.animations.add('right', [144, 145, 146, 147, 148, 149, 150, 151], 10, false);
	amanda.animations.add('jump', [28, 29, 30, 31, 32], 5, false);

	// angry villagers animations 'WE WILL GET YOU'
	victor.animations.add('shuffle', [118, 119, 120, 121, 122, 123, 124, 125], 10, true);
	victor.animations.play('shuffle');

}

// runs the game
function update() {
	game.physics.arcade.collide(platforms, amanda);
	// victor.animations.play('shuffle');

	if (cursors.left.isDown) {
		amanda.animations.play('left');
		amanda.body.velocity.x = -200;
	} else if (cursors.right.isDown) {
		amanda.animations.play('right');
		amanda.body.velocity.x = 200;
	} else {
		amanda.body.velocity.x = 0;
		amanda.frame = 26;
	}
	if (cursors.up.isDown) {
		if (amanda.body.touching.down) {
			amanda.animations.play('jump');
			amanda.body.velocity.y = -300;
		}
	}
	// else {
	// 	amanda.body.velocity.x = 0;
	// 	amanda.frame = 26;
	// }
}

// in case weirdos use Safari
function isSafari()
{
	var browser = navigator.appVersion;
	var device = navigator.platform;

	if(browser.indexOf("Safari") > -1 && device == "iPad")
	{
		return true;
	}
}
