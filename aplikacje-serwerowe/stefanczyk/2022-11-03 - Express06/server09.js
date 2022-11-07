const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;
const context = require('./data/data09.json');


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
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    res.render('09-index.hbs', context);
});


app.listen(PORT, function () {
    console.log(context);
    console.log('Server running on port ' + PORT);
});
