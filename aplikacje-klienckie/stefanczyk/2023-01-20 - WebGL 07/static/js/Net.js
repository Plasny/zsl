import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { game } from "./Main.js";
import { toggleWaiting, toggleWaitingForMove, toggleWin } from "./UI.js";

export var player;
var client;

function postData({ data = {}, url = '/' }) {
    return new Promise(resolve => {
        resolve(fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((res) => res.json()));
    });
}

export async function login(username) {
    const data = {
        username: username
    };

    player = await postData({ data: data, url: '/usersAdd' });
    if (player.success) player.user.color == "white" ? player.nr = 1 : player.nr = 2;
    return player;
}

export async function reset() {
    return await postData({ url: '/usersReset' });
}

export async function getBoard() {
    return await postData({ url: '/getBoard' });
}

export async function getUsers() {
    return await postData({ url: '/getUsers' });
}

export function connectToServer() {
    client = io();

    if(player.nr === 2) {
        client.emit('hello', { player: player.nr });
    }

    client.on('hello', args => {
        if (args.player === 2) {
            game.yourTurn = true;
            client.emit('hello', { player: player.nr });
        }
        toggleWaiting();
    });

    client.on('sendMove', args => {
        if (args.player == player.nr) return;
        game.makeMove(args.move, 3 - player.nr);
    });

    client.on('change', player => {
        toggleWaitingForMove();
        game.yourTurn ? game.yourTurn = false : game.yourTurn = true;
    });

    client.on('win', player => {
        toggleWin(player);
        game.yourTurn = false;
    });
}

export function sendMove(move) {
    client.emit('sendMove', { player: player.nr, move: move });
}

export function changeTurn() {
    client.emit('change', player.nr);
}
