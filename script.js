pipes = [];
dead = false;
flipY = true;
score = document.getElementById("score");
restartBtn = document.getElementById("restartBtn");

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            },
            debug: false
        }
    },
    scene: {
        create: create,
        update: update,
        preload: preload
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('mainSprite', 'flappy-bird.png');
    this.load.image('backgroundSky', 'flappy-background.png')
    this.load.image('pipe', 'pipe.png');
}

function create() {
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    cursors = this.input.keyboard.createCursorKeys();

    mainSprite = this.add.sprite(100, 100, 'mainSprite');
    mainSprite.displayWidth = window.innerWidth/15;
    mainSprite.displayHeight = window.innerHeight/10;
    this.player = this.physics.add.existing(mainSprite);
    mainSprite.body.bounce.x=0.5;
    mainSprite.body.bounce.y=0.5;
    mainSprite.body.collideWorldBounds = true;

    this.physics.world.on('worldbounds', onWorldBounds);
    mainSprite.body.onWorldBounds = true;
    bg = this.add.sprite(0, 0, 'backgroundSky').setOrigin(0, 0);
    bg.displayWidth = window.innerWidth;
    bg.displayHeight = window.innerHeight;
    bg.setDepth(-1);

    this.time.addEvent({
      delay: 2000,
      callback: pipeCreator,
      loop: true,
      callbackScope: this
    });

    thisRef = this;
}

function Dead() {
  dead = true;
  document.getElementById("deadLabel").style.display = "block";
  for (i=0;i<pipes.length;i++) {
    pipes[i].body.velocity.x = 0;
  }
  document.getElementById("overlay").style.display = "block";
  document.getElementById("restartBtn").style.display = "block";
}

function restartScene() {
  dead = false;
  document.getElementById("deadLabel").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";
  score.innerHTML = 0;
  pipes = [];
  thisRef.scene.restart();
}

function onWorldBounds(body, up, down, left, right) {
  if (up || down) {
    Dead();
  }
}

function pipeCreator() {
  if (!dead) {
    pipeLength = Math.random() * (window.innerHeight/2 - window.innerHeight/3) + window.innerHeight/3;
    let { width, height } = this.sys.game.canvas;
    if (flipY) {
      pipe = this.add.sprite(width-window.innerWidth/20, 0, 'pipe').setOrigin(0, 0);
      pipe.flipY = true;
      flipY = false;
    } else {
      pipe = this.add.sprite(width-window.innerWidth/20, height-pipeLength, 'pipe').setOrigin(0, 0);
      flipY = true;
    }
    pipe.displayWidth = window.innerWidth/20;
    pipe.displayHeight = pipeLength;
    pipeBody = this.physics.add.existing(pipe);
    pipeBody.body.velocity.x = -200;
    pipeBody.body.setAllowGravity(false);
    pipeBody.body.immovable = true;
    pipes.push(pipe);
    this.physics.add.collider(mainSprite, pipeBody, Dead, null, this)
  }
}

function update() {
    if (cursors.up.isDown && !dead) {
      mainSprite.body.velocity.y = -150;
      if (mainSprite.angle>-45) {
        mainSprite.angle-=7; 
      }
    } else if (mainSprite.angle<90) {
      mainSprite.angle+=0.5;
    }
    if (!dead) {
      scoreCounter = 0;
      for (i=0;i<pipes.length;i++) {
        if (pipes[i].x < mainSprite.x) {
          scoreCounter++;
        }
      }
      score.innerHTML = scoreCounter;
    }
}

window.onresize = function() {
  document.getElementsByTagName("canvas")[0].style.width = 100+'vw';
  document.getElementsByTagName("canvas")[0].style.height = 100+'vh';
}
