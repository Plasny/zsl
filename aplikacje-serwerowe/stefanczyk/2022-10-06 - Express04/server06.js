const express = require("express");
const path = require("path");
const app = express();
const PORT = 5555;
const jsonData = require("./storage/data.json");

app.use(express.static(__dirname + '/static'));
app.use(express.json());


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index06.html"));
});

app.get("/api", function (req, res) {
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(jsonData));
});


app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
