import { players, resetPlayers, Player } from "./main.js";
import { getKeyCode } from "./utils.js";
import { modelPaths } from "./consts.js"

/**
 * Number of players that want to play the game
 * @type {Number}
 */
export let playerCount = 0;

/**
 * Function that displays menu for choosing players and starting the game on the webpage 
 */
export function goToMenu() {
    let menu = document.getElementById("menu");
    let gameOverScreen = document.getElementById("gameOver");
    menu.removeAttribute("hidden");
    gameOverScreen.setAttribute("hidden", "true");
}

/**
 * Function that displays scoreboard and players that won on the webpage
 * @param {Boolean} [win=false] if the game was won or not
 */
export function goToGameOver(win = false) {
    let menu = document.getElementById("menu");
    let scoreboard = document.getElementById("scoreboard");
    let topText = document.getElementById("topText");
    let gameOverScreen = document.getElementById("gameOver");
    menu.setAttribute("hidden", "true");
    gameOverScreen.removeAttribute("hidden");

    let scoreboardText = "";
    let winners = [];
    players.sort(function (a, b) { return b.lap - a.lap; });
    players.forEach(player => {
        if (player.lap >= laps)
            winners.push(player.name);
        scoreboardText += `${player.name} - lap ${player.lap} <br>`;
    });
    scoreboard.innerHTML = scoreboardText;

    if (win) {
        topText.innerHTML = `<span style="font-size: 80px;">Player(s) ${winners.toString()} won</span>`;
    } else {
        topText.innerText = "Game Over!";
    }

    resetPlayers();
}

/**
 * Function that sets up other functions and variables in the form of a given id
 * @param {String} id id of the form
 */
export function menuSetter(id) {
    let menu = document.getElementById(id);
    let playerID = id.split("-")[1] - 1;

    menu.name.value = `Player${playerID + 1}`;
    menu.rKey.addEventListener("click", getKeyCode);
    menu.lKey.addEventListener("click", getKeyCode);
}

/**
 * Function that handles menu, which enables users to add new players
 * @param {Event} e Event for preventing default behavior of form submitting
 */
export function menuHandler(e) {
    if (e) e.preventDefault();
    console.log('sss')
    let playerID = this.id.split("-")[1] - 1;

    if (this.submit.innerText == "Remove") {
        this.submit.innerText = "Add";
        this.style.backgroundColor = "#f0f8ff";
        playerCount--;
    } else {
        this.submit.innerText = "Remove";
        this.style.backgroundColor = "#e0ffe0";
        playerCount++;

        const playerModelPath = modelPaths[playerID];

        return new Player(playerID, this.name.value, this.rKey.value, this.lKey.value, this.color.value, playerModelPath, 40 + playerID * 40);
    }
}
