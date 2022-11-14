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
                td.classList.add("board");
                board[i][j] = noContent;
            }

            tr.appendChild(td);
        }
        document.getElementById("board").appendChild(tr);
    }

    console.table(board);
    return board;
}

/**
 * Function that places apples on the board
 */
function appleGen() {
    while (true) {
        x = Math.ceil(Math.random() * width);
        y = Math.ceil(Math.random() * height);

        if (!document.getElementById(`${x}:${y}`).classList.contains("snake")) {
            document.getElementById(`${x}:${y}`).classList.add("apple");
            break;
        }
    }
}

/**
 * Function that draws snake on board
 */
function snakeGen() {
    /// clean up
    fps = 2;
    snakeLength = 1;
    document.getElementById("points")
        .innerText = `Długość węża: ${snakeLength}`;

    for (css of ["snake", "tail", "head", "body", "body-turn"]) {
        Array.from(document.getElementsByClassName(css)).forEach((element) => {
            element.classList.remove(css);
            element.style.transform = "rotate(0deg)";
        });
    }

    let x = Math.ceil(width / 2);
    let y = Math.ceil(height / 2);
    snakeNow = [{ x: x, y: y }];

    document.getElementById(`${x}:${y}`).classList.add("snake");
    document.getElementById(`${x}:${y}`).classList.add("head");
    document.getElementById(`${x}:${y}`).style.transform = "rotate(270deg)";

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

    if (x * y == 0 || x == width + 1 || y == height + 1 || nextCellClass.contains("snake")) {
        cancelAnimationFrame(aniFrame);
        started = false;
        alert("Przegrałeś");
        snakeGen();
        return false;
    } else if (nextCellClass.contains("apple") == true) {
        nextCellClass.remove("apple");
        snakeLength++;
        fps += 0.1;
        document.getElementById("points")
            .innerText = `Długość węża: ${snakeLength}`;

        appleGen();

        if (snakeLength == height * width) {
            cancelAnimationFrame(aniFrame);
            started = false;
            alert("Wygrałeś !!!");
            snakeGen();
            return false;
        }
    }

    snakeNow.unshift({ x: x, y: y });
    if (snakeNow.length > snakeLength)
        snakeNow.pop();

    return true;
}

/**
 * Function where all stuff happens
 */
function game() {
    let gameContinues = snakeMovement();

    if (gameContinues) {

        /// cleaning
        for (css of ["snake", "tail", "head", "body", "body-turn"]) {
            Array.from(document.getElementsByClassName(css)).forEach((element) => {
                element.classList.remove(css);
                element.style.transform = "rotate(0deg)";
            });
        }

        /// drawing of body and tail 
        for (let i = 0; i < snakeLength; i++) {
            let s1 = snakeNow[i];
            let j = i + 1;
            let k = j + 1;

            document
                .getElementById(`${snakeNow[i].x}:${snakeNow[i].y}`)
                .classList.add("snake", "body")

            if (j < snakeLength) {
                let s2 = snakeNow[j];
                let s3 = snakeNow[k];
                let snakePart = document.getElementById(`${s2.x}:${s2.y}`);

                if (s1.y != s2.y) {
                    if (k < snakeLength && s1.x != s3.x) {
                        snakePart.classList.add("body-turn");

                        if (s1.x < s3.x && s1.y < s3.y)
                            snakePart.style.transform = "rotate(90deg)"; //|_
                        else if (s1.x < s3.x && s1.y > s3.y)
                            snakePart.style.transform = "rotate(180deg)"; //|`
                        else if (s1.x > s3.x && s1.y > s3.y)
                            snakePart.style.transform = "rotate(270deg)"; //`|
                        else if (s1.x > s3.x && s1.y < s3.y)
                            snakePart.style.transform = "rotate(0deg)"; //_|
                    }
                    else if (s1.y > s2.y) {
                        snakePart.style.transform = "rotate(90deg)";
                    }
                    else {
                        snakePart.style.transform = "rotate(270deg)";
                    }
                } else if (s1.x != s2.x) {
                    if (k < snakeLength && s1.y != s3.y) {
                        snakePart.classList.add("body-turn");

                        if (s1.x > s3.x && s1.y > s3.y)
                            snakePart.style.transform = "rotate(90deg)"; //|_
                        else if (s1.x > s3.x && s1.y < s3.y)
                            snakePart.style.transform = "rotate(180deg)"; //|`
                        else if (s1.x < s3.x && s1.y < s3.y)
                            snakePart.style.transform = "rotate(270deg)"; //`|
                        else if (s1.x < s3.x && s1.y > s3.y)
                            snakePart.style.transform = "rotate(0deg)"; //_|
                    }
                    else if (s1.x > s2.x) {
                        snakePart.style.transform = "rotate(0deg)";
                    }
                    else {
                        snakePart.style.transform = "rotate(180deg)";
                    }
                }
            }
        }

        /// tail drawing
        let tailCoo = snakeNow[snakeLength - 1];
        document.getElementById(`${tailCoo.x}:${tailCoo.y}`)
            .classList.add("tail");

        /// head drawing and movement, etc.
        let headCoo = snakeNow[0];
        let head = document.getElementById(`${headCoo.x}:${headCoo.y}`);

        switch (snakeDirection) {
            case "up":
                head.style.transform = "rotate(270deg)";
                break;
            case "down":
                head.style.transform = "rotate(90deg)";
                break;
            case "left":
                head.style.transform = "rotate(180deg)";
                break;
            case "right":
                head.style.transform = "rotate(0deg)";
                break;
        }

        document.getElementById(`${snakeNow[0].x}:${snakeNow[0].y}`)
            .classList.add("head", "snake");

        /// animation frame
        setTimeout(() => {
            aniFrame = requestAnimationFrame(game);
        }, 1000 / fps);

    }
}
