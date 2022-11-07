const express = require("express");
const PORT = 5555;
const app = express();

function conversion(value, toRad) {
    if (toRad.toLowerCase() == 'true') {
        return value * (Math.PI / 180);
    } else {
        return value * (180 / Math.PI);
    }
}

app.get("/", function (req, res) {
    console.log(req.query);
    res.send(conversion(req.query.value, req.query.toRad).toString());
});

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
});
