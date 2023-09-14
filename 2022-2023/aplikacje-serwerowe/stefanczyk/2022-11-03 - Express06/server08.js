const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;
const context = require('./data/data08.json');


app.use(express.static(__dirname + '/static'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs'
}));
app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    res.render('08-index.hbs', context);
});


app.listen(PORT, function () {
    console.log(context);
    console.log('Server running on port ' + PORT);
});
