import { login as l, reset, getUsers, connectToServer } from "./Net.js";
import { game } from "./Main.js";

let timeout;
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.remove("preload");
    }, 1000);
});

var username;

export function loginPageSetup(loginEl) {
    loginEl.submit.addEventListener("click", async (e) => {
        e.preventDefault();
        username = loginEl.username.value;

        let tmp = "blue";
        timeout = setInterval(() => {
            loginEl.style.border = `2px solid ${tmp}`;

            if (tmp == "blue")
                tmp = "green";
            else
                tmp = "blue";

        }, 10);

        const res = await l(username);


        if (res.success) {
            clearInterval(timeout);

            loginEl.classList.add("hidden");
            loginEl.message.classList.add("hidden");

            const color = res.user.color == "white" ? "białymi" : "czarnymi";
            setStatus(`Witaj <span class="username">${res.user.name}</span>, grasz ${color}.`);
            game.ChooseSide(res.user.color)
                .then(waitOnPlayer);
        }
        else {
            clearInterval(timeout);

            loginEl.message.innerText = res.error;
            loginEl.message.classList.remove("hidden");

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                loginEl.message.classList.add("hidden");
            }, 1500);
        }
    });

    loginEl.reset.addEventListener("click", async (e) => {
        e.preventDefault();
        const res = await reset();

        if (res.success) {
            loginEl.message.classList.remove("hidden");
            loginEl.message.innerText = "Użytkownicy zresetowani";

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                loginEl.message.classList.add("hidden");
            }, 1500);
        }
    });
}

function waitOnPlayer() {
    // toggleWaiting();
    timeout = setInterval(() => {
        getUsers()
            .then(res => {
                if (res.users.length == 2) {
                    clearInterval(timeout);

                    const players = res.users;
                    for (const player of players) {
                        if (player.name == username) {
                            const index = players.indexOf(player);
                            players.splice(index, 1);
                        }
                    }

                    addStatus(`Twoim przeciwnikiem jest <span class="username">${players[0].name}</span>.`);
                    connectToServer();
                }
            });
    }, 1000);
}

function setStatus(message) {
    const statusEl = document.getElementById("status");
    for (const el of statusEl.children) {
        el.remove();
    }

    if (message != undefined) {
        const messageEl = document.createElement("p");
        messageEl.innerHTML = message;
        statusEl.append(messageEl);
    }
}

function addStatus(message) {
    const statusEl = document.getElementById("status");
    const messageEl = document.createElement("p");
    messageEl.innerHTML = message;
    statusEl.lastChild.after(messageEl);
}

let loadingHidden = true;
export function toggleLoading() {
    const htmlEl = document.getElementById("loading");
    if (loadingHidden) {
        loadingHidden = false;
        htmlEl.classList.remove("hidden");
    } else {
        loadingHidden = true;
        htmlEl.classList.add("hidden");
        // po załadowaniu tekstur wyświetla się oczekiwanie na drugiego gracza
        toggleWaiting();
    }
}

let waitingHidden = true;
export function toggleWaiting() {
    const htmlEl = document.getElementById("waiting");
    if (waitingHidden) {
        waitingHidden = false;
        htmlEl.classList.remove("hidden");
    } else {
        waitingHidden = true;
        htmlEl.classList.add("hidden");
        toggleWaitingForMove();
    }
}

let waitingForMove = false;
let timerTimeOut;
let time = 30;
export function resetTimer() {
    time = 30;
}
export function toggleWaitingForMove() {
    const htmlEl = document.getElementById("waitingForMove");
    const timer = document.getElementById("waitingTimer");

    if (waitingForMove) {
        if (timerTimeOut) clearInterval(timerTimeOut);

        time = 30;
        timer.innerText = time;
        waitingForMove = false;
        htmlEl.classList.remove("hidden");

        timerTimeOut = setInterval(function () {
            if (time > 0) {
                time--;
                timer.innerText = time;
                return;
            }

            timer.innerText = "Strata tury przeciwnika";
            clearInterval(timerTimeOut);
        }, 1000);
    } else {
        waitingForMove = true;
        htmlEl.classList.add("hidden");
        clearInterval(timerTimeOut);
    }
}

let win = true;
export function toggleWin(player) {
    const htmlEl = document.getElementById("win");
    if(win) {
        htmlEl.classList.remove("hidden");
        htmlEl.innerText = `Wygrał gracz ${player}`;
        win = false;

        document.getElementById("waitingForMove").classList.add("hidden");
        waitingForMove = true;
    } else {
        htmlEl.classList.add("hidden");
        win = true;
    }

}
