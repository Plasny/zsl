const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5555;

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/static/cwiczenia'));

app.get("/cwiczenia", function (req, res) {
    fs.readdir(__dirname + '/static/cwiczenia', function (err, files) {
        if (err) {
            return console.log(err);
        }

        // console.log(files);
        res.send(files);
    });
});

app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
