const express = require("express");
const app = express();
const PORT = 5555;
const path = require("path");

app.use(express.static(__dirname + '/static'));
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index04.html"));
});


app.post("/post", function (req, res) {
    let b = req.body;
    console.log(b);
    res.send(b);
});


app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
