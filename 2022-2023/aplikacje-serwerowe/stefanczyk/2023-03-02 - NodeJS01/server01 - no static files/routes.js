require("colors");
const logger = require('tracer').colorConsole();

function NotFound(req, res) {
    res.writeHead(404, { "content-type": "text/html;charset=utf-8" });
    res.end(`<h1>Page not found</h1>`);

    // logger.log('not found');
    // logger.trace('not found');
    // logger.debug('not found');
    // logger.info('not found');
    logger.warn('not found');
    // logger.error('not found');
}

function browserCheck(req, res) {
    agent = req.headers["user-agent"];
    browser = "nieznanej";
    if (agent.indexOf("Chrome") != -1) {
        browser = "Chrome";
    }
    if (agent.indexOf("Edg") != -1) {
        browser = "Edge";
    }
    if (agent.indexOf("Firefox") != -1) {
        browser = "Firefox";
    }

    res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
    res.end(`<h1>Używasz przeglądarki ${browser}</h1><p>ip: ${req.headers["x-real-ip"]}</p>`);
}

function colorfulPage(req, res, color) {
    switch (color) {
        case 'red': console.log("kolorowe".red); break;
        case 'blue': console.log("kolorowe".blue); break;
        case 'green': console.log("kolorowe".green); break;
        default: console.log('kolorowe'.rainbow);
    }

    res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
    res.end(`<h1 style="text-align: center; color: ${color}">kolorowe</h1>`);
}

module.exports.NotFound = NotFound;
module.exports.browserCheck = browserCheck;
module.exports.colorfulPage = colorfulPage;
