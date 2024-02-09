const TOTAL = 500;
let birds = [];
let savedBirds = [];
let obstacles = [];
let gameOver = true; // Set to true initially
let holeSize = 100;
let startButton;

function setup() {
  createCanvas(400, 600);

  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
}

function draw() {
  background(200);

  for (let bird of birds) {
    bird.think(obstacles);
    bird.show();
    bird.update();
  }

  if (birds.length === 0) {
    nextGeneration();
    obstacles = [];
  }


  // Move and show obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].show();
    obstacles[i].update();

    for (let j = birds.length - 1; j >= 0; j--) {
      if (obstacles[i].hits(birds[j])) {
        savedBirds.push(birds.splice(j, 1)[0]);
      }
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

}

class Bird {
  constructor(brain) {
    this.x = width / 4;
    this.y = height / 2;
    this.width = 30;
    this.height = 30;
    this.velocity = 0;
    this.gravity = 0.6;

    this.score = 0;
    this.fitness = 0;
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(4, 4, 2);
    }
  }

  mutate() {
    this.brain.mutate(0.1);
  }

  think(obstacles) {
    if (!obstacles[0])
      return;

    let closest = null;
    let closestD = Infinity;
    for (let i = 0; i < obstacles.length; i++) {
      let d = obstacles[i].x - this.x;
      if (d < closestD && d > 0) {
        closest = obstacles[i];
        closestD = d;
      }
    }

    let inputs = [
      this.y,
      closest.yBottom,
      closest.yTop,
      closest.x
    ];
    let output = this.brain.predict(inputs);
    if (output[0] > output[1]) {
      this.jump();
    }
  }

  show() {
    fill(255, 255, 0);
    rect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.score++;

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
