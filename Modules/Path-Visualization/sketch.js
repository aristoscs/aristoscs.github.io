// Sketch modes for draw()
const GRID_CREATION = 0,
    SEARCHING = 1,
    STOPPED = 2;

// Sketch variables
let grid, rows = 18, cols = 18,
    squareSize = 33, strokeSize = 5,
    mode = GRID_CREATION,
    open, closed,
    start, dest;

/**
 * Called at the start of the sketch.
 */
function setup() {
    createCanvas((cols * squareSize) + strokeSize, (rows * squareSize) + strokeSize);
    background(255);
    reset();
}

function draw() {
    mouseEvaluation();
    if (mode === SEARCHING) {
        tick();
    }
    apply(node => node.update());
}

/**
 * Puts a few random obstacles on the grid.
 */
function randomise() {
    apply(node => {
        if (node.color === WHITE && Math.random() < 0.2)
            node.color = BLACK;
    });
}

function tick() {
    if (open.isEmpty()) {
        mode = STOPPED;
        return;
    }
    let current = open.dequeue();
    if (closed[current.i * cols + current.j] === 1)
        return;

    if (current.color !== BLUE && current.color !== RED)
        current.color = PURPLE;

    if (current.color === RED) {
        mode = STOPPED;
        initPath(current.parent);
        return;
    }

    for (let child of current.computeChildren()) {
        if (closed[child.i * cols + child.j] === undefined)
            open.enqueue(child);
    }
    closed[current.i * cols + current.j] = 1;
}

function setupSearch(queueType) {
    if (mode !== GRID_CREATION || start.x === -1 || dest.x === -1) {
        return;
    }
    mode = SEARCHING;
    open = queueType;
    closed = [];

    apply(node => {
        let goal = grid[dest.i][dest.j];
        node.h = Math.sqrt(Math.pow(node.x - goal.x, 2) + Math.pow(node.y - goal.y, 2));
    });
    grid[start.i][start.j].g = 0;
    open.enqueue(grid[start.i][start.j]);
}

function initPath(current) {
    while (current.parent !== undefined) {
        grid[current.i][current.j].color = GREEN;
        current = current.parent;
    }
}

function reset() {
    mode = GRID_CREATION;
    grid = [];
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Node(i, j, squareSize, strokeSize);
        }
    }
    start = {i: -1, j: -1};
    dest = {i: -1, j: -1};
}

function mouseEvaluation() {
    if (mouseIsPressed && mouseOnCanvas()) {
        let i = floor(map(mouseY, 0, height, 0, rows)),
            j = floor(map(mouseX, 0, width, 0, cols));
        grid[i][j].nextColor();
    }
}

function mouseOnCanvas() {
    return mouseX >= 0 && mouseY >= 0 && mouseX < width && mouseY < height;
}

function apply(f) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            f(grid[i][j]);
        }
    }
}

function changeRows(form) {
    if (mode !== SEARCHING) {
        let r = parseInt(form.rows.value);
        let c = parseInt(form.cols.value);
        if (r && c && (r !== rows || c !== cols)) {
            rows = r;
            cols = c;
            setup();
        }
    }
}
