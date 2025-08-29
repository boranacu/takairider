const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver = false;
let score = 0;

// Load images
const bg = new Image();
bg.src = "assets/background.png";

const riderPedal = new Image();
riderPedal.src = "assets/rider_pedaling.png";

const riderJump = new Image();
riderJump.src = "assets/rider_jump.png";

const coinImg = new Image();
coinImg.src = "assets/coin.png";

const bombImg = new Image();
bombImg.src = "assets/bomb.png";

const coneImg = new Image();
coneImg.src = "assets/cone.png";

// Rider properties
let rider = {
  x: 100,
  y: 300,
  width: 80,
  height: 80,
  dy: 0,
  gravity: 0.6,
  jumpPower: -12,
  grounded: true,
  jumping: false
};

// Obstacles & coins
let obstacles = [];
let coins = [];

// Background scrolling
let bgX = 0;

function drawBackground() {
  bgX -= 2;
  if (bgX <= -canvas.width) bgX = 0;
  ctx.drawImage(bg, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, bgX + canvas.width, 0, canvas.width, canvas.height);
}

// Draw rider
function drawRider() {
  const img = rider.jumping ? riderJump : riderPedal;
  ctx.drawImage(img, rider.x, rider.y, rider.width, rider.height);
}

// Spawn obstacles
function spawnObstacle() {
  let type = Math.random() < 0.5 ? "bomb" : "cone";
  obstacles.push({
    x: canvas.width,
    y: 320,
    width: 50,
    height: 50,
    img: type === "bomb" ? bombImg : coneImg
  });
}

// Spawn coins
function spawnCoin() {
  coins.push({
    x: canvas.width,
    y: 250,
    width: 40,
    height: 40,
    img: coinImg
  });
}

// Update game
function update() {
  if (gameOver) return;

  // Gravity
  rider.y += rider.dy;
  rider.dy += rider.gravity;

  if (rider.y >= 300) {
    rider.y = 300;
    rider.grounded = true;
    rider.jumping = false;
  }

  // Move obstacles
  obstacles.forEach((ob, i) => {
    ob.x -= 5;
    if (ob.x + ob.width < 0) obstacles.splice(i, 1);

    // Collision check
    if (
      rider.x < ob.x + ob.width &&
      rider.x + rider.width > ob.x &&
      rider.y < ob.y + ob.height &&
      rider.y + rider.height > ob.y
    ) {
      gameOver = true;
    }
  });

  // Move coins
  coins.forEach((c, i) => {
    c.x -= 5;
    if (c.x + c.width < 0) coins.splice(i, 1);

    // Collision check
    if (
      rider.x < c.x + c.width &&
      rider.x + rider.width > c.x &&
      rider.y < c.y + c.height &&
      rider.y + rider.height > c.y
    ) {
      score += 10;
      coins.splice(i, 1);
    }
  });

  // Spawn
  if (Math.random() < 0.01) spawnObstacle();
  if (Math.random() < 0.02) spawnCoin();
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawRider();

  // Obstacles
  obstacles.forEach(ob => ctx.drawImage(ob.img, ob.x, ob.y, ob.width, ob.height));

  // Coins
  coins.forEach(c => ctx.drawImage(c.img, c.x, c.y, c.width, c.height));

  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

// Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && rider.grounded) {
    rider.dy = rider.jumpPower;
    rider.grounded = false;
    rider.jumping = true;
  }
});
