const express = require('express');
const app = express();
const PORT = 5555;

app.use([
    express.static(__dirname + '/static'),
    express.urlencoded({ extended: true }),
    express.json()
]);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/boardGen.html');
});

app.post('/', function (req, res) {
    if (req.body.size != undefined) {
        map = req.body;
        res.sendStatus(200);
    } else {
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(map));
    }
});

app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/static/game.html');
});

app.get('/hex', function (req, res) {
    res.sendFile(__dirname + '/static/hex.html');
});

app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});


// demo map generated using map generator
var map = {
  "size": 6,
  "level": [
    {
      "id": 0,
      "x": 0,
      "z": 0,
      "dirIn": 5,
      "dirOut": 2,
      "type": "wall"
    },
    {
      "id": 1,
      "x": 1,
      "z": 0,
      "dirIn": 5,
      "dirOut": 3,
      "type": "wall"
    },
    {
      "id": 7,
      "x": 1,
      "z": 1,
      "dirIn": 0,
      "dirOut": 4,
      "type": "wall"
    },
    {
      "id": 12,
      "x": 0,
      "z": 2,
      "dirIn": 1,
      "dirOut": 5,
      "type": "wall"
    },
    {
      "id": 35,
      "x": 5,
      "z": 5,
      "dirIn": 2,
      "dirOut": 5,
      "type": "wall"
    },
    {
      "id": 34,
      "x": 4,
      "z": 5,
      "dirIn": 2,
      "dirOut": 0,
      "type": "wall"
    },
    {
      "id": 28,
      "x": 4,
      "z": 4,
      "dirIn": 3,
      "dirOut": 1,
      "type": "wall"
    },
    {
      "id": 23,
      "x": 5,
      "z": 3,
      "dirIn": 4,
      "dirOut": 2,
      "type": "wall"
    },
    {
      "id": 30,
      "x": 0,
      "z": 5,
      "dirIn": 5,
      "dirOut": 1,
      "type": "wall"
    },
    {
      "id": 25,
      "x": 1,
      "z": 4,
      "dirIn": 4,
      "dirOut": 0,
      "type": "wall"
    },
    {
      "id": 19,
      "x": 1,
      "z": 3,
      "dirIn": 3,
      "dirOut": 1,
      "type": "wall"
    },
    {
      "id": 20,
      "x": 2,
      "z": 3,
      "dirIn": 4,
      "dirOut": 1,
      "type": "wall"
    },
    {
      "id": 15,
      "x": 3,
      "z": 2,
      "dirIn": 4,
      "dirOut": 0,
      "type": "wall"
    },
    {
      "id": 9,
      "x": 3,
      "z": 1,
      "dirIn": 3,
      "dirOut": 2,
      "type": "wall"
    },
    {
      "id": 16,
      "x": 4,
      "z": 2,
      "dirIn": 5,
      "dirOut": 0,
      "type": "wall"
    },
    {
      "id": 10,
      "x": 4,
      "z": 1,
      "dirIn": 3,
      "dirOut": 1,
      "type": "wall"
    },
    {
      "id": 5,
      "x": 5,
      "z": 0,
      "dirIn": 4,
      "dirOut": 0,
      "type": "wall"
    }
  ]
}
