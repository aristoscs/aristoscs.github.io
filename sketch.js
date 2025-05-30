const GRID_CREATION = 0,
    BFS_MODE = 1,
    A_STAR_MODE = 2,
    STOPPED = 3;

let grid, rows = 18, cols = 18,
    squareSize = 33, strokeSize = 5,
    mode = GRID_CREATION,
    lastTick = 0,
    open, closed,
    start, dest;

function setup() {
    createCanvas((cols * squareSize) + strokeSize, (rows * squareSize) + strokeSize);
    background(255);
    reset();
    initGrid();
}

function draw() {
    mouseEvaluation();
    if (mode === BFS_MODE) {
        bfsTick();
    } else if (mode === A_STAR_MODE) {
        a_star_tick();
    }
    apply(node => node.update());
}

function randomise() {
    let obstacles = rows + cols;
    while (obstacles-- !== 0) {
        let i = floor(Math.random() * rows),
            j = floor(Math.random() * cols);
        if (grid[i][j].color.id === EMPTY) {
            grid[i][j].color.id = OBSTACLE;
        }
    }
}

function bfsTick() {
    if (open.isEmpty()) {
        mode = STOPPED;
        return;
    }
    let current = open.dequeue();
    if (closed[current.i * cols + current.j] === 1)
        return;

    if (current.color.id !== DESTINATION && current.color.id !== START)
        current.color.id = EXPANDED;

    if (current.color.id === DESTINATION) {
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

function a_star_tick() {
    if (open.isEmpty()) {
        mode = STOPPED;
        return;
    }
    let current = open.dequeue();
    if (closed[current.i * cols + current.j] === 1)
        return;

    if (current.color.id !== DESTINATION && current.color.id !== START)
        current.color.id = EXPANDED;

    if (current.color.id === DESTINATION) {
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

function a_star() {
    if (mode !== GRID_CREATION)
        return;
    if (!initLocations())
        return;

    mode = A_STAR_MODE;
    open = new PriorityQueue((n1, n2) => {
        let f1 = (n1.g + n1.h);
        let f2 = (n2.g + n2.h);
        if (f1 == f2)
                return n1.g - n2.g;
        return f1 - f2;
    });
    closed = [];
    grid[start.i][start.j].g = 0;
    initHeuristics();
    open.enqueue(grid[start.i][start.j]);
}

function initHeuristics() {
    apply(node => {
        let goal = grid[dest.i][dest.j];
    	node.h = Math.max(Math.abs(node.x - goal.x), Math.abs(node.y - goal.y));
    });
}

function bfs() {
    if (mode !== GRID_CREATION)
        return;
    if (!initLocations())
        return;
    mode = BFS_MODE;
    open = new Queue();
    closed = [];
    grid[start.i][start.j].g = 0;
    open.enqueue(grid[start.i][start.j]);
}

function initLocations() {
    apply(node => {
        if (node.color.id === START) {
            start.i = node.i;
            start.j = node.j;
        } else if (node.color.id === DESTINATION) {
            dest.i = node.i;
            dest.j = node.j;
        }
    });
    return !(start.i === undefined || dest.i === undefined);
}

function initPath(current) {
    while (current.parent !== undefined) {
        grid[current.i][current.j].color.id = PATH;
        current = current.parent;
    }
}

function reset() {
    mode = GRID_CREATION;
    lastTick = 0;
    initGrid();
    colorReset();
}

function mouseEvaluation() {
    if (mouseIsPressed && mouseOnCanvas()) {
        let i, j;
        i = floor(map(mouseY, 0, height, 0, rows));
        j = floor(map(mouseX, 0, width, 0, cols));
        grid[i][j].color.nextColor();
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
    if (mode === GRID_CREATION || mode === STOPPED) {
        let r = parseInt(form.rows.value);
        let c = parseInt(form.cols.value);
        if (r && c && (r !== rows || c !== cols)) {
            rows = r;
            cols = c;
            setup();
        }
    }
}

function initGrid() {
    grid = [];
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Node(j, i, squareSize, new Color(EMPTY), strokeSize);
        }
    }
    start = {i: undefined, j: undefined};
    dest = {i: undefined, j: undefined};
}
