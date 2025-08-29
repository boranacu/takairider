<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cow Runner</title>
  <style>
    body {
      margin: 0;
      background: #f0f0f0;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }
    canvas {
      display: block;
      margin: auto;
      background: #cceeff;
      border: 2px solid #333;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="800" height="400"></canvas>

  <script>
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Load images
    const cowImg = new Image();
    cowImg.src = "rider_pedaling.png"; // standing/running cow
    const cowJumpImg = new Image();
    cowJumpImg.src = "rider_jump.png"; // jumping cow
    const coinImg = new Image();
    coinImg.src = "coin.png";
    const bombImg = new Image();
    bombImg.src = "bomb.png";
    const coneImg = new Image();
    coneImg.src = "cone.png"; // new obstacle

    // Cow settings
    let cow = {
      x: 50,
      y: 300,
      width: 50,
      height: 50,
      dy: 0,
      gravity: 0.8,
      jumpPower: -12,
      isJumping: false
    };

    let coins = [];
    let obstacles = [];
    let score = 0;
    let gameOver = false;
    let frame = 0;

    function drawCow() {
      if (cow.isJumping) {
        ctx.drawImage(cowJumpImg, cow.x, cow.y, cow.width, cow.height);
      } else {
        ctx.drawImage(cowImg, cow.x, cow.y, cow.width, cow.height);
      }
    }

    function drawCoins() {
      coins.forEach(coin => {
        ctx.drawImage(coinImg, coin.x, coin.y, coin.size, coin.size);
      });
    }

    function drawObstacles() {
      obstacles.forEach(obs => {
        ctx.drawImage(obs.type === "bomb" ? bombImg : coneImg, obs.x, obs.y, obs.size, obs.size);
      });
    }

    function update() {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = "#44aa44";
      ctx.fillRect(0, 350, canvas.width, 50);

      // Update cow
      cow.y += cow.dy;
      cow.dy += cow.gravity;
      if (cow.y > 300) {
        cow.y = 300;
        cow.dy = 0;
        cow.isJumping = false;
      }

      // Spawn coins
      if (frame % 100 === 0) {
        coins.push({ x: canvas.width, y: 280, size: 30 });
      }

      // Spawn obstacles (bombs and cones)
      if (frame % 150 === 0) {
        const type = Math.random() > 0.5 ? "bomb" : "cone";
        obstacles.push({ x: canvas.width, y: 300, size: 40, type: type });
      }

      // Update coins
      coins.forEach((coin, index) => {
        coin.x -= 5;
        if (
          cow.x < coin.x + coin.size &&
          cow.x + cow.width > coin.x &&
          cow.y < coin.y + coin.size &&
          cow.y + cow.height > coin.y
        ) {
          coins.splice(index, 1);
          score++;
        }
      });

      // Update obstacles
      obstacles.forEach((obs, index) => {
        obs.x -= 6;
        if (
          cow.x < obs.x + obs.size &&
          cow.x + cow.width > obs.x &&
          cow.y < obs.y + obs.size &&
          cow.y + cow.height > obs.y
        ) {
          gameOver = true;
        }
      });

      drawCow();
      drawCoins();
      drawObstacles();

      // Score
      ctx.fillStyle = "#000";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + score, 20, 30);

      frame++;
      requestAnimationFrame(update);
    }

    document.addEventListener("keydown", e => {
      if (e.code === "Space" && !cow.isJumping) {
        cow.dy = cow.jumpPower;
        cow.isJumping = true;
      }
      if (gameOver && e.code === "Enter") {
        // restart
        coins = [];
        obstacles = [];
        score = 0;
        cow.y = 300;
        cow.dy = 0;
        gameOver = false;
        update();
      }
    });

    update();
  </script>
</body>
</html>
