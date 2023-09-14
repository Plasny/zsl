const newServer = require('./newServer.js');
const process = require('process');
const os = require('node:os');
const Datastore = require('nedb');
const path = require('path');
const PORT = 5555;

const db = new Datastore({ autoload: true });
let interval;

// web server
const server = newServer({
    'GET': {
        '/getData': getDataHandler,
        '/start': startHandler,
        '/stop': stopHandler,
    }
});

server.listen(PORT, () => {
    console.log('App running on port ' + PORT);
});

// start and stop gathering data
function insertData() {
    const memUsed = os.totalmem() - os.freemem();

    db.insert({ timestamp: Date.now(), memoryUsage: process.memoryUsage().heapUsed, type: "heap" }, (err, newDoc) => {
        if (err) throw (err);
        return newDoc;
    });

    db.insert({ timestamp: Date.now(), memoryUsage: memUsed, type: "os" }, (err, newDoc) => {
        if (err) throw (err);
        return newDoc;
    });
}

function startHandler(req, res) {
    if (!interval)
        interval = setInterval(insertData, 1000);

    res.writeHead(200);
    res.end();
}

function stopHandler(req, res) {
    clearInterval(interval);
    interval = null;

    res.writeHead(200);
    res.end();
}

// retrieving data from database
async function getData(limit = 25, type = 'heap') {
    return new Promise((resolve, reject) => {
        db.find({ type: type }).sort({ timestamp: -1 }).limit(limit).exec((err, doc) => {
            if (err) reject(err);
            resolve(doc);
        });
    });
}

async function getDataHandler(req, res) {
    const params = new URLSearchParams(decodeURI(req.url).split('?')[1]);
    const limit = parseInt(params.get('limit'));
    const type = params.get('type') ?? 'heap';
    const body = await getData(isNaN(limit) ? 25 : limit, type);

    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
    res.write(JSON.stringify(body));
    res.end();
}
