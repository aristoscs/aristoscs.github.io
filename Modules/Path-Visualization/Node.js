const WHITE = 0,
    BLACK = 1,
    BLUE = 2,
    RED = 3,
    PURPLE = 4,
    GREEN = 5,

    colors = [
        [255],
        [0],
        [0, 0, 255],
        [255, 0, 0],
        [255, 0, 255],
        [0, 255, 0]
    ];

function Node(i, j, squareSize, strokeSize) {

    // Grid location
    this.i = i;
    this.j = j;

    this.strokeSize = strokeSize;
    this.squareSize = squareSize;

    // Coordinates on the plane
    this.x = (j * this.squareSize) + 1;
    this.y = (i * this.squareSize) + 1;

    // Searching variables
    this.g = Infinity;
    this.h = 0;

    // Color
    this.color = 0;
    this.lastDate = 0;

    this.update = function () {
        stroke(this.strokeSize);
        fill(colors[this.color]);
        square(this.x, this.y, squareSize);
    };

    this.addChild = function (children, i, j) {
        if (i >= 0 && j >= 0 && i < rows && j < cols && grid[i][j].color !== BLACK) {
            let child = grid[i][j];
            if (this.g + 1 < child.g) {
                child.parent = this;
                child.g = this.g + 1;
                children.push(child);
            }
            return true;
        }
        return false;
    };

    this.computeChildren = function () {
        let children = [],
            up = this.addChild(children, this.i - 1, this.j),
            down = this.addChild(children, this.i + 1, this.j),
            left = this.addChild(children, this.i, this.j - 1),
            right = this.addChild(children, this.i, this.j + 1);

        if (up && right)
            this.addChild(children, this.i - 1, this.j + 1);
        if (up && left)
            this.addChild(children, this.i - 1, this.j - 1);
        if (down && right)
            this.addChild(children, this.i + 1, this.j + 1);
        if (down && left)
            this.addChild(children, this.i + 1, this.j - 1);
        return children;
    };

    this.nextColor = function () {
        if (Date.now() - this.lastDate < 200) {
            return;
        }
        this.lastDate = Date.now();

        if (this.color === BLACK) {// BLACK -> BLUE
            if (start.i === -1) {
                this.color = BLUE;
                start = {i: this.i, j: this.j};
            } else if (dest.i === -1) {
                this.color = RED;
                dest = {i: this.i, j: this.j};
            } else {
                this.color = WHITE;
            }
        } else if (this.color === BLUE) {// BLUE -> RED
            if (dest.i === -1) {
                this.color = RED;
                dest = {i: this.i, j: this.j};
            } else {
                this.color = WHITE;
            }
            start.i = -1;
        } else if (this.color === RED) {// RED -> WHITE
            this.color = WHITE;
            dest.i = -1;
        } else {
            this.color = BLACK;
        }
    }
}
