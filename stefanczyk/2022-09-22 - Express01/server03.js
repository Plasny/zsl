/// some errors...

const express = require("express")
const path = require("path")
const app = express()
const PORT = 5555;

app.use(express.static(__dirname+'/static'))

// app.listen("/", function (req, res) {
//     console.log("sćieżka do katalogu głównego aplikacji: " + __dirname)
//     res.sendFile(path.join(__dirname + "/static/strona.html"))
// })

app.get("/strona", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/strona.html"))
    console.log(__dirname)
})

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT)
})