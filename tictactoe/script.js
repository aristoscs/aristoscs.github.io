let board;
let w; // width of each cell
let h; // height of each cell
let ai = 'X';
let human = 'O';
let currentPlayer;

function setup() {
  createCanvas(400, 400);
  w = width / 3;
  h = height / 3;
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  currentPlayer = human;
}

function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

function checkWinner() {
  let winner = null;

  // Horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

function mousePressed() {
  if (currentPlayer == human) {
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    if (board[i][j] == '') {
      board[i][j] = human;
      currentPlayer = ai;
      bestMove();
    }
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        board[i][j] = ai;
        let score = minimax(board, 0, false, -Infinity, Infinity);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  board[move.i][move.j] = ai;
  currentPlayer = human;
}

let scores = {
  X: 1,
  O: -1,
  tie: 0
};

function minimax(board, depth, isMaximizing, alpha, beta) {
  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false, alpha, beta);
          board[i][j] = '';
          bestScore = max(score, bestScore);
          alpha = max(alpha, score);
          if (beta <= alpha) {
            break; // Beta cutoff
          }
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true, alpha, beta);
          board[i][j] = '';
          bestScore = min(score, bestScore);
          beta = min(beta, score);
          if (beta <= alpha) {
            break; // Alpha cutoff
          }
        }
      }
    }
    return bestScore;
  }
}

function draw() {
  background(255);
  strokeWeight(4);

  // Drawing the grid
  line(w, 0, w, height);
  line(2 * w, 0, 2 * w, height);
  line(0, h, width, h);
  line(0, 2 * h, width, 2 * h);

  // Drawing the Xs and Os
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let spot = board[i][j];
      textSize(32);
      let r = w / 4;
      if (spot == human) {
        noFill();
        ellipse(x, y, r * 2);
      } else if (spot == ai) {
        line(x - r, y - r, x + r, y + r);
        line(x + r, y - r, x - r, y + r);
      }
    }
  }

  let result = checkWinner();
  if (result != null) {
    noLoop();
    let resultP = createP('');
    resultP.style('font-size', '32pt');
    if (result == 'tie') {
      resultP.html('Tie!');
    } else {
      resultP.html(`${result} wins!`);
    }
  }
}
