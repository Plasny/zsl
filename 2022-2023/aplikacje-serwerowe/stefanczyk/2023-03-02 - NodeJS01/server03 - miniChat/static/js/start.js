import { chat } from './chat.js';

var chatObj;

window.addEventListener('load', function () {
    const chatEl = document.getElementById('chat');
    const user = prompt("Podaj nazwę użytkownika: ", "user1");

    if (user)
        chatObj = new chat(user, chatEl);
});
