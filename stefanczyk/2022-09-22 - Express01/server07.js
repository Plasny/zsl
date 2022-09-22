const express = require("express");
const PORT = 5555;
const app = express();

app.get('/', function (req, res) {
    res.status(404).send("brak strony takiego produktu")
})

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
});