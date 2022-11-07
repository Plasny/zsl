const size = 3;
const players = ['X', 'O'];
let player = players[0];
let gameBoard;

function createTab() {
    let tab = document.createElement("table");
    for (let y = 0; y < size; y++) {
        let row = document.createElement("tr");
        for (let x = 0; x < size; x++) {
            let cell = document.createElement("td");
            let ok = true;
            cell.setAttribute("id", `${x}:${y}`);
            cell.addEventListener("click", function () {
                if (ok) {
                    ok = false;

                    this.innerText = player;
                    gameBoard[y][x] = player;

                    let test = checkWin(gameBoard);
                    console.log(test);
                    if (test)
                        alert(test);

                    if (player == players[0]) {
                        player = players[1];
                        this.style.color = "red";
                    } else {
                        player = players[0];
                        this.style.color = "blue";
                    }
                }
            });
            row.append(cell);
        }
        tab.append(row);
    }
    document.getElementById("root").append(tab);
}

function createBoard() {
    let gameBoard = [];

    for (let i = 0; i < size; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < size; j++) {
            gameBoard[i][j] = 0;
        }
    }

    return gameBoard;
}

/**
 * only for size = 3, for now...
 * @return {0, 'X', 'O'} 0 if no win
 */
function checkWin() {
    for (let i = 0; i <= 1; i++) {
        for (let j = 0; j < size; j++) {
            if (gameBoard[j][0] == players[i] && gameBoard[j][1] == players[i] && gameBoard[j][2] == players[i])
                return players[i];

            if (gameBoard[0][j] == players[i] && gameBoard[1][j] == players[i] && gameBoard[2][j] == players[i])
                return players[i];
        }

        if (gameBoard[0][0] == players[i] && gameBoard[1][1] == players[i] && gameBoard[2][2] == players[i])
            return players[i];

        if (gameBoard[2][0] == players[i] && gameBoard[1][1] == players[i] && gameBoard[0][2] == players[i])
            return players[i];
    }

    return 0;
}

window.addEventListener("load", function () {
    gameBoard = createBoard();
    createTab();
});
