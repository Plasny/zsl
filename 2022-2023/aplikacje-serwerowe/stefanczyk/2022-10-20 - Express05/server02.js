const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;

app.use(express.static(__dirname + '/static'));
app.engine('hbs', hbs({defaultLayout: 'main.hbs'}));
app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    const context = {
        title: "server02",
        subject: "Ćwiczenie 2 - podstawowy context",
        content:"TREŚĆ",
        footer: "STOPKA"
    }
    res.render('02-index.hbs', context);
});


app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
