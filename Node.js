function Node(x, y, squareSize, color, strokeSize) {

    this.i = y;
    this.j = x;
    this.squareSize = squareSize;
    this.x = (x * this.squareSize) + 1;
    this.y = (y * this.squareSize) + 1;
    this.color = color;
    this.strokeSize = strokeSize;
    this.g = Infinity;

    this.update = function () {
        stroke(this.strokeSize);
        fill(this.color.getColor());
        square(this.x, this.y, squareSize);
    };

    this.addChild = function (children, i, j) {
        if (i >= 0 && j >= 0 && i < rows && j < cols && grid[i][j].color.id !== OBSTACLE) {
            let child = grid[i][j];
            if (this.g + 1 < child.g) {
                children.push(child);
                child.parent = this;
                child.g = this.g + 1;
            }
        }
    };

    this.computeChildren = function () {
        let children = [];
        this.addChild(children, this.i - 1, this.j);// DOWN
        this.addChild(children, this.i, this.j + 1);// RIGHT
        this.addChild(children, this.i + 1, this.j);// UP
        this.addChild(children, this.i, this.j - 1);// LEFT
        return children;
    }
}
