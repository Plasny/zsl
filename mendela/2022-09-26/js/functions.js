// ---------- Form functions ----------

const formFields = ["Height", "Width", "Mines", "submit"];

/**
 * Creates form
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

var run;
var displayBoard;
var time;
var timerInterval;
var mines_left;

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
 * @param {Number} height - table height
 * @param {Number} width  - table width
 * @param {Number} mines  - number of mines
 * @returns {Array[]} - array with X (mines)
 */
function minesBoard(height, width, mines) {
    let board = boardGen(height, width);

    for (let i = 0; i < mines; i++){
        let x = parseInt(Math.random() * width);
        let y = parseInt(Math.random() * height);
        // console.log(`x:${x} y:${y}`)
        if (board[y][x] != "X")
            board[y][x] = "X";
        else 
            i--;

        /*
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
    // console.log("--- MINES ---")
    // console.table(board);

    return board;
}

/**
 * Check if mine is in the clicked cell
 * @param {String} id - coordinates of checked element
 * @param {Array[]} mines - board to which coordinates are compared
 */
function cellCheck(id, height, width, mines) {
    if (run) {
        let item = document.getElementById(id)
        item.classList.remove("button");
    
        let coo = id.split(":");
        console.log(`check -> x:${coo[0]} y:${coo[1]}`)
        if(mines[coo[1]][coo[0]] == "X") {
            let bomb = document.createElement("img");
            bomb.src = "img/bomb.png"
            item.appendChild(bomb);
            return true;
            // console.log("mine")
        } else {
            uncover(parseInt(coo[1]), parseInt(coo[0]), height, width, mines);
            console.table(displayBoard);
        }
    }
}

/**
 * Uncover attached cells
 */
function uncover(y, x, height, width, board) {
    displayBoard[y][x] = "U";

    for(let j = -1; j <= 1; j++) {
        // check if it's not out of range
        if ((y+j < 0) || (y+j >= height))
            continue;
        for (let k = -1; k <= 1; k++) {
            if ((x+k < 0) || (x+k >= width))
                continue;
            if (displayBoard[y+j][x+k] == "U")
                continue;
            if (board[y+j][x+k] == "X")
                continue;
            if (board[y+j][x+k] == 0) {
                let id = `${x+k}:${y+j}`
                uncover(y+j, x+k, height, width, board);
                document.getElementById(id).classList.remove("button");
            } else {
                let id = `${x+k}:${y+j}`
                let item = document.getElementById(id);
                item.classList.remove("button");
                item.innerHTML = board[y+j][x+k];
                displayBoard[y+j][x+k] = board[y+j][x+k];
            }
        }
    }

}

function cellFlag(id) {
    if (run) {
        console.log(`flag ${id}`);
    }
}

function gameOver(explosion, height, width, mines) {
    run = false;

    for (let i = 0; i < height; i++)
        for (let j = 0; j < width; j++) {
            let cell = `${j}:${i}`
            if(mines[i][j] == "X" && cell != explosion) {
                let item = document.getElementById(cell);
                item.classList.remove("button");
                let bomb = document.createElement("img");
                bomb.src = "img/pbomb.png"
                item.appendChild(bomb);
            }
        }

    alert("Przegrałeś");
}

/**
 * Create board, button, etc. and display it
 * @param {Number} height 
 * @param {Number} width 
 * @param {Array[]} displayBoard 
 * @param {Array[]} board 
 */
function gameBoard(height, width, displayBoard, board, mines) {
    let div = document.createElement("div");
    div.classList.add("saper");

    let time = document.createElement("div");
    time.setAttribute("id", "timer");
    div.appendChild(time);

    let bombs = document.createElement("div");
    bombs.setAttribute("id", "bombs");
    div.appendChild(bombs);

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
                if (cellCheck(cellId, height, width, board))
                    gameOver(cellId, height, width, board);
            }
            cell.oncontextmenu = function (event) {
                event.preventDefault();
                cellFlag(cellId, displayBoard);
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    div.appendChild(table)
    container.appendChild(div);
}

function bombs_left () {
    document.getElementById("bombs").innerText = `Pozostało bomb: ${mines_left}`
}

function timer () {
    if (run) {
        time++;
        document.getElementById("timer").innerText = `Grasz: ${time}[s]`;
    }
}