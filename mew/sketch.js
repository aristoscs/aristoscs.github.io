let ship;
let lasers = [];
let enemies = [];
let bossEnemies = [];
let goldCoins = [];
let gameIsOver = false;
let score = 0;

function setup() {
    createCanvas(600, 600);
    ship = new Ship();
}

function draw() {
    background(200);

    if (!gameIsOver) {
        // Handle user input
        if (keyIsDown(87)) {  // W key
            ship.move(0.4);  // Move forward
        }
        if (keyIsDown(83)) {  // S key
            ship.move(-0.4);  // Move backward
        }
        if (keyIsDown(65)) {  // A key
            ship.turn(-0.05);  // Turn left
        }
        if (keyIsDown(68)) {  // D key
            ship.turn(0.05);  // Turn right
        }
        if (keyIsDown(32)) {  // Spacebar
            ship.shoot();  // Shoot lasers
        }

        // Update and display the ship
        ship.update();
        ship.show();

        // Update and display lasers
        for (let i = lasers.length - 1; i >= 0; i--) {
            lasers[i].update();
            lasers[i].show();

            // Check for collisions with regular enemies
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (lasers[i].hits(enemies[j])) {
                    lasers.splice(i, 1);
                    enemies[j].health -= 1;

                    if (enemies[j].health <= 0) {
                        // Drop a gold coin when enemy is killed
                        goldCoins.push(new GoldCoin(enemies[j].pos.x, enemies[j].pos.y, 1));
                        enemies.splice(j, 1);
                        score += 1; // Increase the score
                    }
                    break; // Break to avoid iterating over removed enemies
                }
            }

            // Check for collisions with boss enemies
            for (let k = bossEnemies.length - 1; k >= 0; k--) {
                if (lasers[i].hits(bossEnemies[k])) {
                    lasers.splice(i, 1);
                    bossEnemies[k].health -= 1;

                    if (bossEnemies[k].health <= 0) {
                        // Drop a bigger coin when boss enemy is killed
                        goldCoins.push(new GoldCoin(bossEnemies[k].pos.x, bossEnemies[k].pos.y, 3));
                        bossEnemies.splice(k, 1);
                        score += 3; // Increase the score more for boss enemy
                    }
                    break; // Break to avoid iterating over removed boss enemies
                }
            }

            if (lasers[i].isOffscreen()) {
                lasers.splice(i, 1);  // Remove offscreen lasers
            }
        }

        // Update and display regular enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();
            enemies[i].show();

            // Check for collisions with the ship
            if (ship.hits(enemies[i])) {
                gameIsOver = true;
                break; // Break to avoid iterating over removed enemies
            }

            if (enemies[i].isOffscreen()) {
                enemies.splice(i, 1);  // Remove offscreen enemies
            }
        }

        // Update and display boss enemies
        for (let i = bossEnemies.length - 1; i >= 0; i--) {
            bossEnemies[i].approachShip(ship);
            bossEnemies[i].show();

            // Check for collisions with the ship
            if (ship.hits(bossEnemies[i])) {
                gameIsOver = true;
                break; // Break to avoid iterating over removed boss enemies
            }

            if (bossEnemies[i].isOffscreen()) {
                bossEnemies.splice(i, 1);  // Remove offscreen boss enemies
            }
        }

        // Update and display gold coins
        for (let i = goldCoins.length - 1; i >= 0; i--) {
            goldCoins[i].show();

            // Check for collisions with the ship
            if (ship.collectsGoldCoin(goldCoins[i])) {
                goldCoins.splice(i, 1);
            }
        }

        // Display the score
        fill(255, 255, 0);
        textSize(20);
        textAlign(LEFT, TOP);
        text("Score: " + score, 10, 10);

        // Add regular enemies from the right side
        if (frameCount % 60 === 0) {  // Add an enemy every second
            enemies.push(new Enemy(width, random(0, height)));
        }

        // Add boss enemies after 20 seconds
        if (frameCount % (1200 / 2) === 0) {  // Add a boss enemy every 20 seconds
            bossEnemies.push(new BossEnemy(width, random(0, height)));
        }
    } else {
        // Display game over message or actions
        fill(255, 0, 0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Game Over!", width / 2, height / 2);
    }
}

function Ship() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(0, 0);
    this.r = 10;
    this.angle = PI / 2;
    this.rotationSpeed = 0.1;

    this.show = function() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
        pop();
    }

    this.move = function(speed) {
        const force = p5.Vector.fromAngle(this.angle - HALF_PI);
        force.mult(speed);
        this.vel.add(force);
    }

    this.turn = function(angle) {
        this.angle += angle;
    }

    this.update = function() {
        this.pos.add(this.vel);
        this.vel.mult(0.98);  // Apply a simple friction-like effect

        // Restrict the ship within the canvas boundaries
        this.pos.x = constrain(this.pos.x, 0, width);
        this.pos.y = constrain(this.pos.y, 0, height);
    }

    this.shoot = function() {
        const laserPos = p5.Vector.fromAngle(this.angle - HALF_PI);
        laserPos.mult(this.r);  // Set laser position to the tip of the ship
        laserPos.add(this.pos);
        lasers.push(new Laser(laserPos, this.angle));
    }

    this.hits = function(enemy) {
        const d = dist(this.pos.x, this.pos.y, enemy.pos.x, enemy.pos.y);
        return d < this.r + enemy.r;
    }

    this.collectsGoldCoin = function(coin) {
        const d = dist(this.pos.x, this.pos.y, coin.pos.x, coin.pos.y);
        if (d < this.r + coin.r) {
            score += coin.value;
            return true;
        }
        return false;
    }
}

function Enemy(x, y) {
    this.pos = createVector(x, y);
    this.r = 20;
    this.health = 3;  // Initial health

    this.show = function() {
        push();
        fill(0, 0, 255);
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
        pop();

        // Display health bar
        push();
        fill(255, 0, 0);
        rect(this.pos.x - this.r, this.pos.y - this.r - 10, this.r * 2, 5);
        fill(0, 255, 0);
        const healthWidth = map(this.health, 0, 3, 0, this.r * 2);
        rect(this.pos.x - this.r, this.pos.y - this.r - 10, healthWidth, 5);
        pop();
    }

    this.update = function() {
        this.pos.x -= 2;  // Move from right to left
        // You can add more complex movement logic here if needed
    }

    this.isOffscreen = function() {
        return (this.pos.x < 0);
    }
}

function BossEnemy(x, y) {
    this.pos = createVector(x, y);
    this.r = 40;
    this.health = 24;  // 8 times more health than regular enemies

    this.show = function() {
        push();
        fill(255, 0, 0);
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
        pop();

        // Display health bar
        push();
        fill(255, 0, 0);
        rect(this.pos.x - this.r, this.pos.y - this.r - 10, this.r * 2, 5);
        fill(0, 255, 0);
        const healthWidth = map(this.health, 0, 24, 0, this.r * 2);
        rect(this.pos.x - this.r, this.pos.y - this.r - 10, healthWidth, 5);
        pop();
    }

    this.approachShip = function(ship) {
        const target = createVector(ship.pos.x, ship.pos.y);
        const direction = p5.Vector.sub(target, this.pos);
        direction.normalize();
        direction.mult(1);  // Move slower than regular enemies
        this.pos.add(direction);
    }

    this.isOffscreen = function() {
        return (this.pos.x < 0);
    }
}

function Laser(pos, angle) {
    this.pos = createVector(pos.x, pos.y);
    this.vel = p5.Vector.fromAngle(angle - HALF_PI);  // Adjust the angle here
    this.vel.mult(5);  // Adjust speed of the laser

    this.show = function() {
        push();
        stroke(255, 0, 0);
        strokeWeight(4);
        point(this.pos.x, this.pos.y);
        pop();
    }

    this.update = function() {
        this.pos.add(this.vel);
    }

    this.isOffscreen = function() {
        return (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0);
    }

    this.hits = function(enemy) {
        const d = dist(this.pos.x, this.pos.y, enemy.pos.x, enemy.pos.y);
        return d < enemy.r;
    }
}

function GoldCoin(x, y, value) {
    this.pos = createVector(x, y);
    this.r = 15;
    this.value = value;

    this.show = function() {
        push();
        fill(255, 255, 0);
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
        fill(0);
        textSize(12);
        textAlign(CENTER, CENTER);
        text(this.value, this.pos.x, this.pos.y);
        pop();
    }
}
