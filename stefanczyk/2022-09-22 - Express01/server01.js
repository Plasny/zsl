const express = require("express")
const app = express()
const PORT = 5555;

app.use(express.static(__dirname+'/static'))

app.get("/", function () {
    console.log("test")
})

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT)
})