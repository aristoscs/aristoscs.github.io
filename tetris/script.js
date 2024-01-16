let blue = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
];

let cyan = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
];

let green = [
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
];

let orange = [
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
];

let brown = [
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

let pink = [
    [0, 1, 0, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
];

let purple = [
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
];

let ROWS = 20;
let COLS = 10;
let BLOCK_SIZE = 30;

let grid;
let piece;
let newPiece;

let score = 0;

function setup() {
    createCanvas(480, 600);
    grid = createEmptyGrid();
    frameRate(3);

    textFont('Arial');
    textSize(36);
    textAlign(CENTER, CENTER);

    

    let rand = Math.floor(random(7));
    if (rand === 0) {
        piece = new Piece(blue, 1);
    } else if (rand === 1) {
        piece = new Piece(cyan, 2);
    } else if (rand === 2) {
        piece = new Piece(green, 3);
    } else if (rand === 3) {
        piece = new Piece(orange, 4);
    } else if (rand === 4) {
         piece = new Piece(brown, 5);
    } else if (rand === 5) {
        piece = new Piece(pink, 6);
    } else if (rand === 6) {
        piece = new Piece(purple, 7);
    }

    rand = Math.floor(random(7));
    if (rand === 0) {
        newPiece = new Piece(blue, 1);
    } else if (rand === 1) {
        newPiece = new Piece(cyan, 2);
    } else if (rand === 2) {
        newPiece = new Piece(green, 3);
    } else if (rand === 3) {
        newPiece = new Piece(orange, 4);
    } else if (rand === 4) {
        newPiece = new Piece(brown, 5);
    } else if (rand === 5) {
        newPiece = new Piece(pink, 6);
    } else if (rand === 6) {
        newPiece = new Piece(purple, 7);
    }
}

function draw() {
    background(240);
    drawGrid();

    fill(0);
    noStroke();
    text(score, 400, 40);

    piece.show();
    piece.update();

    newPiece.newShow();

    if (piece.frozen) {
        makePartOfGrid(piece);
        checkFinishedRows();
        if (piece.top() <= 0) {
            window.alert('Game over!');
            grid = createEmptyGrid();
            piece = new Piece(blue, 1);
        } else {
            piece = newPiece;
            rand = Math.floor(random(7));
            if (rand === 0) {
                newPiece = new Piece(blue, 1);
            } else if (rand === 1) {
                newPiece = new Piece(cyan, 2);
            } else if (rand === 2) {
                newPiece = new Piece(green, 3);
            } else if (rand === 3) {
                newPiece = new Piece(orange, 4);
            } else if (rand === 4) {
                newPiece = new Piece(brown, 5);
            } else if (rand === 5) {
                newPiece = new Piece(pink, 6);
            } else if (rand === 6) {
                newPiece = new Piece(purple, 7);
            }
        }
    }
}

function checkFinishedRows() {
    for (let i = ROWS - 1; i >= 0; i--) {
        if (rowFinished(i)) {
            // Make above rows come down
            for (let r = i - 1; r >= 0; r--) {
                for (let c = 0; c < COLS; c++) {
                    grid[r + 1][c] = grid[r][c];
                }
            }
            score += 100;
            i++;
        }
    }
}

function rowFinished(i) {
    for (let c = 0; c < COLS; c++) {
        if (grid[i][c] === 0)
            return false;
    }
    return true;
}

function makePartOfGrid(piece) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (piece.cells[i][j] === 0)
                continue;

            grid[piece.down + i][j + piece.right - piece.left] = piece.color;
        }
    }
}

function Piece(cells, color) {
    this.cells = cells;
    this.down = 0;
    this.left = 0;
    this.right = 3;

    this.frozen = false;
    this.color = color;

    this.newShow = function() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.cells[i][j] === 0)
                    continue;

                stroke(0);
                if (this.color === 1) {
                    fill(0, 0, 255);
                } else if (this.color === 2) {
                    fill(0, 255, 255)
                } else if (this.color === 3) {
                    fill(0, 255, 0);
                } else if (this.color === 4) {
                    fill(255, 165, 0);
                } else if (this.color === 5) {
                    fill(165, 42, 42);
                } else if (this.color === 6) {
                    fill(255, 192, 203);
                } else if (this.color === 7) {
                    fill(128, 0, 128);
                }

                rect(350 + j * BLOCK_SIZE, 300 + i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }

    this.show = function () {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.cells[i][j] === 0)
                    continue;

                stroke(0);
                if (this.color === 1) {
                    fill(0, 0, 255);
                } else if (this.color === 2) {
                    fill(0, 255, 255)
                } else if (this.color === 3) {
                    fill(0, 255, 0);
                } else if (this.color === 4) {
                    fill(255, 165, 0);
                } else if (this.color === 5) {
                    fill(165, 42, 42);
                } else if (this.color === 6) {
                    fill(255, 192, 203);
                } else if (this.color === 7) {
                    fill(128, 0, 128);
                }

                rect((j + this.right - this.left) * BLOCK_SIZE, (i + this.down) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }

    this.update = function () {
        if (!this.frozen) {
            for (let r = 3; r >= 0; r--) {
                for (let c = 0; c < 4; c++) {
                    if (this.cells[r][c] === 0)
                        continue;

                    if (r + this.down + 1 >= ROWS || grid[r + this.down + 1][c + this.right - this.left] >= 1) {
                        this.frozen = true;
                        break;
                    }
                }
            }
            if (!this.frozen) {
                this.down++;
                score++;
            }
        }
    }

    this.top = function () {
        // Returns the topmost row of the piece
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.cells[i][j] === 1) {
                    return this.down + i;
                }
            }
        }
        return ROWS;
    }
}

function keyPressed() {
    if (piece.frozen)
        return;

    if (keyCode === LEFT_ARROW) {
        let flag = false;
        for (let r = 3; r >= 0; r--) {
            for (let c = 0; c < 4; c++) {
                if (piece.cells[r][c] === 0)
                    continue;

                if (c + piece.right - piece.left - 1 < 0 || grid[r + piece.down][c + piece.right - piece.left - 1] >= 1)
                    flag = true;
            }
        }
        if (!flag)
            piece.left++;
    } else if (keyCode === RIGHT_ARROW) {
        let flag = false;
        for (let r = 3; r >= 0; r--) {
            for (let c = 0; c < 4; c++) {
                if (piece.cells[r][c] === 0)
                    continue;

                if (c + piece.right - piece.left + 1 >= COLS || grid[r + piece.down][c + piece.right - piece.left + 1] >= 1)
                    flag = true;
            }
        }
        if (!flag)
            piece.right++;
    } else if (keyCode === DOWN_ARROW) {
        let flag = false;
        for (let r = 3; r >= 0; r--) {
            for (let c = 0; c < 4; c++) {
                if (piece.cells[r][c] === 0)
                    continue;

                if (r + piece.down + 1 >= ROWS || grid[r + piece.down + 1][c + piece.right - piece.left] >= 1)
                    flag = true;
            }
        }
        if (!flag) {
            piece.down++;
            score++;
        }
        else
            piece.frozen = true;
    } else if (keyCode === UP_ARROW) {
        let rotatedCells = rotateMatrix(piece.cells);
        if (isValidRotation(rotatedCells)) {
            piece.cells = rotatedCells;
        }
    }
}

function rotateMatrix(matrix) {
    let rows = matrix.length;
    let cols = matrix[0].length;
    let rotatedMatrix = [];

    for (let i = 0; i < cols; i++) {
        rotatedMatrix[i] = [];
        for (let j = rows - 1; j >= 0; j--) {
            rotatedMatrix[i].push(matrix[j][i]);
        }
    }

    return rotatedMatrix;
}

// Function to check if a rotation is valid
function isValidRotation(rotatedCells) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (rotatedCells[i][j] === 1) {
                let x = j + piece.right - piece.left;
                let y = i + piece.down;
                if (x < 0 || x >= COLS || y >= ROWS || grid[y][x] >= 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

function drawGrid() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let y = i * BLOCK_SIZE;
            let x = j * BLOCK_SIZE;
            stroke(0);
            if (grid[i][j] === 1) {
                fill(0, 0, 255);
            } else if (grid[i][j] === 2) {
                fill(0, 255, 255)
            } else if (grid[i][j] === 3) {
                fill(0, 255, 0);
            } else if (grid[i][j] === 4) {
                fill(255, 165, 0);
            } else if (grid[i][j] === 5) {
                fill(165, 42, 42);
            } else if (grid[i][j] === 6) {
                fill(255, 192, 203);
            } else if (grid[i][j] === 7) {
                fill(128, 0, 128);
            } else {
                noFill();
            }
            rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

function createEmptyGrid() {
    let arr = new Array(ROWS);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(COLS).fill(0);
    }
    return arr;
}
