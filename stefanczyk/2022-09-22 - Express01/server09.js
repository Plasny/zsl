const express = require("express");
const PORT = 5555;
const app = express();

function htmlRes(count, color) {
    let htmlRes = "";
    for (let i = 0; i < count; i++)
        htmlRes += `<div style="background:${color}; height:100px; width:100px; border: 1px solid black; margin: 10px;"></div>`;
    // console.log(htmlRes)
    return htmlRes;
}

app.get("/", function (req, res) {
    console.log("\nCount: " + req.query.count + "\nColor: " + req.query.color);
    res.send(htmlRes(req.query.count, req.query.color));
});

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
});
