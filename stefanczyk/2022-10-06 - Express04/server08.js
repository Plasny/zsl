const express = require("express");
const path = require("path");
const app = express();
const PORT = 5555;
const formidable = require("formidable");

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index08.html"));
});

app.post("/api", function (req, res) {
    let form = formidable({});
    let jsonRes = {
        title: "file uploaded!",
    }

    form.keepExtensions = true;
    form.uploadDir = __dirname + '/uploads';
    form.parse(req, function (err, fields, files) {

        jsonRes.fileName = files.file.name;
        jsonRes.date = files.file.lastModifiedDate;
        // console.log(jsonRes);

        res.setHeader('content-type', 'application/json');
        res.send(jsonRes);
    });
});

app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
