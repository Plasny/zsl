const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;

const context = {
    title: "server03",
    subject: "ćwiczenie 3 - dane z tablicy obiektów",
    books: [
        { title: "Lalka", author: "B Prus", lang: "PL" },
        { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
        { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
        { title: "Dwór mgieł i furii", author: "S.J. Maas", lang: "CZ" }
    ]
}

app.use(express.static(__dirname + '/static'));
app.engine('hbs', hbs({defaultLayout: 'main.hbs'}));
app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    res.render('03-index.hbs', context);
});


app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
