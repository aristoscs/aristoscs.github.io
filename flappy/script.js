let bird;
let obstacles = [];
let gameOver = true; // Set to true initially
let holeSize = 100;
let score = 0;
let startButton;

function setup() {
  createCanvas(400, 600);
  bird = new Bird();
  startButton = createButton('Start Game');
  startButton.position(570, height + 20); // Adjust the Y position
  startButton.mousePressed(startGame);
}

function draw() {
  background(200);

  if (!gameOver) {
    bird.show();
    bird.update();

    // Check for game over condition
    if (bird.y >= height - bird.height) {
      gameOver = true;
    }

    // Move and show obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].show();
      obstacles[i].update();

      // Check for collision with obstacles
      if (obstacles[i].hits(bird)) {
        gameOver = true;
      }

      // Check for passing through the gap
      if (obstacles[i].passing(bird)) {
        score++;
      }

      // Remove obstacles that are off-screen
      if (obstacles[i].offscreen()) {
        obstacles.splice(i, 1);
      }
    }

    // Add new obstacle at regular intervals
    if (frameCount % 100 === 0) {
      obstacles.push(new Obstacle());
    }

    // Display the score
    textSize(20);
    fill(0);
    text("Score: " + score, 20, 30);
  } else {
    // Display game over message or take appropriate actions
    textSize(32);
    fill(255, 0, 0);
    text("Game Over", width / 2 - 100, height / 2);
    text("Score: " + score, width / 2 - 60, height / 2 + 40);
    startButton.show();
  }
}

function startGame() {
  // Reset game variables
  score = 0;
  obstacles = [];
  bird = new Bird();
  gameOver = false;
  startButton.hide();
}

function keyPressed() {
  if (keyCode === 32 && !gameOver) {
    bird.jump();
  }
}

class Bird {
  constructor() {
    this.x = width / 4;
    this.y = height / 2;
    this.width = 30;
    this.height = 30;
    this.velocity = 0;
    this.gravity = 0.6;
  }

  show() {
    fill(255, 255, 0);
    rect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Keep the bird within the canvas
    if (this.y > height - this.height) {
      this.y = height - this.height;
      this.velocity = 0;
    }
  }

  jump() {
    this.velocity = -8;
  }
}

class Obstacle {
  constructor() {
    this.width = 40; // Adjust the width as needed
    this.holeSize = holeSize;
    this.randomHeight = random(0, height - this.holeSize);
    this.x = width;
    this.yTop = this.randomHeight;
    this.yBottom = this.randomHeight + this.holeSize;
    this.speed = 3;
  }

  show() {
    fill(0, 255, 0);
    rect(this.x, 0, this.width, this.yTop);
    rect(this.x, this.yBottom + this.holeSize, this.width, height - (this.yBottom + this.holeSize));
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.width;
  }

  hits(bird) {
    return (
      bird.x < this.x + this.width &&
      bird.x + bird.width > this.x &&
      (bird.y < this.yTop || bird.y + bird.height > this.yBottom + this.holeSize)
    );
  }

  passing(bird) {
    return bird.x > this.x + this.width && bird.x < this.x + this.width + this.speed;
  }
}
