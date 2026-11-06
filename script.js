const boardElement = document.getElementById('board');

function createBoard(){
    for(let y = 0; y < 8; y++){
        for(let x = 0; x < 8; x++){
            const square = document.createElement('div');
            square.classList.add('square');
            if((x + y) % 2 === 0){
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            };
            square.dataset.x = x;
            square.dataset.y = y;
            boardElement.appendChild(square);
        };
    };
};

createBoard();