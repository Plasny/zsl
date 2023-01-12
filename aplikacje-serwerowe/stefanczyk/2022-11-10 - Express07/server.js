const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;
const data = require('./data/data.json');
let img_url;

app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: 'views/partials',
    helpers: {
        uniqeCategory: function (obj) {
            const set = new Set;

            for (i in obj) {
                set.add(obj[i].category);
            }

            return set;
        },
        getStarsURL: function (url) {
            img_url = url;
            return;
        },
        countStars: function (obj) {
            let set = new Set;

            for (i in obj) {
                set.add(obj[i].stars);
            }

            return set;
        },
        displayStars: function (n) {
            let html = "";
            for (let i = 0; i < n; i++) {
                html += `<img src=${img_url}>`
            }
            return html;
        },
        priceFormat: price => `${price.toFixed(2)} $`
    }
}));
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    res.render('index.hbs', data);
});

app.post('/', function (req, res) {
    let options = req.body;
    let newData = {};
    newData.items = [];

    if (options.category == "ALL") {
        for (item of data.items) {
            if (item.stars == options.stars)
                newData.items.push(item);
        }
    }
    else {
        for (item of data.items) {
            if (item.stars == options.stars)
                if (item.category == options.category)
                    newData.items.push(item);
            // console.log(item)
        }
    }

    res.render('index2.hbs', newData)
});

app.listen(PORT, function () {
    console.log('App running on port: ' + PORT);
});
