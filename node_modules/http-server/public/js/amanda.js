// screen Size
var height = 800;
var width = 800;

// assets
var game;
var amanda;
var background;
var villagers;
var ground;
var platform;

// variables
var points = 0;
var velocity = 200;
var instructions;
var leftBar;
var numHits = 0;
var cursors;

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

// load Amanda
game.load.spritesheet('amanda', '../img/Amanda.png', '64', '64', '260');

// load villain
game.load.spritesheet('villain', '../img/old_man.png', '64', '64', '260');

}

function create() {
  // load phaser
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // platforms (in case of obstacles if I have time)
  // platforms = game.add.group();
  // platforms.enableBody = true;
  // ground = platforms.create(0, game.world.height + 10, 'ground')

  // add the player
  amanda = game.add.sprite((game.world.width/2), (game.world.height/2), 'amanda');
  game.physics.arcade.enable(amanda);
  amanda.body.collideWorldBounds = true;

  // add in background
  background = game.add.sprite(0, 0, 'background');
  background.scale.x = (width/background.width);
  background.scale.y = (height/background.height);
  game.world.sendToBack(background);

  // listen for keypresses
  cursors = game.input.keyboard.createCursorKeys();

}

// runs the game
function update() {}

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
