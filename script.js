const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 200;

// Load images
const cowImg = new Image();
cowImg.src = "assets/rider_pedaling.png";

const coinImg = new Image();
coinImg.src = "assets/coin.png";

const bombImg = new Image();
bombImg.src = "assets/cone.png";

// Game variables
let cow = { x: 50, y: 150, width: 40, height: 40, dy: 0, jump: false };
let gravity = 0.6;
let ground = 160;

let coins = [];
let bombs = [];
let frame = 0;
let score = 0;
let gameOver = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !cow.jump) {
    cow.dy = -10;
    cow.jump = true;
  }
});

function drawCow() {
  ctx.drawImage(cowImg, cow.x, cow.y, cow.width, cow.height);
}

function updateCow() {
  cow.y += cow.dy;
  cow.dy += gravity;

  if (cow.y >= ground) {
    cow.y = ground;
    cow.dy = 0;
    cow.jump = false;
  }
}

function drawObjects() {
  coins.forEach((coin) => ctx.drawImage(coinImg, coin.x, coin.y, 20, 20));
  bombs.forEach((bomb) => ctx.drawImage(bombImg, bomb.x, bomb.y, 25, 25));
}

function updateObjects() {
  coins.forEach((coin, index) => {
    coin.x -= 4;
    if (coin.x < -20) coins.splice(index, 1);

    // Collision with cow
    if (
      cow.x < coin.x + 20 &&
      cow.x + cow.width > coin.x &&
      cow.y < coin.y + 20 &&
      cow.y + cow.height > coin.y
    ) {
      coins.splice(index, 1);
      score++;
      document.getElementById("score").textContent = "Score: " + score;
    }
  });

  bombs.forEach((bomb, index) => {
    bomb.x -= 5;
    if (bomb.x < -25) bombs.splice(index, 1);

    // Collision with cow → Game Over
    if (
      cow.x < bomb.x + 25 &&
      cow.x + cow.width > bomb.x &&
      cow.y < bomb.y + 25 &&
      cow.y + cow.height > bomb.y
    ) {
      gameOver = true;
      document.getElementById("restartBtn").style.display = "block";
    }
  });
}

function spawnObjects() {
  if (frame % 100 === 0) {
    coins.push({ x: 600, y: Math.random() * 100 + 60 });
  }
  if (frame % 180 === 0) {
    bombs.push({ x: 600, y: ground });
  }
}

function loop() {
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", 220, 100);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCow();
  updateCow();

  drawObjects();
  updateObjects();

  spawnObjects();

  frame++;
  requestAnimationFrame(loop);
}

// Restart button
document.getElementById("restartBtn").addEventListener("click", () => {
  score = 0;
  coins = [];
  bombs = [];
  cow.y = ground;
  gameOver = false;
  document.getElementById("score").textContent = "Score: 0";
  document.getElementById("restartBtn").style.display = "none";
  loop();
});

loop();
