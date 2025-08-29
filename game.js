<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>TAKAI Rider</title>
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
    const riderImg = new Image();
    riderImg.src = "rider_pedaling.png"; // standing/running cow
    const riderJumpImg = new Image();
    riderJumpImg.src = "rider_jump.png"; // jumping cow
    const coinImg = new Image();
    coinImg.src = "coin.png";
    const bombImg = new Image();
    bombImg.src = "bomb.png";
    const coneImg = new Image();
    coneImg.src = "cone.png"; // new obstacle

    // Cow settings
    let rider = {
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

    function drawRider() {
      if (rider.isJumping) {
        ctx.drawImage(riderJumpImg, rider.x, rider.y, rider.width, rider.height);
      } else {
        ctx.drawImage(riderImg, rider.x, rider.y, rider.width, rider.height);
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
      rider.y += rider.dy;
      rider.dy += rider.gravity;
      if (rider.y > 300) {
        rider.y = 300;
        rider.dy = 0;
        rider.isJumping = false;
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
          rider.x < coin.x + coin.size &&
          rider.x + rider.width > coin.x &&
          rider.y < coin.y + coin.size &&
          rider.y + rider.height > coin.y
        ) {
          coins.splice(index, 1);
          score++;
        }
      });

      // Update obstacles
      obstacles.forEach((obs, index) => {
        obs.x -= 6;
        if (
          rider.x < obs.x + obs.size &&
          rider.x + rider.width > obs.x &&
          rider.y < obs.y + obs.size &&
          rider.y + rider.height > obs.y
        ) {
          gameOver = true;
        }
      });

      drawRider();
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
      if (e.code === "Space" && !rider.isJumping) {
        rider.dy = rider.jumpPower;
        rider.isJumping = true;
      }
      if (gameOver && e.code === "Enter") {
        // restart
        coins = [];
        obstacles = [];
        score = 0;
        rider.y = 300;
        rider.dy = 0;
        gameOver = false;
        update();
      }
    });

    update();
  </script>
</body>
</html>

