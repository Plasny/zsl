import {width, height, canvasId, timeout} from "./consts.js"
import {hexToRgba, getImg, keysPressed} from "./utils.js"
import {goToGameOver, goToMenu, menuSetter, menuHandler, playerCount} from "./ui.js"

/**
 * Number of laps for a game
 * @type {Number}
 */
let laps;

/**
 * Speed of the players
 * @type {Number}
 */
let speed = 3;

/**
 * Angle in radians which is added to the rotation of the player in each animation frame when they press a given button
 * @type {Number}
 */
let rotationStep;

/**
 * Array of two paths. The outer and inner band of the speedway
 * @type {[Path2D, Path2D]}
 */
let paths = [];

/**
 * When this line is crossed the lap counter is increased for a player
 * @type {Path2D}
 */
let lapLine;

/**
 * @type {CanvasRenderingContext2D}
 */
let ctx1;

/**
 * Image used as texture for the background of the game board
 * @type {HTMLImageElement}
 */
const texture = await getImg("./img/grass.jpg");

/**
 * List of `Player` objects
 * @type {Object[]}
 */
export let players = [];

/**
 * Function that resets players array
 */
export function resetPlayers() {
    players = [];
}

/**
 * Class representing the players motorcycle and managing to draw its movement on game board.
 */
export class Player {
    /**
     * Create a Player
     * @param {Any} id id for the player
     * @param {String} name Players name that is going to be displayed
     * @param {Number} turnLeftKey Key code to turn player left
     * @param {Number} turnRightKey Key code to turn player right
     * @param {String} color Color of the motorcycles trail
     * @param {String} modelPath Url to the image of the players motorcycle
     * @param {Number} dist Distance from inner band, where to put the motorcycle on board
     */
    constructor(id, name, turnLeftKey, turnRightKey, color, modelPath, dist) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.alive = true;
        this.rotation = 0;
        this.lap = 0;
        this.lapChange = true;
        this.turn = {
            right: turnRightKey,
            left: turnLeftKey,
        };
        this.pos = {
            x: width / 3,
            y: 2 * height / 3 + dist,
        };

        this.modelHeight = 40;
        this.modelWidth = 60;
        this.model = new Image();
        this.model.src = modelPath;
        this.model.onload = this.drawModel();

        this.tailArr = [];
        this.drawTail();
    }

    /**
     * Method that draws players motorcycle image onto canvas2
     */
    drawModel() {
        ctx1.translate(this.pos.x, this.pos.y);
        ctx1.rotate(this.rotation);
        ctx1.drawImage(this.model, - this.modelWidth / 2, - this.modelHeight / 2, this.modelWidth, this.modelHeight);
        ctx1.rotate(-this.rotation);
        ctx1.translate(-this.pos.x, -this.pos.y);
    }

    /**
     * Method that draw trail after motorcycle onto canvas1
     */
    drawTail() {
        let x, y;

        for (const i in this.tailArr) {
            if (this.tailArr[i].color.a <= 0) {
                this.tailArr.splice(i, 1);
            }
        }

        const path = new Path2D();

        path.moveTo(this.pos.x, this.pos.y);

        x = speed * Math.cos(this.rotation);
        y = speed * Math.sin(this.rotation);
        this.pos.x += x;
        this.pos.y += y;

        path.lineTo(this.pos.x, this.pos.y);

        this.tailArr.push({ path: path, color: hexToRgba(this.color) });

        for (const el of this.tailArr) {
            ctx1.strokeStyle = `rgba(${el.color.r}, ${el.color.g}, ${el.color.b}, ${el.color.a})`;
            ctx1.stroke(el.path);
            el.color.a -= (0.2 / speed);
        }
    }

    /**
     * Method that checks whether the player is alive and did he pass the lap line. It changes rotation of the player according to the pressed keys and it also calls `drawTail` and `drawModel` methods.
     */
    move() {
        if (this.alive == false) {
            return;
        }

        if (ctx1.isPointInStroke(paths[0], this.pos.x, this.pos.y) || ctx1.isPointInStroke(paths[1], this.pos.x, this.pos.y)) {
            this.alive = false;
            console.info(`Player ${this.name} died!`);
            return;
        }

        if (ctx1.isPointInStroke(lapLine, this.pos.x, this.pos.y) && this.lapChange) {
            this.lap += 1;
            this.lapChange = false;
            setTimeout(() => { this.lapChange = true; }, timeout);
            console.log(`Player ${this.name} is on ${this.lap} lap`);
        }

        if (keysPressed[this.turn.left]) {
            this.rotation += rotationStep;
        }

        if (keysPressed[this.turn.right]) {
            this.rotation -= rotationStep;
        }

        this.drawTail();
        this.drawModel();
    }

}

/**
 * Function that draws a zuzel game board on a given canvas, with a given background texture
 * @param {String} id id of a canvas element in the index.html
 * @param {HTMLImageElement} img image object that is set as background of the game board
 * @param {Number} [opacity=1] opacity of the game board
 * @returns {[[Path2D, Path2D], Path2D]} array of two paths with inner and outer band of the speedway and lap line
 */
function drawBoard(id, img, opacity = 1) {
    let x, y = height / 2, r;
    let path1, path2, lapLinePath;

    const canvas = document.getElementById(id);
    canvas.width = width;
    canvas.height = height;
    ctx1 = canvas.getContext("2d");
    ctx1.lineWidth = 5;

    const pattern = ctx1.createPattern(img, "repeat");
    ctx1.fillStyle = pattern;
    ctx1.beginPath();
    ctx1.fillRect(0, 0, width, height);

    ctx1.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx1.strokeStyle = "#000000";
    path1 = new Path2D();
    x = width - y;
    r = y;
    path1.arc(x, y, r, -Math.PI / 2, Math.PI / 2);
    x = width - x;
    path1.arc(x, y, r, Math.PI / 2, -Math.PI / 2);
    x = width - y;
    path1.lineTo(x, 0);
    ctx1.stroke(path1);
    ctx1.fill(path1);

    ctx1.fillStyle = pattern;
    ctx1.strokeStyle = "#000000";
    path2 = new Path2D();
    x = width - y;
    r = y / 3;
    path2.moveTo(x, y);
    path2.arc(x, y, r, -Math.PI / 2, Math.PI / 2);
    x = width - x;
    path2.arc(x, y, r, Math.PI / 2, -Math.PI / 2);
    x = width - y;
    path2.lineTo(x, r * 2);
    ctx1.stroke(path2);
    ctx1.fill(path2);

    lapLinePath = new Path2D();
    x = width / 3;
    y = 2 * height / 3;

    // lapLinePath.moveTo(x, y);
    // lapLinePath.lineTo(x, height);
    let w = speed != undefined ? speed * 10 : 10;
    lapLinePath.rect(x, y, w, height);
    // ctx1.fillStyle = "#ff00ff";
    // ctx1.fill(lapLinePath);

    return [[path1, path2], lapLinePath];
}

/**
 * Function that displays laps left to win for each player
 */
function updateLapsLeft() {
    let l = document.getElementById("lapsLeft");
    let text = "Live Scores:<br>";

    players.forEach(player => {
        text += `${player.name} - `;
        if (player.alive) {
            let lapsLeft = laps - player.lap;
            if (lapsLeft > 1)
                text += `${laps - player.lap} laps left<br>`;
            else
                text += "<span style='color:violet'>last lap left</span><br>";
        }
        else
            text += "<span style='color:red'>no longer alive</span><br>";
    });

    l.innerHTML = text;
}

/**
 * ! Game loop
 */
function game() {
    ctx1.clearRect(0, 0, width, height);
    drawBoard(canvasId, texture);
    players.forEach(player => player.move());
    updateLapsLeft();

    for (let i = 0; i < playerCount; i++) {
        if (players[i].lap >= laps) {
            goToGameOver(true);
            return;
        }
    }

    for (let i = 0; i < playerCount; i++) {
        if (players[i].alive == true) {
            requestAnimationFrame(game);
            return;
        }
    }

    goToGameOver();
}

/**
 * Function that sets keyCodes in the `keysPressed` map to true
 * @param {Event} e 
 */
function addKey(e) {
    keysPressed[e.keyCode] = true;
}

/**
 * Function that sets keyCodes in the `keysPressed` map to false
 * @param {Event} e 
 */
function delKey(e) {
    keysPressed[e.keyCode] = false;
}

/**
 * Function that start the whole game
 */
function startGame() {
    if (playerCount == 0) {
        alert("No players added.\nPlease configure a player and then add it using `Add` button.");
        return;
    }

    for (let i of ['p-1', 'p-2', 'p-3', 'p-4']) {
        let menu = document.getElementById(i);
        if (menu.submit.innerText == "Remove") {
            let handler = menuHandler.bind(menu);
            handler();
            players.push(handler());
        }
    }

    laps = document.getElementById("laps").value;
    speed = document.getElementById("speed").value;
    rotationStep = document.getElementById("rotation").value / 100;

    let menu = document.getElementById("menu");
    let gameOverScreen = document.getElementById("gameOver");
    menu.setAttribute("hidden", "true");
    gameOverScreen.setAttribute("hidden", "true");

    [paths, lapLine] = drawBoard(canvasId, texture);

    game();
}


window.addEventListener("load", function () {
    while (true) {
        if (texture != undefined)
            break;
    }

    [paths, lapLine] = drawBoard(canvasId, texture);

    window.addEventListener("keydown", addKey);
    window.addEventListener("keyup", delKey);

    document.getElementById("startGame1").addEventListener("click", startGame);
    document.getElementById("startGame2").addEventListener("click", startGame);
    document.getElementById("goToMenu").addEventListener("click", goToMenu);

    for (let i of ['p-1', 'p-2', 'p-3', 'p-4']) {
        menuSetter(i);
        document.getElementById(i).addEventListener("submit", menuHandler);
    }
});
