const express = require("express");
const app = express();
const PORT = 5555;
const path = require("path");

let users = ["111@w.pl","222@w.pl","333@w.pl"];

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));

app.get("/addUser", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/addUser.html"));
});

app.post("/addUser", function (req, res) {
    let email = req.body.email;
    if (users.includes(email)) {
        res.send("Taki mail już jest w bazie");
        // console.log("Taki mail już jest w bazie w komórce: " + users.indexOf(email));
    } else {
        users.push(email);
        res.send("Adres email został dodany");
        console.table(users);
    }
});

app.get("/removeUserBySelect", function (req, res) {
    let htmlRes = "<form action='/removeUserBySelect' method='POST'><select name=deleteItem>";
    for (id in users)
        htmlRes += `<option value="${id}">${users[id]}</option>`;
    htmlRes += "<input type='submit'> </select></form>";

    res.send(htmlRes);
});

app.post("/removeUserBySelect", function (req, res) {
    // console.log(req.body);
    let id = req.body.deleteItem;
    res.send(`Użytkownik ${users[id]} został usunięty`);
    users.splice(id, 1);
});

app.get("/removeUserByRadio", function (req, res) {
    let htmlRes = "<form action='/removeUserByRadio' method='POST'>";
    for (id in users)
        htmlRes += `<input type='radio' name='deleteItem' value='${id}'>${users[id]}<br>`;
    htmlRes += "<input type='submit'> </form>";

    res.send(htmlRes);
});

app.post("/removeUserByRadio", function (req, res) {
    let id = req.body.deleteItem;
    res.send(`Użytkownik ${users[id]} został usunięty`);
    users.splice(id, 1);
});

app.get("/removeUserByCheckbox", function (req, res) {
    let htmlRes = "<form action='/removeUserByCheckbox' method='POST'>";
    for (id in users)
        htmlRes += `<input type='checkbox' name='deleteItem' value='${id}'>${users[id]}<br>`;
    htmlRes += "<input type='submit'> </form>";

    res.send(htmlRes);
});

app.post("/removeUserByCheckbox", function (req, res) {
    let ids = req.body.deleteItem;

    let htmlRes = "Następujący użytkownicy zostali usunięci: ";
    for (each in ids)
        htmlRes += users[ids[each]] + " ";
    res.send(htmlRes);

    // for (each in ids )
    //     console.log(users[ids[each]]);

    for (each in ids.reverse())
        users.splice(ids[each], 1);
});

app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
