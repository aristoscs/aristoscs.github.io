this.Node = function (x, y, puzzle, parent, direction, g) {
    this.x = x;
    this.y = y;

    this.puzzle = puzzle.map(row => row.slice());

    this.parent = parent;
    this.direction = direction;

    this.g = g;
    this.h = 0;

    this.toString = function () {
        let string = "";
        for (let i = 0; i < this.puzzle.length; i++) {
            for (let j = 0; j < this.puzzle[i].length; j++) {
                string += this.puzzle[i][j]
            }
        }
        return string;
    }

    this.children = function () {
        let children = [];

        // UP
        if (x - 1 >= 0) {
            let node = new Node(x - 1, y, this.puzzle, this, 'U', this.g + 1);
            node.puzzle[this.x][this.y] = node.puzzle[this.x - 1][this.y];
            node.puzzle[this.x - 1][this.y] = 0;
            node.h = heuristic(node.puzzle);
            children.push(node);
        }

        // DOWN
        if (x + 1 < this.puzzle.length) {
            let node = new Node(x + 1, y, this.puzzle, this, 'D', this.g + 1);
            node.puzzle[this.x][this.y] = node.puzzle[this.x + 1][this.y];
            node.puzzle[this.x + 1][this.y] = 0;
            node.h = heuristic(node.puzzle);
            children.push(node);
        }

        if (y - 1 >= 0) {
            let node = new Node(x, y - 1, this.puzzle, this, 'L', this.g + 1);
            node.puzzle[this.x][this.y] = node.puzzle[this.x][this.y - 1];
            node.puzzle[this.x][this.y - 1] = 0;
            node.h = heuristic(node.puzzle);
            children.push(node);
        }

        // DOWN
        if (y + 1 < this.puzzle[x].length) {
            let node = new Node(x, y + 1, this.puzzle, this, 'R', this.g + 1);
            node.puzzle[this.x][this.y] = node.puzzle[this.x][this.y + 1];
            node.puzzle[this.x][this.y + 1] = 0;
            node.h = heuristic(node.puzzle);
            children.push(node);
        }

        return children;
    }
}

const SOLVED = 1;
let mode = 0;


let puzzle = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
]

let zero = { i: 2, j: 2 };

let solution = [];

function setup() {
    createCanvas(300, 300);
}

let count = 0;
function draw() {
    background(255);
    let tileSize = 100;

    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
            let x = j * tileSize;
            let y = i * tileSize;

            if (puzzle[i][j] !== 0) {
                fill(200, 200, 200);
                rect(x, y, tileSize, tileSize);
                fill(0);
                textSize(32);
                textAlign(CENTER, CENTER);
                text(puzzle[i][j], x + tileSize / 2, y + tileSize / 2);
            }
        }
    }

    if (mode === SOLVED && count < solution.length) {
        puzzle = solution[count++].puzzle;
    }
}

function mousePressed() {
    if (mouseOnCanvas()) {
        let i, j;
        i = floor(map(mouseY, 0, height, 0, 3));
        j = floor(map(mouseX, 0, width, 0, 3));

        if (isAdjacent(i, j, zero.i, zero.j)) {
            puzzle[zero.i][zero.j] = puzzle[i][j];
            puzzle[i][j] = 0;
            zero = { i, j };
        }
    }
}

function isAdjacent(row1, col1, row2, col2) {
    return (row1 === row2 && Math.abs(col1 - col2) === 1) || (col1 === col2 && Math.abs(row1 - row2) === 1);
}

function mouseOnCanvas() {
    return mouseX >= 0 && mouseY >= 0 && mouseX < width && mouseY < height;
}

function solvePuzzle() {
    if (mode === SOLVED)
        return;

    let open = new PriorityQueue((n1, n2) => {
        let fx = (n1.g + n1.h) - (n2.g + n2.h);
        return fx === 0 ? n2.g - n1.g : fx;
    }),
        closed = new Set();

    let node = new Node(zero.i, zero.j, puzzle, null, '\0', 0);
    node.h = heuristic(node.puzzle);

    open.enqueue(node);

    while (!open.isEmpty()) {
        let current = open.dequeue();
        if (current.h === 0) {
            while (current.parent) {
                solution.push(current);
                current = current.parent;
            }
            solution.reverse();
            mode = SOLVED;
            frameRate(2);
            return;
        }

        for (let child of current.children()) {
            if (!closed.has(child.toString()))
                open.enqueue(child);
        }
        closed.add(current.toString());
    }
    mode = SOLVED;
    return null;
}

function heuristic(puzzle) {
    let h = 0;
    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
            if (puzzle[i][j] === 0)
                continue;

            let num = puzzle[i][j];
            let x = floor((num - 1) / 3);
            let y = floor((num - 1) % 3);

            h += Math.abs(x - i) + Math.abs(y - j);
        }
    }
    return h;
}
