const express = require("express");
const path = require("path");
const PORT = 5555;
const app = express();

app.use(express.static(__dirname+"/static"));

app.get("/koty", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/koty.html"));
});
app.get("/auta", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/auta.html"));
});
app.get("/drzewa", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/drzewa.html"));
});

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
});
