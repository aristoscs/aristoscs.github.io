const EMPTY = 0,
    OBSTACLE = 1,
    START = 2,
    DESTINATION = 3,
    EXPANDED = 4,
    PATH = 5,

    colors = [
        [255],// WHITE
        [0],// BLACK
        [0, 0, 255],// BLUE
        [255, 0, 0],// RED
        [255, 0, 255],// PURPLE
        [0, 255, 0]// GREEN
    ];

let haveStart = false,
    haveDest = false;

function colorReset() {
    haveStart = false;
    haveDest = false;
}

function Color(id) {

    this.id = id;

    this.nextColor = function () {
        if (this.id === 1) {// BLACK -> BLUE
            if (!haveStart) {
                this.id = START;
                haveStart = true;
            } else if (!haveDest) {
                this.id = DESTINATION;
                haveDest = true;
            } else {
                this.id = EMPTY;
            }
        } else if (this.id === 2) {// BLUE -> RED
            if (!haveDest) {
                this.id = DESTINATION;
                haveDest = true;
            } else {
                this.id = EMPTY;
            }
            haveStart = false;
        } else if (this.id === 3) {// RED -> WHITE
            this.id = EMPTY;
            haveDest = false;
        } else {
            this.id = OBSTACLE;
        }
    };

    this.getColor = function () {
        return colors[this.id];
    }
}
