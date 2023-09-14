const express = require("express");
const app = express();
const PORT = 5555;
const path = require("path");
const formidable = require("formidable");

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({
    extended: true
}));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index01.html"));
});


app.post("/handleUpload", function (req, res) {
    let form = formidable({});
    let jsonRes = [];

    form.uploadDir = __dirname + '/uploads'; // folder do zapisu plików
    form.parse(req, function (err, fields, files) {
        // console.log("----- przesłane formularzem pliki ------");
        // console.log(fields);
        // console.log("----- przesłane formularzem pliki ------");
        // console.log(files.imagetoupload);

        jsonRes.push(fields);
        jsonRes.push(files);    // pozostałe pola są ukryte lub nie są stringiem lub liczbą, więc nie są wyświetlane
        console.log(jsonRes);

        res.setHeader('content-type', 'application/json')
        res.send(JSON.stringify(jsonRes, null, 3));
    });
})


app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
