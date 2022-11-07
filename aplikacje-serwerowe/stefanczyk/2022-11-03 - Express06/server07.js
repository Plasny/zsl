const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;
const context = require('./data/data07.json');

console.log(context);


app.use(express.static(__dirname + '/static'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs'
}));
app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    res.render('07-index.hbs', context);
});

app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
