// ---------- Form functions ----------

const formFields = ["Height", "Width", "Mines", "submit"];

/**
 * Creates form with 3 text inputs and a submit button
 */
function createForm() {
    let form = document.createElement("form");
    form.classList.add("minesForm");

    for (i in formFields) {
        let div = document.createElement("div");
        let input = document.createElement("input");
        input.setAttribute("name", formFields[i]);

        if (formFields[i] != "submit") {
            let inputLabel = document.createElement("label");
            inputLabel.innerText = formFields[i] + ": ";
            div.appendChild(inputLabel);
            input.style.width = "35px";
        } else {
            input.type = "button"
            input.value = "GENERUJ"
        }

        div.appendChild(input);
        form.appendChild(div);
    }

    container.appendChild(form);
}

/**
 * Clears form input values which don't contain numbers
 */
function checkForm() {
    for (let i = 0; i < formFields.length-1; i++) {
        let value = document.getElementsByName(formFields[i])[0].value;
        // console.log(Number.isFinite(value));
        if (!Number(value)) 
            document.getElementsByName(formFields[i])[0].value = "";
    }
}



// ---------- Game functions ----------

/**
 * Variable which tells if game is running. If false then game hasn't began or has ended.
 * @type {Boolean}
 */
var run;

/**
 * Variable which stores how many seconds the game lasts.
 * @type {Number} (seconds)
 */
var time;

/** 
 * Table/Gameboard height.
 * @type {Number} 
 */
var height;

/**
 * Table/Gameboard width.
 * @type {Number}
 */
var width;

/**
 * Amount of mines in the game.
 * @type {Number}
 */
var mines;

/**
 * Amount of flags placed.
 * @type {Number}
 */
var flags;

/** 
 * Variable which stores id of setInterval method. Needed for timer clearing.
 * @type {Number} (setInterval Id)
 */
var timerInterval;

/**
 * Table of displayed objects. Available variables in table: 
 * 0 - covered tile, U - uncovered tile, [1-8] - uncovered tyile with number of mines attach to it, F - flagged tile, ? - Question mark on tile
 * @type {Array[]}
 */
var displayBoard;

/**
 * Generates board full of zeros.
 * @param {Number} height - table height
 * @param {Number} width  - table width
 * @returns {Number[][]} - table of size width*height full of zeros
 */
function boardGen(height, width) {
    let board = [];
    let content = 0;

    for (let i = 0; i < height; i++) {
        board[i] = [];
        for (let j = 0; j < width; j++)
            board[i][j] = content;
    }

    return board;
}

/**
 * Creates board with location of mines and adds numbers to cells next to a bombs
 * @returns {Array[]} - array with X (mines)
 */
function minesBoard() {
    let board = boardGen(height, width);

    let i = 0;
    while(i < mines) {
        let x = parseInt(Math.random() * width);
        let y = parseInt(Math.random() * height);
        // console.log(`x:${x} y:${y}`)
        if (board[y][x] != "X") {
            board[y][x] = "X";
            i++;

            /* How tile uncovering works:
                --> --> -->
                --> "X" -->
                --> --> --> 
            */
            for(let j = -1; j <= 1; j++) {
                // check if it's not out of range
                if ((y+j < 0) || (y+j >= height))
                    continue;
                for (let k = -1; k <= 1; k++) {
                    // console.log(`${i}: x:${x} k:${k} y:${y} j:${j}`);
                    if ((x+k < 0) || (x+k >= width))
                        continue;
                    if (board[y+j][x+k] == "X")
                        continue;
                
                        board[y+j][x+k] += 1;
                }
            }
        }
    }
    // console.log("--- MINES ---")
    console.table(board);

    return board;
}

/**
 * Check if mine is in the clicked cell
 * @param {String} id - coordinates of checked element
 * @param {Array[]} mines - board to which coordinates are compared
 */
function cellCheck(id, mines) {
    if (run) {
        let item = document.getElementById(id);
        item.classList.remove("button");
    
        let coo = id.split(":");
        console.log(`check -> x:${coo[0]} y:${coo[1]}`)
        if(mines[coo[1]][coo[0]] == "X") {
            item.innerHTML = "";
            let bomb = document.createElement("img");
            bomb.src = "img/bomb.png"
            item.appendChild(bomb);
            return true;
            // console.log("mine")
        } else {
            uncover(parseInt(coo[1]), parseInt(coo[0]), mines);
            console.table(displayBoard);
        }
    }
}

/**
 * Uncover attached cells
 * @param {Number} y - y coordinate of the cell
 * @param {Number} x - x coordinate of the cell
 * @param {Array[]} board -
 */
function uncover(y, x, board) {
    if(displayBoard[y][x] == "F") {
        document.getElementById(`${y}:${x}`).innerHTML = "";
        flags++;
    }

    if(board[y][x] != 0) 
        displayBoard[y][x] = board[y][x];
    else
        displayBoard[y][x] = "U";

    for(let j = -1; j <= 1; j++) {
        // check if it's not out of range
        if ((y+j < 0) || (y+j >= height))
            continue;
        for (let k = -1; k <= 1; k++) {
            let id = `${x+k}:${y+j}`
            if ((x+k < 0) || (x+k >= width))
                continue;
            if (displayBoard[y+j][x+k] == "U")
                continue;
            if (board[y+j][x+k] == "X")
                continue;
            if (board[y+j][x+k] == 0) {
                uncover(y+j, x+k, board);
                document.getElementById(id).classList.remove("button");
            } else {
                let item = document.getElementById(id);
                item.classList.remove("button");
                item.innerHTML = board[y+j][x+k];
                displayBoard[y+j][x+k] = board[y+j][x+k];
            }
        }
    }

}
/**
 * Function that returns coordinates of given id
 * @param {String} id 
 * @returns {[Number, Number]} - [0] = x, [1] = y
 */
function idToCoordinates(id) {
    let coordinates = id.split(":");
    return coordinates;
}

/**
 * Puts flag, question mark on the cell or resets it
 * @param {string} id - cell coordinates
 */
function cellFlag(id) {
    if (run) {
        let cell = document.getElementById(id);
        let coo = idToCoordinates(id);

        if (cell.classList.length) {
            if(displayBoard[coo[1]][coo[0]] == "0" && flags > 0) {
                displayBoard[coo[1]][coo[0]] = "F";
        
                let flag = document.createElement("img");
                flag.src = "img/flaga.png";
                cell.appendChild(flag);
                flags--;
            } else if(displayBoard[coo[1]][coo[0]] == "F" ) {
                displayBoard[coo[1]][coo[0]] = "?";
                cell.innerHTML = "";
                flags++;

                let question = document.createElement("img");
                question.src = "img/pyt.png";
                cell.appendChild(question);
            } else {
                displayBoard[coo[1]][coo[0]] = 0;
                cell.innerHTML = "";
            }
            // console.table(displayBoard)
        }

    }
}

/**
 * Checks if you flag all the bombs and if so you win
 * @param {Array[]} board - board with location of mines
 * @param {Number} mines - number of mines in the game
 */
function checkIfWin(board, mines) {
    if(run) {
        let correct = 0;

        for (let i = 0; i < height; i++)
            for (let j = 0; j < width; j++)
                if (displayBoard[i][j] == "F" && board[i][j] == "X")
                    correct++;

        if (correct == mines) {
            console.log("WIN");
            document.getElementById("flagsAmount").innerText = "Wygrałeś :D";
            run = false;
            alert("Wygrałeś :D")
        }
    }
}

/**
 * check if the bomb is under the tile you clicked -> EXPLODE!
 * @param {String} explosion - cell coordinates (cellId)
 * @param {Array[]} mines - table with location of mines
 */
function gameOver(explosion, mines) {
    run = false;

    for (let i = 0; i < height; i++)
        for (let j = 0; j < width; j++) {
            let cell = `${j}:${i}`
            if(mines[i][j] == "X" && cell != explosion) {
                let item = document.getElementById(cell);
                item.classList.remove("button");
                item.innerHTML = "";
                let bomb = document.createElement("img");
                bomb.src = "img/pbomb.png"
                item.appendChild(bomb);
            }
        }

    alert("Przegrałeś");
}

/**
 * Create board, button, etc. and display it
 * @param {Array[]} displayBoard 
 * @param {Array[]} board 
 */
function gameBoard(displayBoard, board) {
    let div = document.createElement("div");
    div.classList.add("saper");

    let time = document.createElement("div");
    time.setAttribute("id", "timer");
    div.appendChild(time);

    let flagsAmount = document.createElement("div");
    flagsAmount.setAttribute("id", "flagsAmount");
    flagsAmount.innerText = `Pozostało flag: ${mines}`
    div.appendChild(flagsAmount);

    let table = document.createElement("table");
    table.setAttribute("border", "1");

    for (let i = 0; i < height; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < width; j++) {
            let cell = document.createElement("td");
            let cellId = `${j}:${i}`; // x:y coordinates
            cell.setAttribute("id", cellId);
            cell.classList.add("button");
            cell.onclick = function () {
                if (cellCheck(cellId, board))
                    gameOver(cellId, board);
            }
            cell.oncontextmenu = function (event) {
                event.preventDefault();
                cellFlag(cellId, displayBoard);
                document.getElementById("flagsAmount").innerText = `Pozostało flag: ${flags}`;
                checkIfWin(board, mines);
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    div.appendChild(table)
    container.appendChild(div);
}

/**
 * Displays how log you already play the game
 */
function timer () {
    if (run) {
        time++;
        document.getElementById("timer").innerText = `Grasz: ${time}[s]`;
    }
}