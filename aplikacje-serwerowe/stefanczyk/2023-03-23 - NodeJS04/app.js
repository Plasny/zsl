const webServer = require('./webServer.js');
const controller = require('./controller.js');
const PORT = 5555;

const server = new webServer({
    'GET': {
        '/getAll': (req, res) => getAllHandler(res)
    },
    'POST': {
        '/addOne': (req, res) => {
            console.log('add:', req.body.type, req.body.color)

            controller.add(req.body.type, req.body.color)
            getAllHandler(res)
        },
        '/delOne': (req, res) => {
            console.log('del:', req.body.id)

            controller.del(req.body.id)
            getAllHandler(res)
        },
        '/updateOne': (req, res) => {
            console.log('update:', req.body.id, req.body.type, req.body.color)

            controller.update(req.body.id, req.body.type, req.body.color)
            getAllHandler(res)
        }
    }
}, ['views', 'static']);

server.listen(PORT, () => {
    console.log('App running on port ' + PORT);
});

function getAllHandler(res) {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
    res.write(JSON.stringify(controller.getAll()));
    res.end();
}

