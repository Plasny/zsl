const express = require("express");
const app = express();
const PORT = 5555;
const path = require("path");

app.use(express.static(__dirname + '/static'));

app.get("/formularz", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/formularz.html"));
});

app.get("/handleForm", function (req, res) {
    res.send(`
        <body style='background:${req.query.color}'>
            <h1 style='font-size:80px; color:white; text-align:center;'>${req.query.color}<h1>
        </body>
    `);
    console.log(req.query);
});

app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
