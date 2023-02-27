const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const PORT = 5555;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const maxTime = 30000;
let users = [];
let lastMove;
// 1 - white, 2 - black
let pawns = [
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 2, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
    // [0, 1, 0, 0, 0, 0, 0, 2],
    // [1, 0, 0, 0, 0, 0, 2, 0],
    // [0, 1, 0, 0, 0, 0, 0, 2],
    // [1, 0, 0, 0, 0, 0, 2, 0],
    // [0, 1, 0, 0, 0, 0, 0, 2],
    // [1, 0, 0, 0, 0, 0, 2, 0],
    // [0, 1, 0, 0, 0, 0, 0, 2],
    // [1, 0, 0, 0, 0, 0, 2, 0],
];

app.use([
    express.static(__dirname + '/static'),
    express.json()
]);

app.post('/usersAdd', function (req, res) {
    let newUser = {};
    newUser.name = req.body.username;

    if (users.length >= 2) {
        res.send(JSON.stringify({ success: false, error: "toManyPlayers" }));
        return;
    }

    if (newUser.name.length == 0) {
        res.send(JSON.stringify({ success: false, error: "toShortUsername" }));
        return;
    }

    for (const user of users) {
        if (user.name == newUser.name) {
            res.send(JSON.stringify({ success: false, error: "usernameTaken" }));
            return;
        }
    }

    if (users.length == 0) {
        newUser.color = 'white';
    } else {
        newUser.color = 'black';
    }

    users.push(newUser);

    res.send(JSON.stringify({ success: true, user: newUser }));
    console.log(users);
});

app.post('/usersReset', function (req, res) {
    pawns = [
        [0, 1, 0, 0, 0, 0, 0, 2],
        [1, 0, 0, 0, 0, 0, 2, 0],
        [0, 1, 0, 0, 0, 0, 0, 2],
        [1, 0, 0, 0, 0, 0, 2, 0],
        [0, 1, 0, 0, 0, 0, 0, 2],
        [1, 0, 0, 0, 0, 0, 2, 0],
        [0, 1, 0, 0, 0, 0, 0, 2],
        [1, 0, 0, 0, 0, 0, 2, 0],
    ];
    users = [];
    res.send(JSON.stringify({ success: true }));
    console.log(users);
});

app.post('/getBoard', function (req, res) {
    res.send(JSON.stringify({ pawns: pawns, maxTime: maxTime }));
});

app.post('/getUsers', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ users: users }));
});

server.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});

io.on('connection', socket => {
    console.log("connection ->", socket.id);

    socket.on('hello', args => {
        console.log('Hello from', args.player);
        socket.broadcast.emit('hello', args);
    });

    socket.on('change', args => {
        socket.broadcast.emit('change', args);
    });

    socket.on('sendMove', args => {
        if (lastMove !== undefined) clearTimeout(lastMove.timeout);

        lastMove = {
            player: args.player,
            // change from win to switch to back to the last player
            timeout: setTimeout(function () { io.emit('change', args.player); }, maxTime)
        };

        pawns[args.move.old.x][args.move.old.z] = 0;
        pawns[args.move.new.x][args.move.new.z] = args.player;

        if (args.move.kill) {
            for (const kill of args.move.kill) {
                pawns[kill.x][kill.z] = 0;
            }
        }

        socket.broadcast.emit('sendMove', args);

        const win = checkWin();
        if (win) {
            if (lastMove !== undefined) clearTimeout(lastMove.timeout);
            console.log("WINNER ->", win);
            io.emit('win', win);
        }
    });
});

function checkWin() {
    let firstP = 0, secondP = 0;
    for (const arr of pawns) {
        for (const el of arr) {
            if (el === 1) firstP++;
            else if (el === 2) secondP++;
        }
    }

    if (firstP === 0) return users[1].name;
    if (secondP === 0) return users[0].name;
    return false;
}
