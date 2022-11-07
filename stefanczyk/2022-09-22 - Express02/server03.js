const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 5555;
const path = require("path");

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/formularz", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/formularz2.html"));
});

app.post("/handleForm", function (req, res) {
    res.send(`
        <body style='background:${req.body.color}'>
            <h1 style='font-size:80px; color:white; text-align:center;'>${req.body.color}<h1>
        </body>
    `);
    console.log(req.body);
});

app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
