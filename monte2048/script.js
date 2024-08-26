let grid;
let gridSize = 4;
let cellSize = 100;
let padding = 10;
let simulateButton;

function setup() {
  createCanvas(gridSize * cellSize + padding * (gridSize + 1), gridSize * cellSize + padding * (gridSize + 1) + 50);
  newGame();
  simulateButton = createButton('Simulate');
  simulateButton.position(10, height - 40);
  simulateButton.mousePressed(simulateNextMove);
}

function draw() {
  background(187, 173, 160);
  drawGrid();
}

function simulateNextMove() {
    let bestMove = monteCarloTreeSearch(grid, 50);
    let moved = executeMove(bestMove, grid);

    if (moved) {
        addNewTile(grid);
    }
}

function monteCarloTreeSearch(currentGrid, depth) {
    let moves = ['up', 'down', 'left', 'right'];
    let bestMove = null;
    let maxScore = -Infinity;

    for (let move of moves) {
        let gridCopy = JSON.parse(JSON.stringify(currentGrid));
        let moved = executeMove(move, gridCopy);

        if (moved) {
            let totalScore = 0;

            for (let i = 0; i < 1000; i++) {
                let simulationGrid = JSON.parse(JSON.stringify(gridCopy));
                addNewTile(simulationGrid);
                totalScore += simulateRandomPlayout(simulationGrid, depth - 1);
            }

            let averageScore = totalScore / 100;

            if (averageScore > maxScore) {
                maxScore = averageScore;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

function simulateRandomPlayout(grid, depth) {
    if (depth === 0 || isGameOver(grid)) {
        return evaluateGrid(grid);
    }

    let moves = ['up', 'down', 'left', 'right'];
    let move = random(moves);
    let gridCopy = JSON.parse(JSON.stringify(grid));
    let moved = executeMove(move, gridCopy);

    if (moved) {
        addNewTile(gridCopy);
        return simulateRandomPlayout(gridCopy, depth - 1);
    } else {
        return evaluateGrid(gridCopy);
    }
}

function isGameOver(grid) {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) {
                return false;
            }
            if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) {
                return false;
            }
            if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) {
                return false;
            }
        }
    }
    return true;
}

function evaluateGrid(grid) {
    let score = 0;
    let emptyCells = 0;
    let cornerBonus = 0;
    let adjacencyBonus = 0;

    // Coordinates of the corners
    const corners = [
        {i: 0, j: 0},
        {i: 0, j: gridSize - 1},
        {i: gridSize - 1, j: 0},
        {i: gridSize - 1, j: gridSize - 1}
    ];

    // Calculate score, emptyCells, and cornerBonus
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let cellValue = grid[i][j];
            score += cellValue;

            if (cellValue === 0) {
                emptyCells++;
            }

            // Corner Bonus: Higher value tiles in the corners give a larger bonus
            if (corners.some(corner => corner.i === i && corner.j === j)) {
                cornerBonus += cellValue * 2; // The factor can be adjusted as needed
            }

            // Adjacency Bonus: Reward for adjacent high tiles
            if (i > 0 && grid[i-1][j] === cellValue) {
                adjacencyBonus += cellValue;
            }
            if (j > 0 && grid[i][j-1] === cellValue) {
                adjacencyBonus += cellValue;
            }
            if (i < gridSize - 1 && grid[i+1][j] === cellValue) {
                adjacencyBonus += cellValue;
            }
            if (j < gridSize - 1 && grid[i][j+1] === cellValue) {
                adjacencyBonus += cellValue;
            }
        }
    }

    // Monotonicity Bonus: Encourage grids where values decrease smoothly towards corners
    
    // Total score combines all bonuses and penalizes empty cells
    return score + emptyCells * 10 + cornerBonus + adjacencyBonus * 0.5;
}

function executeMove(move, grid) {
    let moved = false;
    switch (move) {
        case 'up':
            moved = slideUPmerge(grid);
            break;
        case 'down':
            moved = slideDOWNmerge(grid);
            break;
        case 'left':
            moved = slideLEFTmerge(grid);
            break;
        case 'right':
            moved = slideRIGHTmerge(grid);
            break;
    }
    return moved;
}

function newGame() {
  grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
  addNewTile(grid);
  addNewTile(grid);
}

function drawGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = j * cellSize + padding * (j + 1);
      let y = i * cellSize + padding * (i + 1);
      
      fill(getColor(grid[i][j]));
      rect(x, y, cellSize, cellSize, 5);
      
      if (grid[i][j] !== 0) {
        fill(grid[i][j] > 4 ? color(249, 246, 242) : color(119, 110, 101));
        textAlign(CENTER, CENTER);
        textSize(grid[i][j] < 100 ? 60 : grid[i][j] < 1000 ? 45 : 35);
        text(grid[i][j], x + cellSize / 2, y + cellSize / 2);
      }
    }
  }
}

function getColor(value) {
  switch (value) {
    case 0: return color(205, 193, 180);
    case 2: return color(238, 228, 218);
    case 4: return color(237, 224, 200);
    case 8: return color(242, 177, 121);
    case 16: return color(245, 149, 99);
    case 32: return color(246, 124, 95);
    case 64: return color(246, 94, 59);
    case 128: return color(237, 207, 114);
    case 256: return color(237, 204, 97);
    case 512: return color(237, 200, 80);
    case 1024: return color(237, 197, 63);
    case 2048: return color(237, 194, 46);
    default: return color(60, 58, 50);
  }
}

function addNewTile(targetGrid) {
    let emptyCells = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (targetGrid[i][j] === 0) {
          emptyCells.push({i, j});
        }
      }
    }
    if (emptyCells.length > 0) {
      let {i, j} = random(emptyCells);
      targetGrid[i][j] = random() < 0.9 ? 2 : 4;
    }
}

function keyPressed() {
  let moved = false;
  if (keyCode === UP_ARROW) {
    moved = slideUPmerge(grid);
  } else if (keyCode === DOWN_ARROW) {
    moved = slideDOWNmerge(grid);
  } else if (keyCode === LEFT_ARROW) {
    moved = slideLEFTmerge(grid);
  } else if (keyCode === RIGHT_ARROW) {
    moved = slideRIGHTmerge(grid);
  }
  if (moved) {
    addNewTile(grid);
  }
}

function slideUPmerge(grid) {
    let moved = false;
    for (let j = 0; j < gridSize; j++) {
      let column = [];
      for (let i = 0; i < gridSize; i++) {
        if (grid[i][j] !== 0) {
          column.push(grid[i][j]);
        }
      }
      let mergedColumn = [];
      for (let i = 0; i < column.length; i++) {
        if (i < column.length - 1 && column[i] === column[i + 1]) {
          mergedColumn.push(column[i] * 2);
          i++;
          moved = true;
        } else {
          mergedColumn.push(column[i]);
        }
      }
      while (mergedColumn.length < gridSize) {
        mergedColumn.push(0);
      }
      for (let i = 0; i < gridSize; i++) {
        if (grid[i][j] !== mergedColumn[i]) {
          moved = true;
        }
        grid[i][j] = mergedColumn[i];
      }
    }
    return moved;
  }
  
  function slideDOWNmerge(grid) {
    let moved = false;
    for (let j = 0; j < gridSize; j++) {
      let column = [];
      for (let i = gridSize - 1; i >= 0; i--) {
        if (grid[i][j] !== 0) {
          column.push(grid[i][j]);
        }
      }
      let mergedColumn = [];
      for (let i = 0; i < column.length; i++) {
        if (i < column.length - 1 && column[i] === column[i + 1]) {
          mergedColumn.push(column[i] * 2);
          i++;
          moved = true;
        } else {
          mergedColumn.push(column[i]);
        }
      }
      while (mergedColumn.length < gridSize) {
        mergedColumn.push(0);
      }
      for (let i = 0; i < gridSize; i++) {
        if (grid[gridSize - 1 - i][j] !== mergedColumn[i]) {
          moved = true;
        }
        grid[gridSize - 1 - i][j] = mergedColumn[i];
      }
    }
    return moved;
  }
  
  function slideLEFTmerge(grid) {
    let moved = false;
    for (let i = 0; i < gridSize; i++) {
      let row = grid[i].filter(cell => cell !== 0);
      let mergedRow = [];
      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          mergedRow.push(row[j] * 2);
          j++;
          moved = true;
        } else {
          mergedRow.push(row[j]);
        }
      }
      while (mergedRow.length < gridSize) {
        mergedRow.push(0);
      }
      if (mergedRow.some((cell, index) => cell !== grid[i][index])) {
        moved = true;
      }
      grid[i] = mergedRow;
    }
    return moved;
  }
  
  function slideRIGHTmerge(grid) {
    let moved = false;
    for (let i = 0; i < gridSize; i++) {
      let row = grid[i].filter(cell => cell !== 0).reverse();
      let mergedRow = [];
      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          mergedRow.push(row[j] * 2);
          j++;
          moved = true;
        } else {
          mergedRow.push(row[j]);
        }
      }
      while (mergedRow.length < gridSize) {
        mergedRow.unshift(0);
      }
      if (mergedRow.some((cell, index) => cell !== grid[i][gridSize - 1 - index])) {
        moved = true;
      }
      grid[i] = mergedRow;
    }
    return moved;
  }
