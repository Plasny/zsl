const express = require("express");
const cookieParser = require("cookie-parser");
const PORT = 5555;
const app = express();
app.use(cookieParser());

app.get('/', function (req, res) {
    res
        .cookie("cookieA", "aaa", {expires: new Date(Date.now() + 1000*60*60*4), httpOnly: true})
        .send('cookieA zostało ustawione');

    console.log("cookies: ", req.cookies);
})


app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
});
