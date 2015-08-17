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
var score = 0;
var scoreText;
var velocity = 200;
var instructions;
var cursors;
var lives = 5;
var livesText;
var centerText;
var started = false;
var instructionPage = 0;

if(isSafari) {
	game = new Phaser.Game(width, height, Phaser.CANVAS, 'midDiv', { preload: preload, create: create, update: update });
} else {
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

scoreText = game.add.text(3, 0, 'Score: 0', {fontSize: '2em', fill: '#8B5742'});
livesText = game.add.text(3, 20, 'Patience: 5', {fontSize: '2em', fill: '#8B5742'});

}

function showInstructions() {
	var instructions1 = "Help Amanda avoid awkward situations!";
	var instructions2 = "In a world where it's culturally appropriate to touch a woman's stomach,\n Amanda needs help stopping these weirdos!";
	var instructions3 = "Run back and forth with your arrow keys to avoid the weirdos.";
	var instructions4 = "Use the down arrow to stop them from coming closer.";
	var instructions5 = "Use the up arrow to jump on them for extra points!";
	var instructionList = [instructions1, instructions2, instructions3, instructions4, instructions5];

	if (instructionPage < 5) {
		writeCenter(instructionList[instructionPage], 1, null);
		instructionPage++;
		game.paused = true;
	} else {
		centerText.destroy();
		started = true;
	}
}

function create() {
  // load phaser
  game.physics.startSystem(Phaser.Physics.ARCADE);
	game.input.onDown.add(unpause, self);

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

	// centertext shizz
	centerText = game.add.text(game.world.centerX, game.world.centerY, "");

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

	if(!started) {
		showInstructions();
	}

	if (lives > 0) {
		if (!cursors.down.isDown) {
			background.tilePosition.x -= 2;
		}
	}

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
			amanda.body.velocity.y = -600;
		}
	}
	if (!amanda.body.touching.down) {
		game.physics.arcade.overlap(amanda, villagers, jumpOn, null, this);
	} else if (cursors.down.isDown) {
		amanda.frame = 259;
		game.physics.arcade.overlap(amanda, villagers, hit, null, this);
	} else {
		game.physics.arcade.overlap(amanda, villagers, minusOne, null, this);
	}
}

function makeVillagers() {
	if(lives > 0) {
		var num = Math.round(score/500) + 1;
		numVillagers(num);
	}
}

function numVillagers(num) {
	console.log(num);
	console.log('line 150');
	for(var i = 0; i < num; i++) {
		victor = villagers.create(game.world.width + (game.world.width * (Math.random())), (game.world.height - 200), 'victor');
		victor.animations.add('shuffle', [118, 119, 120, 121, 122, 123, 124, 125], 10, true);
		victor.animations.play('shuffle');
		victor.body.velocity.x = -200;
	}
}

function minusOne(amanda, villager) {
	villager.destroy();
	lives -= 1;
	livesText.text = 'Patience: ' + lives;
	console.log(lives);
	if(lives == 0) {
		amanda.kill(); // GAME OVER
		villagers.forEachAlive(killEmAll, this);
		writeCenter("GAME OVER")
	}
}

function jumpOn(amanda, villager) {
	villager.destroy();
	score += 10;
	scoreText.text = 'Score: ' + score;
	console.log(score);
}

function hit(amanda, villager) {
	villager.destroy();
	score += 2;
	scoreText.text = 'Score: ' + score;
	console.log(score);
}

function killEmAll(villager) {
	villager.kill();
}

function writeCenter(text) {
	centerText.destroy();
	centerText = game.add.text(game.world.centerX, game.world.centerY, text);
	centerText.anchor.set(0.5);
	centerText.align = 'center';

	//	Font style
	centerText.font = 'Arial';
	centerText.fontSize = '3em';
	centerText.fill = '#8B5742';
}

function unpause(event) {
	game.paused = false;
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
