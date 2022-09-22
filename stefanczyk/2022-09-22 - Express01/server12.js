const express = require("express");
const PORT = 5555;
const app = express();

app.get("/", function (req, res) {
    let size = 100;
    let htmlRes = "";

    for (let i = 0; i < size; i++) {
        htmlRes += `<a href="product/${i}">Strona produktu ${i}<a><br>`;
    }

    res.send(htmlRes);
});

app.get("/product/:id", function (req, res) {
    let id = req.params.id;
    res.send("Strona produktu o id = " + id);
});

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
});
