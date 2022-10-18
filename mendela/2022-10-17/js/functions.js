/**
 * Flag that is set to true when the game starts
 * @type {Boolean}
 */
var started = false;

/**
 * Board height
 * @type {Number}
 */
var height;

/**
 * Board width
 * @type {Number}
 */
var width;

/**
 * Variable that sets frames per second for AnimationFrame (tmp)
 * @type {Number}
 */
var fps = 2;

/**
 * Table with IDs of cells in which snake is located now
 * @type {{x: Number, y: Number}[]}
 */
var snakeNow;

/**
 * Variable that defines which direction is snake moving
 * @type {String} direction
 */
var snakeDirection;

/**
 * Variable that stores length of the snake
 * @type {Number}
 */
var snakeLength;

/**
 * Variable which stores game animation frame id
 */
var aniFrame;

// ---------------------------------------------------------------------------

/**
 * Function that creates and display game board in table with id = "board"
 * @return {Number[][]} table with game board (probably useless)
 */
function boardGen() {
    // if height or width is not set
    height = typeof height === "undefined" ? 9 : height;
    width = typeof width === "undefined" ? 9 : width;

    let board = [];
    let noContent = 0;
    let wall = "#";

    for (let i = 0; i < height + 2; i++) {
        let tr = document.createElement("tr");
        board[i] = [];
        for (let j = 0; j < width + 2; j++) {
            let td = document.createElement("td");
            td.setAttribute("id", `${j}:${i}`); // id format x:y

            if (i * j == 0 || i == height + 1 || j == width + 1) {
                td.classList.add("wall");
                board[i][j] = wall;
            } else {
                board[i][j] = noContent;
            }

            tr.appendChild(td);
        }
        document.getElementById("board").appendChild(tr);
    }

    console.table(board);
    return board;
}

function appleGen() {
    x = Math.ceil(Math.random()*width);
    y = Math.ceil(Math.random()*height);
    document.getElementById(`${x}:${y}`).classList.add("apple");
}

/**
 * Function that creates snake on board
 */
function snakeGen() {
    snakeLength = 1;
    document.getElementById("points").innerText = `Długość węża: ${snakeLength}`;

    Array.from(document.getElementsByClassName("snake")).forEach((element) =>
        element.classList.remove("snake")
    );

    let x = Math.ceil(width / 2);
    let y = Math.ceil(height / 2);
    snakeNow = [{x: x, y: y}];

    document.getElementById(`${x}:${y}`).classList.add("snake");

    // console.log(snakeNow);
}

/**
 * Function that moves snakes head
 * @returns {true|false} is snake still moving?
 */
function snakeMovement() {
    /**
     * x coordinate of snakes head in next frame
     */
    let x = snakeNow[0].x;

    /**
     * y coordinate of snakes head in next frame
     */
    let y = snakeNow[0].y;

    switch (snakeDirection) {
        case "up":
            y--;
            break;
        case "down":
            y++;
            break;
        case "left":
            x--;
            break;
        case "right":
            x++;
            break;
    }

    /**
     * classList of the cell in which snakes head will be located in next frame
     */
    let nextCellClass = document.getElementById(`${x}:${y}`).classList;

    if (x*y == 0 || x == width + 1 || y == height + 1 || nextCellClass.contains("snake")) {
        cancelAnimationFrame(aniFrame);
        started = false;
        alert("Przegrałeś");
        snakeGen();
        return false;
    } else if (nextCellClass.contains("apple") == true) {
        nextCellClass.remove("apple");
        snakeLength++;
        document.getElementById("points").innerText = `Długość węża: ${snakeLength}`;

        if (snakeLength == height*width) {
            alert("Wygrałeś !!!");
            return false;
            
        }

        appleGen();
    }

    snakeNow.unshift({x:x, y:y});
    if(snakeNow.length > snakeLength)
        snakeNow.pop();

    return true;
}

/**
 * Function where all stuff happens
 */
function game() {
    let gameContinues = snakeMovement();

    if(gameContinues) {
        Array.from(document.getElementsByClassName("snake")).forEach((element) =>
            element.classList.remove("snake")
        );
        for (let i in snakeNow) {
            document
                .getElementById(`${snakeNow[i].x}:${snakeNow[i].y}`)
                .classList.add("snake");
        }

        setTimeout(() => {
            aniFrame = requestAnimationFrame(game);
        }, 1000 / fps);

    }
}
