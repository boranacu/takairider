let gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: { preload, create, update }
};

let player, coins, bombs, cursors, score = 0, scoreText, gameOver = false;

new Phaser.Game(gameConfig);

function preload() {
    this.load.atlas('rider', 'assets/rider.png', 'assets/rider.json'); // pedaling animation
    this.load.spritesheet('coin', 'assets/coin.png', { frameWidth: 32, frameHeight: 32 }); // coin spin
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('cone', 'assets/cone.png');
    this.load.image('bg', 'assets/bg.png'); // optional background
}

function create() {
    this.add.image(400, 200, 'bg'); // background

    // Rider
    player = this.physics.add.sprite(100, 300, 'rider');
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'pedal',
        frames: this.anims.generateFrameNames('rider', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    player.play('pedal');

    // Coins
    coins = this.physics.add.group();
    this.anims.create({
        key: 'spin',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    // Bombs/Cones
    bombs = this.physics.add.group();

    // Score
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#000' });

    // Input
    cursors = this.input.keyboard.createCursorKeys();

    // Collisions
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Timers
    this.time.addEvent({ delay: 1500, callback: spawnCoin, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 2000, callback: spawnBomb, callbackScope: this, loop: true });
}

function update() {
    if (gameOver) return;

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }
}

function collectCoin(player, coin) {
    coin.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    scoreText.setText('Game Over! Score: ' + score);
}

function spawnCoin() {
    let y = Phaser.Math.Between(150, 300);
    let coin = coins.create(820, y, 'coin');
    coin.setVelocityX(-200);
    coin.play('spin');
}

function spawnBomb() {
    let y = 340; // ground obstacle
    let type = Phaser.Math.Between(0, 1) ? 'bomb' : 'cone';
    let obstacle = bombs.create(820, y, type);
    obstacle.setVelocityX(-250);
    obstacle.setImmovable(true);
}