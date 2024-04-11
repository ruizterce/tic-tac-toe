function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    return { board }

};

function Cell() {
    let value = '-';
    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function newPlayer(name, token) {
    const getName = () => name;
    const getToken = () => token;
    return { getName, getToken };

}

function Game() {
    const gameBoard = Gameboard();

    const players = [
        player1 = newPlayer('Player 1', 'X'),
        player2 = newPlayer('Player 2', 'O')
    ];

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    let roundResult;
    const getRoundResult = () => roundResult;

    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const playRound = (row, column) => {
        const token = activePlayer.getToken()
        //Check if the cell is already populated
        if (gameBoard.board[row][column].getValue() != '-') {
            roundResult = 'invalid';
        } else {


            //Add token to the cell
            gameBoard.board[row][column].addToken(token);

            //Check for win conditions
            if ((gameBoard.board[0][0].getValue() === token && gameBoard.board[0][1].getValue() === token && gameBoard.board[0][2].getValue() === token) ||
                (gameBoard.board[1][0].getValue() === token && gameBoard.board[1][1].getValue() === token && gameBoard.board[1][2].getValue() === token) ||
                (gameBoard.board[2][0].getValue() === token && gameBoard.board[2][1].getValue() === token && gameBoard.board[2][2].getValue() === token) ||
                (gameBoard.board[0][0].getValue() === token && gameBoard.board[1][0].getValue() === token && gameBoard.board[2][0].getValue() === token) ||
                (gameBoard.board[0][1].getValue() === token && gameBoard.board[1][1].getValue() === token && gameBoard.board[2][1].getValue() === token) ||
                (gameBoard.board[0][2].getValue() === token && gameBoard.board[1][2].getValue() === token && gameBoard.board[2][2].getValue() === token) ||
                (gameBoard.board[0][0].getValue() === token && gameBoard.board[1][1].getValue() === token && gameBoard.board[2][2].getValue() === token) ||
                (gameBoard.board[2][0].getValue() === token && gameBoard.board[1][1].getValue() === token && gameBoard.board[0][2].getValue() === token)) {
                roundResult = 'win';
            } else {

                //Check for full board
                let fullBoard = true;
                for (let i = 0; i < gameBoard.board.length; i++) {
                    for (let j = 0; j < gameBoard.board[i].length; j++) {
                        if (gameBoard.board[i][j].getValue() === '-') {
                            fullBoard = false;
                            break;
                        }
                    }
                }

                if (fullBoard) {
                    roundResult = 'tie';
                }
                //Prepare for next round
                else {
                    roundResult = 'valid';
                    switchTurn();
                }
            }
        }
    }

    return {
        playRound,
        getActivePlayer,
        getRoundResult,
        gameBoard
    };
}



function ScreenController() {
    const startBtn = document.querySelector('#start-btn');


    startBtn.addEventListener('click', () => {
        startGame();
        startBtn.textContent = 'Restart!'
    })

    const turnDiv = document.querySelector('#turn');
    const boardDiv = document.querySelector('#board');
    let cellsDisabled = true;

    let game
    startGame = () => {
        game = Game();

        const updateScreen = () => {
            const gameBoard = game.gameBoard;

            turnDiv.textContent = `${game.getActivePlayer().getName()}'s turn.`;

            boardDiv.innerHTML = '';

            for (i = 0; i < gameBoard.board.length; i++) {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'row';
                boardDiv.appendChild(rowDiv);

                for (j = 0; j < gameBoard.board[i].length; j++) {
                    const cellButton = document.createElement('button');
                    cellButton.className = 'cell';
                    cellButton.textContent = gameBoard.board[i][j].getValue();
                    cellButton.dataset.row = i;
                    cellButton.dataset.column = j;
                    rowDiv.appendChild(cellButton);
                }
            }

        }

        const clickCell = function (e) {
            if (e.target.className === 'cell') {
                game.playRound(e.target.dataset.row, e.target.dataset.column);
                updateScreen();

                if (game.getRoundResult() === 'win') {
                    turnDiv.textContent = `${game.getActivePlayer().getName()} wins!`

                    boardDiv.removeEventListener('click', clickCell);
                    cellsDisabled = true
                } else if (game.getRoundResult() === 'tie') {
                    turnDiv.textContent = "Full Board! It's a tie!"

                    boardDiv.removeEventListener('click', clickCell);
                    cellsDisabled = true
                } else if (game.getRoundResult() === 'invalid') {
                    turnDiv.textContent = `Invalid move! ${game.getActivePlayer().getName()}'s turn.`;
                }
            }
        };

        if (cellsDisabled) {
            boardDiv.addEventListener('click', clickCell);
            cellsDisabled = false;
        }
        updateScreen();
    }
}
ScreenController();