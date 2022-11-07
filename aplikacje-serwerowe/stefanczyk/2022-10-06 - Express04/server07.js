const express = require("express");
const path = require("path");
const app = express();
const PORT = 5555;
const jsonData = require("./storage/data.json");

app.use(express.static(__dirname + '/static'));
app.use(express.json());


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index07.html"));
});

app.get("/all", function (req, res) {
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(jsonData, null, 3));
});

app.get("/first", function (req, res) {
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(jsonData[0], null, 3));
});

app.get("/honda", function (req, res) {
    let honda = [];
    jsonData.forEach(function (element) {
        if(element.car_name == 'Honda')
            honda.push(element);
    });

    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(honda, null, 3));
});


app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
