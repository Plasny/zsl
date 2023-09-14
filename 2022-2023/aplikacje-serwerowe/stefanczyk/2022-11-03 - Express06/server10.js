const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;
const context = require('./data/data10.json');


app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/static'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    helpers: {
        shortText: (text) => { return text.substring(0, 10) + "..."; },
        capitalLetter: (text) => {
            let t = text.split(' ');
            // console.log(t)
            t.forEach((element, index) => {
                t[index] = element.charAt(0).toUpperCase() + element.toLowerCase().slice(1)
            });
            // console.log(t);
            return t.join(' ');
        },
        dashes: (text) => {
            let t = text.split(' ');
            t.forEach((element, index) => {
                t[index] = element.split('').join('-')
            });
            return t.join(' ');
        }
    }
}));


app.get('/', function (req, res) {
    if (req.query.text !== undefined) {
        context.text = req.query.text;
    }

    console.log(context);
    res.render('10-index.hbs', context);
});


app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
