const http = require('http');
const fs = require('fs');
const path = require('path');
const logger = require('tracer').colorConsole();
const PORT = 5555;

const server = http.createServer((req, res) => {
    const url = decodeURI(req.url);
    fs.readFile(getFilePath(url), function (err, data) {
        if (err) {
            logger.warn('nieprawidłowe żądanie: ' + req.url);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write('<h1>404 - podany plik nie istnieje</h1>');
            res.end();
            return;
        }

        sendFile(res, url, data);
    });
});

server.listen(PORT, () => {
    console.log('App running on port ' + PORT);
});

function sendFile(res, url, data) {
    const ext = getExtension(url);
    switch (ext) {
        case 'html':
            logger.trace('żądanie: ' + url);
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

function getFilePath(providedPath) {
    return path.join(__dirname, 'static', providedPath);
}

function getExtension(path) {
    const arr = path.split(".");

    if (arr.length <= 1) return '';
    return arr[arr.length - 1];
}
