// screen Size
var height = window.innerHeight;
var width = window.innerWidth;

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
var lives = 5;
var counter = 70;
var space;

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
	space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // platforms (in case of obstacles if I have time)
  platforms = game.add.group();
  platforms.enableBody = true;
  ground = platforms.create(0, game.world.height - 136, 'ground');
	ground.scale.x = width / ground.width;
	ground.body.immovable = true;
	leftPlatform = platforms.create(0, game.world.height + 1, 'leftPlatform');

  // add the player
  amanda = game.add.sprite((game.world.width * .01), (game.world.height - 200), 'amanda');
  game.physics.arcade.enable(amanda);
  amanda.body.collideWorldBounds = true;
	amanda.body.gravity.y = 900;
	amanda.frame = 26;

	// add angry villagers
	villagers = game.add.group();
	villagers.enableBody = true;
	villagers.setAll('checkWorldBounds', true);
	villagers.setAll('outOfBoundsKill', true);
	victor = villagers.create((game.world.width + (game.world.width * .01)), (game.world.height - 200), 'victor');
	victor.body.velocity.x = -200;

	// set timer for villagers to be created
	game.time.events.loop(Phaser.Timer.SECOND, makeVillagers, this);


  // add in background
  background = game.add.tileSprite(0, 0, game.world.bounds.width, game.cache.getImage('background').height, 'background');
  background.scale.x = (width/background.width);
  background.scale.y = (height/background.height);
  game.world.sendToBack(background);

  // listen for keypresses
  cursors = game.input.keyboard.createCursorKeys();
	amanda.animations.add('left', [118, 119, 120, 121, 122, 123, 124, 125], 10, false);
	amanda.animations.add('right', [144, 145, 146, 147, 148, 149, 150, 151], 10, false);
	amanda.animations.add('hit', [208, 209, 210, 211, 212], 10, false);

	// angry villagers animations 'WE WILL GET YOU'
	victor.animations.add('shuffle', [118, 119, 120, 121, 122, 123, 124, 125], 10, true);
	victor.animations.play('shuffle');

	makeVillagers();

}

// runs the game
function update() {
	game.physics.arcade.collide(platforms, amanda);
	space.onDown.add(useSpaceBar, this);

	background.tilePosition.x -= 2;

	if (cursors.left.isDown) {
		amanda.animations.play('left');
		amanda.body.velocity.x = -325;
	} else if (cursors.right.isDown) {
		amanda.animations.play('right');
		amanda.body.velocity.x = 125;
	} else {
		amanda.body.velocity.x = 0;
		amanda.animations.play('right');
	}
	if (cursors.up.isDown) {
		if (amanda.body.touching.down) {
			amanda.animations.play('jump');
			amanda.body.velocity.y = -600;
		}
	}
	game.physics.arcade.overlap(amanda, villagers, minusOne, null, this);
}

function makeVillagers() {
	if(lives > 0) {
		for(var i = 0; i < 5; i++) {
			victor = villagers.create(game.world.width + (game.world.width * (Math.random() * 25)) + 192, (game.world.height - 200), 'victor');
			victor.animations.add('shuffle', [118, 119, 120, 121, 122, 123, 124, 125], 10, true);
			victor.animations.play('shuffle');
			victor.body.velocity.x = -200;
		}
	}
}

function minusOne(amanda, villager) {
	villager.kill();
	lives -= 1;
	console.log(lives);
	if(lives == 0) {
		amanda.kill(); // GAME OVER
	}
}

function useSpaceBar(){
	console.log('SPACEBAR');
	console.log(amanda.animations.play('hit'));
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
