const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;
const context = require('./data/data11.json');


app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/static'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: "views/partials"
}));


app.get('/', function (req, res) {
    res.render('11-index.hbs', context);
});


app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
