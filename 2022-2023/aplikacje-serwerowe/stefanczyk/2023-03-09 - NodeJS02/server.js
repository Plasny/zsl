const newServer = require('./newServer.js');
const PORT = 5555;

const server = newServer({
    'GET': {
        '/get': (req, res) => {
            res.write('<h1>GET</h1>');
            res.end();
        },
    },
    'POST': {
        '/post': (req, res) => {
            res.write('<h1>GET</h1>');
            res.end();
        },
        '/boxes': (req, res) => {
            let body = "";

            req.on("data", (data) => {
                body += data.toString();
            });

            req.on("end", () => {
                res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'})
                res.write(body);
                res.end();
            });
        }
    }
});

server.listen(PORT, () => {
    console.log('App running on port ' + PORT);
});
