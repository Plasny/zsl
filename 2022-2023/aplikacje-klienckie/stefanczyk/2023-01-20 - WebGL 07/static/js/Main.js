import { Game } from "./Game.js";
import { loginPageSetup } from "./UI.js";

const loginHTML = document.getElementById("login");
export let game;


window.addEventListener("load", async () => {
    game = new Game("game")

    loginPageSetup(loginHTML)
});


