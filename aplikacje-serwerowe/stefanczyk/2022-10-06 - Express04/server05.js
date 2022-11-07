const express = require("express");
const path = require("path");
const app = express();
const PORT = 5555;

app.use(express.static(__dirname + '/static'));
app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index05.html"));
});

app.post("/api", function (req, res) {
    console.log(req.body);

    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(req.body));
});

app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
