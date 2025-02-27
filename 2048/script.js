const board = Array.from({ length: 4 }, () => Array(4).fill(0));
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('newGameButton').addEventListener('click', newGame);
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    newGame();
});

function newGame() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }
    score = 0;
    updateScore();
    generateNewNumber();
    generateNewNumber();
    updateBoard();
    document.getElementById('gameover').style.display = 'none';
}

function generateNewNumber() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }
    if (emptyCells.length === 0) return;
    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[x][y] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = board[i][j] || '';
            cell.style.backgroundColor = getBackgroundColor(board[i][j]);
            gridContainer.appendChild(cell);
        }
    }
}

function getBackgroundColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#ccc0b3';
    }
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp': moveUp(); break;
        case 'ArrowDown': moveDown(); break;
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
    }
    generateNewNumber();
    updateBoard();
    if (isGameOver()) {
        document.getElementById('gameover').style.display = 'block';
    }
}

let startX, startY;

function handleTouchStart(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    event.preventDefault();
    const endX = event.touches[0].clientX;
    const endY = event.touches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) moveRight();
        else moveLeft();
    } else {
        if (deltaY > 0) moveDown();
        else moveUp();
    }
    generateNewNumber();
    updateBoard();
    if (isGameOver()) {
        document.getElementById('gameover').style.display = 'block';
    }
}

function moveUp() {
    for (let j = 0; j < 4; j++) {
        let row = [];
        for (let i = 0; i < 4; i++) {
            row.push(board[i][j]);
        }
        row = compress(row);
        for (let i = 0; i < 4; i++) {
            board[i][j] = row[i];
        }
    }
}

function moveDown() {
    for (let j = 0; j < 4; j++) {
        let row = [];
        for (let i = 3; i >= 0; i--) {
            row.push(board[i][j]);
        }
        row = compress(row);
        for (let i = 3; i >= 0; i--) {
            board[i][j] = row[3 - i];
        }
    }
}

function moveLeft() {
    for (let i = 0; i < 4; i++) {
        board[i] = compress(board[i]);
    }
}

function moveRight() {
    for (let i = 0; i < 4; i++) {
        board[i] = compress(board[i].slice().reverse()).reverse();
    }
}

function compress(row) {
    let newRow = row.filter(val => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow[i + 1] = 0;
        }
    }
    newRow = newRow.filter(val => val !== 0);
    while (newRow.length < 4) newRow.push(0);
    updateScore();
    return newRow;
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
        }
    }
    return true;
}
