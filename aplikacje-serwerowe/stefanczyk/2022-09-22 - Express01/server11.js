const express = require("express");
const PORT = 5555;
const app = express();
const path = require("path")

app.use(express.static(__dirname+'/static'));

app.get("/product_id/:id", function (req, res) {
    let id = req.params.id;
    if ( id > 0 && id <= 3)
        res.sendFile(path.join(__dirname + "/static/products/product" + id + ".html"));
    else
        res.send("Brak produktu o id=" + id );
});

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
});