//Gameboard factory
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

//Cell factory
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

//Player factory
function newPlayer(name, token) {
    let playerName = name;
    const getName = () => playerName;
    const getToken = () => token;
    const setName = (string) => {
        playerName = string
    }
    return { getName, getToken, setName };

}


//Game factory
function Game(player1Name, player2Name) {
    const gameBoard = Gameboard();
    const players = [
        newPlayer(player1Name, 'X'),
        newPlayer(player2Name, 'O')
    ];

    const getPlayers = () => players;

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
        getPlayers,
        getActivePlayer,
        getRoundResult,
        gameBoard
    };
}


//Main controller function
function ScreenController() {
    const startBtn = document.querySelector('#start-btn');

    //Store player name for new Game() instances
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';

    startBtn.addEventListener('click', () => {
        startGame();
        startBtn.textContent = 'Restart!'
    })

    const playerOneDiv = document.querySelector('#player-one');
    const playerTwoDiv = document.querySelector('#player-two');
    const turnDiv = document.querySelector('#turn');
    const boardDiv = document.querySelector('#board');
    let cellsDisabled = true;

    playerOneDiv.addEventListener('click', () => {
        let name
        do {
            name = prompt('Player 1 name? (1-8 char)', 'Player 1');
        } while (name.length < 1 || name.length > 8);
        game.getPlayers()[0].setName(name); //Update player name in current Game();
        playerOneDiv.innerHTML = '<p>' + game.getPlayers()[0].getName() + '</p><p>' + game.getPlayers()[0].getToken() + '</p>'//Update player name on screen
        player1Name = name; //Store player name for next calls of Game();
    });

    playerTwoDiv.addEventListener('click', () => {
        let name
        do {
            name = prompt('Player 2 name? (1-8 char)', 'Player 2');
        } while (name.length < 1 || name.length > 8);
        game.getPlayers()[1].setName(name); //Update player name in current Game();
        playerTwoDiv.innerHTML = '<p>' + game.getPlayers()[1].getName() + '</p><p>' + game.getPlayers()[1].getToken() + '</p>' //Update player name on screen
        player2Name = name; //Store player name for next calls of Game();
    });

    let game
    startGame = () => {
        game = Game(player1Name, player2Name); //Create new game

        const updateScreen = () => {
            const gameBoard = game.gameBoard;

            //Show player and turn info
            playerOneDiv.innerHTML = '<p>' + game.getPlayers()[0].getName() + '</p><p>' + game.getPlayers()[0].getToken() + '</p>'
            playerTwoDiv.innerHTML = '<p>' + game.getPlayers()[1].getName() + '</p><p>' + game.getPlayers()[1].getToken() + '</p>'
            turnDiv.textContent = `${game.getActivePlayer().getName()}'s turn.`;

            boardDiv.innerHTML = ''; //Clear board div

            //Update board Div
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