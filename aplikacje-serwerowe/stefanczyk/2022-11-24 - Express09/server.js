const express = require('express')
const formidable = require('formidable');
const hbs = require('express-handlebars');
const app = express();
const PORT = 5555;

function getContext() {
    const context = {
        navItems: [
            { url: '/', name: 'UPLOAD' },
            { url: '/filemanager', name: 'FILEMANAGER' },
            { url: '/info', name: 'INFO' },
        ],
        sidenav: {
            title: '',
            links: [
                { url: '', name: '' },
            ],
        },
        form: {},
    }

    return context;
}

// {id, icon, fileName, (path), size, type, (type), (savedate), [show], [info], [download], [delete]}
var fm = [];
var idCount = 1;

const findFile = (id) => {
    for (let file of fm)
        if (file.id == id)
            return file;
    return false;
}

app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        toUnixMillis: (date) => Math.floor(new Date(date).getTime() / 1000),
        getExt: (fileName) => {
            let fileArray = fileName.split('.');
            let ext = fileArray[fileArray.length - 1];
            for (let testExt of ['gif', 'html', 'jpeg', 'pdf', 'png', 'txt', 'zip']) {
                if (testExt == ext)
                    return ext;
            }

            return 'other';
        },
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    let resData = getContext();
    resData.title = 'UPLOAD';
    resData.sidenav.title = 'multiupload';
    resData.sidenav.links = [];
    resData.form.upload = '/';

    res.render('upload.hbs', resData);
});

app.post('/', function (req, res) {
    let form = formidable({});
    form.keepExtensions = true;
    form.multiples = true;
    form.uploadDir = __dirname + '/static/uploads/';

    form.parse(req, function (err, fields, files) {
        if (files.file.length > 1) {
            for (let i in files.file) {
                let file = files.file[i];
                file.id = idCount;
                idCount++;
                fm.push(file);
            }
        }
        else {
            let file = files.file;
            // console.log(file.path.split('/').slice(-2).join('/'))
            file.id = idCount;
            idCount++;
            fm.push(file);
        }

        res.redirect('/filemanager');
    });
});

app.get('/filemanager', function (req, res) {
    let resData = getContext();
    resData.title = 'FILEMANAGER';
    resData.sidenav.title = 'filemanager';
    resData.sidenav.links = [{ url: '/reset', name: 'USUŃ DANE O PLIKACH Z TABLICY' }];
    resData.fm = fm;

    // console.table(fm);
    res.render('filemanager', resData);
});

app.get('/reset', function (req, res) {
    fm = [];
    idCount = 1;

    res.redirect('/filemanager');
});

app.get('/info', function (req, res) {
    let id = req.query.id
    let resData = getContext();
    resData.title = 'SHOW';
    resData.sidenav.title = 'file info';

    if (id != undefined) {
        let file = findFile(id);
        if (file == false)
            res.redirect('/info');
        resData.file = file;

        res.render('info.hbs', resData);
    } else {
        resData.message = `There are ${idCount - 1} file(s) in table.`;

        res.render('info.hbs', resData);
    }
});

app.get('/show', function (req, res) {
    let id = req.query.id

    if (id != undefined) {
        let file = findFile(id);
        let resData = {
            path: '/' + file.path.split('/').slice(-2).join('/')
        };

        if (file == false) {
            res.redirect('/show');
        } else if (file.type.match(/^image\/*/)) {
            resData.layout = null;
            resData.img = true;
        } else if (file.type.match(/^text\/*/)) {
            resData.layout = null;
        } else {
            resData = getContext();
            resData.title = 'SHOW';
            resData.sidenav = null;
            resData.message = 'unsupported file format';

            res.render('error.hbs', resData)
        }

        res.render("show.hbs", resData);
    } else {
        let resData = getContext();
        resData.title = 'SHOW';
        resData.sidenav = null;
        resData.message = 'ERROR! Give correct object id.';

        res.render('error.hbs', resData);
    }
});

app.get('/download', function (req, res) {
    let id = req.query.id

    if (id != undefined) {
        let file = findFile(id);

        if (file == false)
            res.redirect('/download');

        res.download(file.path);
    } else {
        let resData = getContext();
        resData.title = 'DOWNLOAD';
        resData.sidenav = null;
        resData.message = 'ERROR! Give correct object id.';

        res.render('error.hbs', resData);
    }
});

app.get('/delete', function (req, res) {
    let id = req.query.id

    if (id != undefined) {
        let file = findFile(id);

        if (file == false)
            res.redirect('/delete');

        fm.splice(id - 1, 1);
        res.redirect('/filemanager');
    } else {
        let resData = getContext();
        resData.title = 'DELETE';
        resData.sidenav = null;
        resData.message = 'ERROR! Give correct object id.';

        res.render('error.hbs', resData);
    }

});

app.listen(PORT, function () {
    console.log('App running on port: ' + PORT);
});
