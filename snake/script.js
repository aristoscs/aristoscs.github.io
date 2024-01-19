let snake;
let foods = [];
let slowdownFrames = 0;

function setup() {
  createCanvas(600, 600);
  frameRate(10);
  snake = new Snake();
  for (let i = 0; i < 3; i++) {
    foods.push(createFood());
  }
}

function draw() {
  background(51);
  snake.move();
  snake.checkCollision();
  snake.display();

  for (let i = 0; i < foods.length; i++) {
    if (foods[i].cursed) {
      fill(0, 0, 255); // Blue color for cursed food
    } else {
      fill(255, 0, 0); // Red color for normal food
    }
    noStroke();
    rect(foods[i].x, foods[i].y, 20, 20);
    
    if (snake.eat(foods[i])) {
      if (foods[i].cursed) {
        // Handle cursed food effect (e.g., slowdown)
        slowdownFrames = 8 * frameRate(); // Slow down for 8 seconds
      }
      foods[i] = createFood();
    }
  }

  // Slow down frame rate if needed
  if (slowdownFrames > 0) {
    frameRate(5);
    slowdownFrames--;
  } else {
    frameRate(10);
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW && snake.ySpeed === 0) {
    snake.setDirection(0, -1);
  } else if (keyCode === DOWN_ARROW && snake.ySpeed === 0) {
    snake.setDirection(0, 1);
  } else if (keyCode === LEFT_ARROW && snake.xSpeed === 0) {
    snake.setDirection(-1, 0);
  } else if (keyCode === RIGHT_ARROW && snake.xSpeed === 0) {
    snake.setDirection(1, 0);
  }
}

function createFood() {
  const cols = floor(width / 20);
  const rows = floor(height / 20);
  const foodPos = createVector(floor(random(cols)), floor(random(rows)));
  foodPos.mult(20);

  // 10% chance for cursed food (blue)
  const isCursed = random() < 0.1;

  return { x: foodPos.x, y: foodPos.y, cursed: isCursed };
}

class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(width / 2), floor(height / 2));
    this.xSpeed = 1;
    this.ySpeed = 0;
  }

  setDirection(x, y) {
    this.xSpeed = x;
    this.ySpeed = y;
  }

  move() {
    const head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xSpeed * 20;
    head.y += this.ySpeed * 20;
    this.body.push(head);
  }

  eat(pos) {
    const head = this.body[this.body.length - 1];
    if (head.x === pos.x && head.y === pos.y) {
      this.body.push(createVector(pos.x, pos.y));
      return true;
    }
    return false;
  }

  checkCollision() {
    const head = this.body[this.body.length - 1];
    if (head.x < 0) {
      head.x = width - 20;
    } else if (head.x >= width) {
      head.x = 0;
    }

    if (head.y < 0) {
      head.y = height - 20;
    } else if (head.y >= height) {
      head.y = 0;
    }

    for (let i = 0; i < this.body.length - 1; i++) {
      const part = this.body[i];
      if (head.x === part.x && head.y === part.y) {
        gameOver();
      }
    }
  }

  display() {
    for (let i = 0; i < this.body.length; i++) {
      if (i === this.body.length - 1) {
        fill(25, 255, 150);
      } else {
        fill(0, 255, 0);
      }
      
      noStroke();
      rect(this.body[i].x, this.body[i].y, 20, 20);
    }
  }
}

function gameOver() {
  alert("Game Over! Press OK to restart.");
  snake = new Snake();
}
