const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;

const context = {
    title: "server06",
    subject: "ćwiczenie 6 - dane z tablicy, checkboxes",
    fields: [
        { name: "title" },
        { name: "author" },
        { name: "lang" }
    ],
    books: [
        { title: "Lalka", author: "B Prus", lang: "PL" },
        { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
        { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
        { title: "Zamek", author: "F Kafka", lang: "CZ" }
    ]
}

app.use(express.static(__dirname + '/static'));
app.engine('hbs', hbs({defaultLayout: 'main.hbs'}));
app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    res.render('06-index.hbs', context);
});

app.get('/handle', function (req, res) {
    let fields = req.query.field;
    let response = {
        title: context.title,
        subject: context.subject,
    };

    // console.log(fields);

    if (fields === undefined) {
        response.books = ["nie wybrano opcji w select"];
    } else {
        response.books = [];
        for(let i in context.books){
            response.books[i] = [];
            for(let j in fields){
                response.books[i][j] = context.books[i][fields[j]];
            }
            response.books[i] = response.books[i].join(", ");   // not needed just for looks
        }
    }

    console.log(response);
    res.render('04-handle.hbs', response);
});


app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
