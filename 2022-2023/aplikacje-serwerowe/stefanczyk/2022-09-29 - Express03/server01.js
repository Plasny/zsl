const express = require("express");
const app = express();
const PORT = 5555;
const path = require("path");

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({
    extended: true
}));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index01.html"));
});


app.post("/handlePost", function (req, res) {
    console.log(req.body);
    res.setHeader("content-type", "application/json");
    // res.setHeader("content-type", "text/plain");
    // res.setHeader("content-type", "text/html");
    res.send(req.body);
})


app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
