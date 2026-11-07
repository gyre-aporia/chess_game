const boardElement = document.getElementById('board');

const initialBoard = [
    ['♟', '♟', '♟', '♛', '♚', '♟', '♟', '♟'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♙', '♙', '♙', '♕', '♔', '♙', '♙', '♙']
];

let selecty = null;
let selectx = null;
let currentTurn = 'white';

/**
 * AI Generated
 * Model: Gemini
 */
function getPieceColor(piece) {
    if (['♙', '♕', '♔'].includes(piece)) return 'white';
    if (['♟', '♛', '♚'].includes(piece)) return 'black';
    return null;
}

/**
 * AI Generated
 * Model: Gemini
 */
function isFacingEnemy(y, x, piece) {
    if (piece === '♙' && y > 0 && initialBoard[y - 1][x] === '♟') return true;
    if (piece === '♟' && y < 7 && initialBoard[y + 1][x] === '♙') return true;
    return false;
}

/**
 * AI Generated
 * Model: Gemini
 */
function isEndBoardKamikaze(y, piece) {
    return (piece === '♙' && y === 0) || (piece === '♟' && y === 7);
}

/**
 * AI Generated
 * Model: Gemini
 */
function isPathClear(startY, startX, endY, endX) {
    const stepY = Math.sign(endY - startY);
    const stepX = Math.sign(endX - startX);
    let currentY = startY + stepY;
    let currentX = startX + stepX;

    while (currentY !== endY || currentX !== endX) {
        if (initialBoard[currentY][currentX] !== '') return false;
        currentY += stepY;
        currentX += stepX;
    }
    return true;
}

/**
 * AI Generated
 * Model: Gemini
 */
function isValidMove(piece, startY, startX, endY, endX) {
    const dy = Math.abs(endY - startY);
    const dx = Math.abs(endX - startX);

    if (piece === '♔' || piece === '♚') return dy <= 1 && dx <= 1;

    if (piece === '♙' || piece === '♟') {
        const direction = (piece === '♙') ? -1 : 1;
        const isWhiteStart = (piece === '♙' && (startY === 6 || startY === 7));
        const isBlackStart = (piece === '♟' && (startY === 1 || startY === 0));

        if (dx === 0 && (endY - startY) === direction) {
            if (initialBoard[endY][endX] === '') return true;
        }

        if (dx === 0 && (isWhiteStart || isBlackStart) && (endY - startY) === direction * 2) {
            const middleY = startY + direction;
            if (initialBoard[middleY][startX] === '' && initialBoard[endY][endX] === '') return true;
        }

        if (dx === 1 && (endY - startY) === direction) {
            if (initialBoard[endY][endX] !== '') return true;
        }
        return false;
    }

    if (piece === '♕' || piece === '♛') {
        if (dx === 0 || dy === 0 || dx === dy) return isPathClear(startY, startX, endY, endX);
    }
    return false;
}

/**
 * AI Generated
 * Model: Gemini
 */
function handleSquareClick(y, x) {
    if (selecty === y && selectx === x) {
        selecty = null;
        selectx = null;
        createBoard();
        return;
    }

    if (selecty !== null && selectx !== null) {
        const selectedPiece = initialBoard[selecty][selectx];
        const targetPiece = initialBoard[y][x];

        if (targetPiece !== '' && getPieceColor(selectedPiece) === getPieceColor(targetPiece)) {
            selecty = y;
            selectx = x;
            createBoard();
            return;
        }

        const isSelectedPawn = (selectedPiece === '♙' || selectedPiece === '♟');
        const isTargetEnemyPawn = (targetPiece === '♙' || targetPiece === '♟') && (getPieceColor(targetPiece) !== getPieceColor(selectedPiece));

        if (isSelectedPawn && isEndBoardKamikaze(selecty, selectedPiece)) {
            if (isTargetEnemyPawn) {
                initialBoard[y][x] = '';
                initialBoard[selecty][selectx] = '';
                selecty = null;
                selectx = null;
                currentTurn = (currentTurn === 'white') ? 'black' : 'white';
                createBoard();
            } else {
                alert('Tento pěšec na konci desky může zničit pouze nepřátelského pěšce!');
            }
            return;
        }

        if (isSelectedPawn && isFacingEnemy(selecty, selectx, selectedPiece)) {
            const direction = (selectedPiece === '♙') ? -1 : 1;
            if (y === selecty + direction && x === selectx && targetPiece !== '') {
                initialBoard[y][x] = '';
                initialBoard[selecty][selectx] = '';
                selecty = null;
                selectx = null;
                currentTurn = (currentTurn === 'white') ? 'black' : 'white';
                createBoard();
                return;
            }
        }

        if (!isValidMove(selectedPiece, selecty, selectx, y, x)) return;

        initialBoard[y][x] = selectedPiece;
        initialBoard[selecty][selectx] = '';
        selectx = null;
        selecty = null;

        if (targetPiece === '♔' || targetPiece === '♚') {
            setTimeout(() => {
                alert('Hra skončila! Král padl.');
                location.reload();
            }, 100);
            createBoard();
            return;
        }

        currentTurn = (currentTurn === 'white') ? 'black' : 'white';
        createBoard();

    } else {
        const piece = initialBoard[y][x];
        if (piece !== '' && getPieceColor(piece) === currentTurn) {
            selecty = y;
            selectx = x;
            createBoard();
        }
    }
}

/* AI Used, Model: Gemini (optimalizace a barvy figur) */
function createBoard() {
    boardElement.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const square = document.createElement('div');

            square.className = `square ${(x + y) % 2 === 0 ? 'light' : 'dark'}`;

            const piece = initialBoard[y][x];
            if (piece !== '') {
                square.textContent = piece;
                square.dataset.pieceColor = getPieceColor(piece);

                if (isFacingEnemy(y, x, piece) || isEndBoardKamikaze(y, piece)) {
                    square.classList.add('kamikaze-glow');
                }
            }

            if (y === selecty && x === selectx) {
                square.classList.add('selected');
            }

            square.dataset.x = x;
            square.dataset.y = y;

            square.addEventListener('click', () => handleSquareClick(y, x));
            fragment.appendChild(square);
        }
    }
    boardElement.appendChild(fragment);
}

createBoard();