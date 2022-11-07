const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;

const context = {
    title: "server04",
    subject: "ćwiczenie 4 - dane z tablicy, select",
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
    res.render('04-index.hbs', context);
});

app.get('/handle', function (req, res) {
    let field = req.query.field;
    let response = {
        title: context.title,
        subject: context.subject,
    };

    if (field === undefined) {
        // console.log("no option selected");
        response.books = ["nie wybrano opcji w select"];
    } else {
        response.books = [];
        for(let i in context.books){
            // console.log(context.books[i][field]);
            response.books[i] = context.books[i][field];
        }
    }

    res.render('04-handle.hbs', response);
});


app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
