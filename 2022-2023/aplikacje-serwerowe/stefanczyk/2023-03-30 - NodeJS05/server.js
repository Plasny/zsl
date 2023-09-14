const http = require('http');
const router = require('./router');
const PORT = 5555;

http
    .createServer((req, res) => router(req, res))
    .listen(PORT, () => console.log('App running on port ' + PORT));
