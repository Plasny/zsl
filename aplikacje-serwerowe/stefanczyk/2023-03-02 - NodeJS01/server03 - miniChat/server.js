const http = require('http');
const fs = require('fs');
const { Server } = require('socket.io');
const path = require('path');
const PORT = 5555;

const server = http.createServer((req, res) => {
    const url = decodeURI(req.url);
    const ext = getExtension(url);

    if (ext != '') {
        fs.readFile(getFilePath(url), function (err, data) {
            if (err) {
                console.warn('nieprawidłowe żądanie: ' + url);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write('<h1>404 - podany plik nie istnieje</h1>');
                res.end();
                return;
            }

            sendFile(res, url, data);
        });

        return;
    }

    fs.readFile(getFilePath(url, 'index.html'), function (err, data) {
        if (err) {
            console.warn('nieprawidłowe żądanie: ' + url);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write('<h1>404 - podany plik nie istnieje</h1>');
            res.end();
            return;
        }

        console.info('żądanie: ' + url);
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.write(data);
        res.end();
    });

    return;
});

const io = new Server(server);

server.listen(PORT, () => {
    console.log('App running on port ' + PORT);
});

io.on('connection', socket => {
    let name;
    console.log('connection ->', socket.id);

    socket.on('hello', args => {
        name = args.user;
        io.emit('hello', args);
    });

    socket.on('message', args => {
        io.emit('message', args);
    });

    socket.on('disconnect', () => {
        io.emit('bye', { user: name, content: "opuścił czat", time: Date.now() });
        console.log('disconnected ->', socket.id);
    });
});

function sendFile(res, url, data) {
    const ext = getExtension(url);
    switch (ext) {
        case 'html':
            console.info('żądanie: ' + url);
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            break;
        case 'css':
            res.writeHead(200, { 'Content-Type': 'text/css;charset=utf-8' });
            break;
        case 'js':
            res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });
            break;
        case 'png':
            res.writeHead(200, { 'Content-Type': 'image/png' });
            break;
        default:
            res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
            break;
    }

    res.write(data);
    res.end();
}

function getFilePath(...providedPath) {
    return path.join(__dirname, 'static', ...providedPath);
}

function getExtension(path) {
    const arr = path.split(".");

    if (arr.length <= 1) return '';
    return arr[arr.length - 1];
}
