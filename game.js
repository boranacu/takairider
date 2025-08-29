const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  parent: "gameContainer",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 1000 }, debug: false }
  },
  scene: { preload, create, update }
};

let player, coins, cursors, scoreText, score = 0;

new Phaser.Game(config);

function preload() {
  this.load.atlas("rider", "assets/rider.png", "assets/rider.json");
  this.load.image("rider_jump", "assets/rider_jump.png");
  this.load.spritesheet("coin", "assets/coin.png", { frameWidth: 190, frameHeight: 190 });
  this.load.image("bg", "assets/bg.png");
  this.load.image("cone", "assets/cone.png");
  this.load.image("bomb", "assets/bomb.png");
}

function create() {
  // Background
  this.bg = this.add.tileSprite(0, 0, 800, 400, "bg").setOrigin(0,0).setScrollFactor(0);

  // Player
  player = this.physics.add.sprite(100, 300, "rider").setScale(0.3);
  player.setCollideWorldBounds(true);

  // Animations
  this.anims.create({
    key: "pedal",
    frames: this.anims.generateFrameNames("rider", { prefix: "Ride", start: 0, end: 2 }),
    frameRate: 8,
    repeat: -1
  });

  this.anims.create({
    key: "coin_spin",
    frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1
  });

  player.play("pedal");

  // Input
  cursors = this.input.keyboard.createCursorKeys();

  // Groups
  coins = this.physics.add.group();
  this.time.addEvent({
    delay: 2000,
    callback: () => {
      let coin = coins.create(800, Phaser.Math.Between(200, 350), "coin").setScale(0.5);
      coin.play("coin_spin");
      coin.setVelocityX(-200);
    },
    loop: true
  });

  obstacles = this.physics.add.group();
  this.time.addEvent({
    delay: 3000,
    callback: () => {
      let obstacle = obstacles.create(800, 350, Phaser.Math.Between(0,1) ? "cone" : "bomb").setScale(0.2);
      obstacle.setVelocityX(-200);
      obstacle.setImmovable(true);
    },
    loop: true
  });

  // Collisions
  this.physics.add.overlap(player, coins, (p, coin) => {
    coin.destroy();
    score += 10;
    scoreText.setText("Score: " + score);
  });

  this.physics.add.collider(player, obstacles, () => {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.stop();
    scoreText.setText("Game Over! Final Score: " + score);
  });

  // Score text
  scoreText = this.add.text(20, 20, "Score: 0", { fontSize: "24px", fill: "#fff" });
}

function update() {
  this.bg.tilePositionX += 2;

  if (cursors.space.isDown && player.body.touching.down) {
    player.setVelocityY(-500);
    player.setTexture("rider_jump"); // show jump pose
  }

  if (player.body.touching.down && !player.anims.isPlaying) {
    player.play("pedal");
  }
}
