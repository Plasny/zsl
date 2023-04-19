import { io } from "https://cdn.socket.io/4.5.4/socket.io.esm.min.js";
const socket = io();

export class chat {
    constructor(name, chatEl) {
        this.name = name;
        this.htmlContainer = chatEl;
        this.htmlContainer.innerText = '';

        this.htmlUserEl = document.createElement('p');
        this.htmlUserEl.innerText = `zalogowany: ${name}`;
        this.htmlContainer.append(this.htmlUserEl);

        this.htmlChat = document.createElement('div');
        this.htmlChat.classList.add("messages");
        this.htmlContainer.append(this.htmlChat);

        this.htmlInput = document.createElement('form');
        const textArea = document.createElement('textarea');
        textArea.name = 'content';
        this.htmlInput.append(textArea);
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.innerText = 'Wyślij';
        this.htmlInput.append(submitBtn);
        this.htmlContainer.append(this.htmlInput);
        this.htmlInput.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage(e.target.content.value);
            e.target.content.value = '';
        });

        socket.emit('hello', { user: this.name, content: "wchodzi na czat", time: Date.now() });

        socket.on('hello', this.Connection);
        socket.on('bye', this.Disconnection);
        socket.on('message', this.addMessage);
    }

    Connection = (message) => {
        const messageEl = document.createElement('div');
        const time = new Date(message.time);

        if (message.user === this.name) {
            message.content = "wchodzę na czat";
            messageEl.classList.add('m0');
        } else {
            messageEl.classList.add('m3');
        }

        messageEl.innerHTML = `<span class="msgUser">${message.user}</span> | <span class="msgContent">${message.content}</span> | <span class="msgTime">${time.toLocaleTimeString()}</span>`;
        this.htmlChat.append(messageEl);

        this.htmlChat.scrollTo(0, this.htmlChat.scrollHeight);
    };

    Disconnection = (message) => {
        const messageEl = document.createElement('div');
        const time = new Date(message.time);
        messageEl.classList.add('m4');
        messageEl.innerHTML = `<span class="msgUser">${message.user}</span> | <span class="msgContent">${message.content}</span> | <span class="msgTime">${time.toLocaleTimeString()}</span>`;
        this.htmlChat.append(messageEl);

        this.htmlChat.scrollTo(0, this.htmlChat.scrollHeight);
    }

    sendMessage = (content) => {
        socket.emit('message', { user: this.name, content: content, time: Date.now() });
    };

    addMessage = (message) => {
        const messageEl = document.createElement('div');
        const time = new Date(message.time);
        messageEl.innerHTML = `<span class="msgUser">${message.user}</span> | <span class="msgContent">${message.content}</span> | <span class="msgTime">${time.toLocaleTimeString()}</span>`;

        if (message.user === this.name) {
            messageEl.classList.add('m1');
        } else {
            messageEl.classList.add('m2');
        }

        this.htmlChat.append(messageEl);

        this.htmlChat.scrollTo(0, this.htmlChat.scrollHeight);
    };
}
