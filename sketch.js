const TILE_SIZE = 50;
const MAP_WIDTH = 8;
const MAP_HEIGHT = 8;

const colors = {
  player: '#00FFFF', // Cyan
  floor: '#A0522D', // Brown
  box: '#D2B48C', // Light Brown
  target: '#A0522D', // Brown (same as floor color)
  wall: '#808080' // Gray
};

let playerPos;
let boxes;
let targets;
let walls;

function setup() {
  createCanvas(TILE_SIZE * MAP_WIDTH, TILE_SIZE * MAP_HEIGHT);
  initializeGame();
}

function draw() {
  background(255);
  drawMap();
}

function initializeGame() {
  playerPos = createVector(1, 1);
  boxes = [
    createVector(2, 3),
    createVector(4, 2)
  ];
  targets = [
    createVector(6, 3),
    createVector(2, 4)
  ];
  walls = [
    createVector(0, 0),
    createVector(1, 0),
    createVector(3, 0),
    createVector(5, 0),
    createVector(6, 0),
    createVector(7, 0),
    createVector(0, 5),
    createVector(0, 6),
    createVector(7, 7)
  ];
}

function drawMap() {
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const posX = x * TILE_SIZE;
      const posY = y * TILE_SIZE;

      // Draw floor
      fill(colors.floor);
      rect(posX, posY, TILE_SIZE, TILE_SIZE);

      // Draw targets (red dot)
      if (isTargetTile(x, y)) {
        fill('#FF0000');
        ellipse(posX + TILE_SIZE / 2, posY + TILE_SIZE / 2, TILE_SIZE * 0.3);
      }

      // Draw walls
      if (isWallTile(x, y)) {
        fill(colors.wall);
        rect(posX, posY, TILE_SIZE, TILE_SIZE);
      }

      // Draw boxes
      if (isBoxTile(x, y)) {
        fill(colors.box);
        rect(posX, posY, TILE_SIZE, TILE_SIZE);
        // Draw 'X' on the box
        fill(0);
        textSize(24);
        text('X', posX + TILE_SIZE * 0.35, posY + TILE_SIZE * 0.7);
      }

      // Draw player
      if (playerPos.x === x && playerPos.y === y) {
        fill(colors.player);
        ellipse(posX + TILE_SIZE / 2, posY + TILE_SIZE / 2, TILE_SIZE * 0.8);
      }
    }
  }
}

function checkLevelCompletion() {
  for (const target of targets) {
    if (!boxes.some(box => box.x === target.x && box.y === target.y)) {
      return false; // If any target position has no box on top, the level is not complete
    }
  }
  return true; // If all target positions have a box on top, the level is complete
}

function isWallTile(x, y) {
  return walls.some(wall => wall.x === x && wall.y === y);
}

function isBoxTile(x, y) {
  return boxes.some(box => box.x === x && box.y === y);
}

function isTargetTile(x, y) {
  return targets.some(target => target.x === x && target.y === y);
}

function keyPressed() {
  const dx = key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : 0;
  const dy = key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
  movePlayer(dx, dy);
}

function movePlayer(dx, dy) {
  if (canMove!)
	  return;
	
  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;

  if (!isWallTile(newX, newY) && !isBoxTile(newX, newY)) {
    playerPos.set(newX, newY);
  } else if (isBoxTile(newX, newY)) {
    const newBoxX = newX + dx;
    const newBoxY = newY + dy;
    if (!isWallTile(newBoxX, newBoxY) && !isBoxTile(newBoxX, newBoxY)) {
      const boxIndex = boxes.findIndex(box => box.x === newX && box.y === newY);
      boxes[boxIndex].set(newBoxX, newBoxY);
      playerPos.set(newX, newY);
    }
  }
  
  if (checkLevelCompletion()) {
    showCongratulationMessage();
  }
}

function showCongratulationMessage() {
  canMove = false; // Prevent the player from moving

  const messagePopup = document.getElementById('messagePopup');
  messagePopup.innerHTML = "Congratulations! Level Completed!";
  messagePopup.classList.add('rainbow-text');
  messagePopup.style.display = 'block';

  // Hide the message after 5 seconds and show the reset button
  setTimeout(() => {
    messagePopup.style.display = 'none';
    messagePopup.classList.remove('rainbow-text');

    const resetButton = document.getElementById('resetButton');
    resetButton.style.display = 'block';
  }, 5000);
}

function resetLevel() {
  canMove = true; // Allow the player to move again

  const resetButton = document.getElementById('resetButton');
  resetButton.style.display = 'none';

  initializeGame();
}
