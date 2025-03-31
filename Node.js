/**
 * @param x coordinate on the canvas
 * @param y coordinate on the canvas
 * @param squareSize of the Node
 * @param color displayed by the Node
 * @param strokeSize, thickness of Node square
 * @constructor
 */
function Node(x, y, squareSize, color, strokeSize) {

    this.i = y;
    this.j = x;
    this.squareSize = squareSize;
    this.x = (x * this.squareSize) + 1;
    this.y = (y * this.squareSize) + 1;
    this.color = color;
    this.strokeSize = strokeSize;
    this.g = Infinity;
    this.h = 0;

    this.update = function () {
        stroke(this.strokeSize);
        fill(this.color.getColor());
        square(this.x, this.y, squareSize);
    };

    this.addChild = function (children, i, j, increment) {
        if (i >= 0 && j >= 0 && i < rows && j < cols && grid[i][j].color.id !== OBSTACLE) {
            let child = grid[i][j];
            if (this.g + increment < child.g) {
                child.parent = this;
                child.g = this.g + increment;
                children.push(child);
            }
            return true;
        }
        return false;
    };

    this.computeChildren = function () {
        let children = [],
            up = this.addChild(children, this.i - 1, this.j, 1),
            down = this.addChild(children, this.i + 1, this.j, 1),
            left = this.addChild(children, this.i, this.j - 1, 1),
            right = this.addChild(children, this.i, this.j + 1, 1);

        if (up && right)
            this.addChild(children, this.i - 1, this.j + 1, 1);
        if (up && left)
            this.addChild(children, this.i - 1, this.j - 1, 1);
        if (down && right)
            this.addChild(children, this.i + 1, this.j + 1, 1);
        if (down && left)
            this.addChild(children, this.i + 1, this.j - 1, 1);

        return children;
    }
}
