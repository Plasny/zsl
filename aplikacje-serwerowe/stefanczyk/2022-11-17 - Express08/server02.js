const Datastore = require('nedb')
const express = require('express')
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;

const co1 = new Datastore({
    filename: __dirname + '/db/kolekcja02.db',
    autoload: true
});

const context = {
    title: "NEDB-test",
    vehicleData: ['ubezpieczony', 'benzyna', 'uszkodzony', 'napęd 4x4']
}


app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        ifX: (v1, v2, item) => {
            if (v1 == v2)
                return item.fn(this);
            return item.inverse(this);
        }
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    let resData = context;

    co1.find({}, function (err, docs) {
        resData.docs = docs;
        res.render('form.hbs', resData);
    });
});

app.post('/', function (req, res) {
    let dbData = {};
    let resData = context;
    let reqData = req.body.data;
    let id = req.body.id;

    switch (req.body.operation) {
        case 'add':
            context.vehicleData.forEach(el => dbData[el] = "NIE");
            // console.log(reqData);

            if (reqData !== undefined) {
                if (typeof reqData === 'string')
                    dbData[reqData] = 'TAK';
                else
                    reqData.forEach(el => dbData[el] = 'TAK');
            }

            co1.insert(dbData, function (err, newDoc) {
                // console.log(newDoc)
                co1.find({}, function (err, docs) {
                    resData.docs = docs;
                    res.render('form.hbs', resData);
                });
            });
            break;

        case 'del':
            co1.remove({ _id: id }, {}, function () {
                co1.find({}, function (err, docs) {
                    resData.docs = docs;
                    res.render('form.hbs', resData);
                });
            });
            break;

        case 'update':
            let body = req.body;
            delete body.operation;
            delete body.id;
            co1.update({ _id: id }, { $set: body }, {}, function (err, numUpdated) {
                co1.find({}, function (err, docs) {
                    resData.docs = docs;
                    res.render('form.hbs', resData);
                });
            });
            break;

        default:
            co1.find({}, function (err, docs) {
                resData.docs = docs;
                res.render('form.hbs', resData);
            });
    }
})

app.get('/editCar', function (req, res) {
    let resData = context;
    let id = req.query.id;

    co1.find({}, function (err, docs) {
        resData.docs = docs;
        resData.id = id;
        res.render('editForm.hbs', resData);
    });
});


app.listen(PORT, function () {
    console.log('App running on port: ' + PORT);
});
