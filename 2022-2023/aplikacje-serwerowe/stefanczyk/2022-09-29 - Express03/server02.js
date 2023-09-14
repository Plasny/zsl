const express = require("express");
const app = express();
const PORT = 5555;
const path = require("path");

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({
    extended: true
}));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index02.html"));
});


app.post("/handlePost", function (req, res) {
    console.log(req.body);
    let b = req.body;
    b.suma = parseFloat(b.a) + parseFloat(b.b);
    b.iloczyn = parseFloat(b.a) * parseFloat(b.b);

    res.setHeader("content-type", "application/json");
    // res.send(b)
    res.send("JSON !!!\n" + JSON.stringify(b, null, 5)); // make json look pritty and add text before it
});


app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
