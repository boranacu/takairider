const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const riderImg = new Image();
riderImg.src = "rider_pedaling.png";

const riderJumpImg = new Image();
riderJumpImg.src = "rider_jump.png";

const coinImg = new Image();
coinImg.src = "coin.png";

const bombImg = new Image();
bombImg.src = "bomb.png";

const coneImg = new Image();
coneImg.src = "cone.png";

// Game variables
let rider = {
  x: 50,
  y: 300,
  width: 50,
  height: 50,
  dy: 0,
  gravity: 0.8,
  jumpPower: -12,
  grounded: true,
  jumping: false
};

let obstacles = [];
let coins = [];
let score = 0;
let gameOver = false;
let frame = 0;

// Jump control
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && rider.grounded) {
    rider.dy = rider.jumpPower;
    rider.grounded = false;
    rider.jumping = true;
  }
});

// Game loop
function update() {
  if (gameOver) return;

  frame++;

  // Rider physics
  rider.y += rider.dy;
  rider.dy += rider.gravity;
  if (rider.y >= 300) {
    rider.y = 300;
    rider.grounded = true;
    rider.jumping = false;
  }

  // Spawn obstacles (bomb or cone)
  if (frame % 120 === 0) {
    let type = Math.random() < 0.5 ? "bomb" : "cone";
    obstacles.push({
      x: 800,
      y: 330,
      width: 40,
      height: 40,
      type: type
    });
  }

  // Spawn coins
  if (frame % 100 === 0) {
    coins.push({
      x: 800,
      y: 250 + Math.random() * 100,
      width: 30,
      height: 30
    });
  }

  // Move & check collision
  obstacles.forEach((o, i) => {
    o.x -= 5;

    if (
      rider.x < o.x + o.width &&
      rider.x + rider.width > o.x &&
      rider.y < o.y + o.height &&
      rider.y + rider.height > o.y
    ) {
      gameOver = true;
    }

    if (o.x + o.width < 0) obstacles.splice(i, 1);
  });

  coins.forEach((c, i) => {
    c.x -= 5;

    if (
      rider.x < c.x + c.width &&
      rider.x + rider.width > c.x &&
      rider.y < c.y + c.height &&
      rider.y + rider.height > c.y
    ) {
      score++;
      coins.splice(i, 1);
    }

    if (c.x + c.width < 0) coins.splice(i, 1);
  });

  draw();
  requestAnimationFrame(update);
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rider
  if (rider.jumping) {
    ctx.drawImage(riderJumpImg, rider.x, rider.y, rider.width, rider.height);
  } else {
    ctx.drawImage(riderImg, rider.x, rider.y, rider.width, rider.height);
  }

  // Obstacles
  obstacles.forEach(o => {
    if (o.type === "bomb") {
      ctx.drawImage(bombImg, o.x, o.y, o.width, o.height);
    } else {
      ctx.drawImage(coneImg, o.x, o.y, o.width, o.height);
    }
  });

  // Coins
  coins.forEach(c => {
    ctx.drawImage(coinImg, c.x, c.y, c.width, c.height);
  });

  // Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);

  // Game Over
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", 300, 200);
  }
}

// Start game
update();
