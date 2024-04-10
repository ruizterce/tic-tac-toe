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

    const printBoard = () => {
        let string = "";
        for (let i = 0; i < rows; i++) {
            string += '\n';
            for (let j = 0; j < columns; j++) {
                string += board[i][j].getValue();
            }
        }
        console.log(string);
    }

    return { board, printBoard }

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
    let gameBoard = Gameboard();

    const players = [
        player1 = newPlayer('Player 1', 'X'),
        player2 = newPlayer('Player 2', 'O')
    ];

    let activePlayer = players[0];

    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const printNewRound = () => {
        gameBoard.printBoard();
        return console.log(`It's ${activePlayer.getName()}'s turn.`);

    }

    const playRound = (row, column) => {
        const token = activePlayer.getToken()

        gameBoard.board[row][column].addToken(token);

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
            console.log("Full board, it's a Tie!");
            game = Game();
        }
        //Check win conditions
        else if ((gameBoard.board[0][0].getValue() === token && gameBoard.board[0][1].getValue() === token && gameBoard.board[0][2].getValue() === token) ||
            (gameBoard.board[1][0].getValue() === token && gameBoard.board[1][1].getValue() === token && gameBoard.board[1][2].getValue() === token) ||
            (gameBoard.board[2][0].getValue() === token && gameBoard.board[2][1].getValue() === token && gameBoard.board[2][2].getValue() === token) ||
            (gameBoard.board[0][0].getValue() === token && gameBoard.board[1][0].getValue() === token && gameBoard.board[2][0].getValue() === token) ||
            (gameBoard.board[0][1].getValue() === token && gameBoard.board[1][1].getValue() === token && gameBoard.board[2][1].getValue() === token) ||
            (gameBoard.board[0][2].getValue() === token && gameBoard.board[1][2].getValue() === token && gameBoard.board[2][2].getValue() === token) ||
            (gameBoard.board[0][0].getValue() === token && gameBoard.board[1][1].getValue() === token && gameBoard.board[2][2].getValue() === token) ||
            (gameBoard.board[2][0].getValue() === token && gameBoard.board[1][1].getValue() === token && gameBoard.board[0][2].getValue() === token)) {
            console.log(`${activePlayer.getName()} wins!`)
            game = Game();
        } else {
            switchTurn();
            printNewRound();
        }

    }

    printNewRound();
    return { playRound };
}

let game = Game();

