const express = require("express");
const app = express();
const PORT = 5555;
const path = require("path");

app.use(express.static(__dirname + '/static'));

app.get("/formularz", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/formularz.html"));
});

app.get("/handleForm", function (req, res) {
    res.send(req.query);
    console.log(req.query);
});

app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
