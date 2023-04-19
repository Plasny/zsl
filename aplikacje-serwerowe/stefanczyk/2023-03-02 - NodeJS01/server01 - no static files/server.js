const http = require('http');
const r = require('./routes');

const PORT = 5555;

const server = http.createServer((req, res) => {
    // console.log(`Adres żądania: ${req.url}`);
    // console.log(`Nagłówki żądania: \n${JSON.stringify(req.headers, null, 5)}`)

    switch (req.url.toLowerCase()) {
        case '/': r.browserCheck(req, res); break;
        case '/a': r.colorfulPage(req, res, 'red'); break;
        case '/b': r.colorfulPage(req, res, 'green'); break;
        case '/c': r.colorfulPage(req, res, 'blue'); break;
        case '/d': r.colorfulPage(req, res, ''); break;
        default: r.NotFound(req, res);
    }
});

server.listen(PORT, () => {
    console.log('App running on port ' + PORT);
});
