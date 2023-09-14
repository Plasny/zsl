const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;

app.use(express.static(__dirname + '/static'));
app.engine('hbs', hbs({defaultLayout: 'main.hbs'}));
app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    // res.render('index00.hbs');
    res.render('index00.hbs', {title:'server01'});
    // res.render('index00.hbs', {title:'server01', layout:"other.hbs"});
});

app.get('/index', function (req, res) {
    res.render('01-index.hbs', {title:'server01'});
});
app.get('/login', function (req, res) {
    res.render('01-login.hbs', {title:'server01'});
});

app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
