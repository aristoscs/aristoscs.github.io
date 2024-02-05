let rows = 4;
let cols = 4;

let grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

let blockSize = 80;

function setup() {
    createCanvas(cols * blockSize, rows * blockSize);
    addRandomNumber();
    addRandomNumber();
}

function draw() {
    background(255);
    drawGrid();
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        let locations = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] !== 0)
                    locations.push({ i, j });
            }
        }
        slideUP(locations);
    }
    else if (keyCode === DOWN_ARROW) {
        let locations = [];
        for (let i = rows - 1; i >= 0; i--) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] !== 0)
                    locations.push({ i, j });
            }
        }
        slideDOWN(locations);
    }
    else if (keyCode === LEFT_ARROW) {
        let locations = [];
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (grid[j][i] !== 0)
                    locations.push({ j, i });
            }
        }
        slideLEFT(locations)
    }
    else if (keyCode === RIGHT_ARROW) {
        let locations = [];
        for (let i = cols - 1; i >= 0; i--) {
            for (let j = 0; j < rows; j++) {
                if (grid[j][i] !== 0)
                    locations.push({ j, i });
            }
        }
        slideRIGHT(locations);
    }

    addRandomNumber();
}

function slideRIGHT(locations) {
    for (let i = 0; i < locations.length; i++) {
        let x = locations[i].j;
        let y = locations[i].i;
        let num = grid[x][y];

        while (y + 1 < grid[x].length && grid[x][y + 1] === 0) {
            grid[x][y] = 0;
            grid[x][y + 1] = num;
            y++;
        }
        // Merge
        if (y + 1 < grid[x].length && grid[x][y + 1] === num) {
            grid[x][y] = 0;
            grid[x][y + 1] = num * 2;
        }
    }
}

function slideLEFT(locations) {
    for (let i = 0; i < locations.length; i++) {
        let x = locations[i].j;
        let y = locations[i].i;
        let num = grid[x][y];

        while (y - 1 >= 0 && grid[x][y - 1] === 0) {
            grid[x][y] = 0;
            grid[x][y - 1] = num;
            y--;
        }
        // Merge
        if (y - 1 >= 0 && grid[x][y - 1] === num) {
            grid[x][y] = 0;
            grid[x][y - 1] = num * 2;
        }
    }
}

function slideDOWN(locations) {
    for (let i = 0; i < locations.length; i++) {
        let x = locations[i].i;
        let y = locations[i].j;
        let num = grid[x][y];

        while (x + 1 < rows && grid[x + 1][y] === 0) {
            grid[x][y] = 0;
            grid[x + 1][y] = num;
            x++;
        }
        // Merge
        if (x + 1 < rows && grid[x + 1][y] === num) {
            grid[x][y] = 0;
            grid[x + 1][y] = num * 2;
        }
    }
}

function slideUP(locations) {
    for (let i = 0; i < locations.length; i++) {
        let x = locations[i].i;
        let y = locations[i].j;
        let num = grid[x][y];

        while (x - 1 >= 0 && grid[x - 1][y] === 0) {
            grid[x][y] = 0;
            grid[x - 1][y] = num;
            x--;
        }
        // Merge
        if (x - 1 >= 0 && grid[x - 1][y] === num) {
            grid[x][y] = 0;
            grid[x - 1][y] = num * 2;
        }
    }
}

function drawGrid() {
    textSize(20);
    textAlign(CENTER, CENTER);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let val = grid[i][j];
            let bgColor = getColor(val);
            fill(bgColor);
            rect(j * blockSize, i * blockSize, blockSize, blockSize);

            if (val !== 0) {
                fill(0);
                text(val, j * blockSize + blockSize / 2, i * blockSize + blockSize / 2);
            }
        }
    }
}

function getColor(value) {
    switch (value) {
        case 2: return color('#eee4da');
        case 4: return color('#ede0c8');
        case 8: return color('#f2b179');
        case 16: return color('#f59563');
        case 32: return color('#f67c5f');
        case 64: return color('#f65e3b');
        case 128: return color('#edcf72');
        case 256: return color('#edcc61');
        case 512: return color('#edc850');
        case 1024: return color('#edc53f');
        case 2048: return color('#edc22e');
        default: return color('#ffffff');
    }
}

function addRandomNumber() {
    let availableSpots = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 0) {
                availableSpots.push({ i, j });
            }
        }
    }

    if (availableSpots.length > 0) {
        let spot = random(availableSpots);
        let newValue = random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% chance for 4
        grid[spot.i][spot.j] = newValue;
    }
}
