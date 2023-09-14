const path = require("path");
const express = require('express');
const hbs = require('express-handlebars');
const cookieparser = require("cookie-parser");
const nocache = require("nocache");
const fs = require('./fileSystem');
const formidable = require('formidable');
const { exit } = require("process");
const app = express();
const PORT = 5555;

let users = [];

app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    views: path.join(__dirname, '/views'),
    partialsDir: path.join(__dirname, '/views/partials'),
    helpers: {
        getExt: (fileName) => {
            let fileArray = fileName.split('.');
            let ext = fileArray[fileArray.length - 1];
            for (let testExt of ['gif', 'html', 'jpeg', 'jpg', 'pdf', 'png', 'txt', 'zip']) {
                if (testExt == ext)
                    return ext;
            }

            return 'other';
        },
        checkRoot: (path) => {
            return path == '/' ? '' : path;
        }
    }
}));

app.use([
    cookieparser(),
    nocache(),
    // express.urlencoded({ extended: true }),
    express.json({ extended: true, limit: '512mb' }),
    express.static(path.join(__dirname, '/static')),
]);

app.set('view engine', 'hbs');


app.get('/', function (req, res) {
    res.redirect('/filemanager');
});

app.get('/login', function (req, res) {
    res.render('login', { layout: 'userActions' });
});

app.post('/login', function (req, res) {
    const form = formidable({});

    form.parse(req, (err, fields) => {
        if (err) console.error(err);

        if (users.find(el => el.userName === fields.user && el.password === fields.pass)) {
            res.cookie("login", fields.user, { httpOnly: true, maxAge: 300 * 1000 }); // testowe 30 sekund
            res.send(JSON.stringify('ok'));
        }

        res.send(JSON.stringify('Zła nazwa użytkownika lub hasło'));
    });

});

app.get('/logout', function (req, res) {
    res.clearCookie("login");
    res.redirect("/login");
});

app.get('/register', function (req, res) {
    res.render('register', { layout: 'userActions' });
});

app.post('/register', function (req, res) {
    const form = formidable({});

    form.parse(req, (err, fields) => {
        if (err) console.error(err);

        if(fields.user.length < 3) {
            res.send(JSON.stringify('username to short (min len 3)'));
            return;
        }

        const userNames = users.map(x => x.userName);
        if (userNames.indexOf(fields.user) !== -1) {
            res.send(JSON.stringify('username taken'));
            return;
        }

        users.push({ userName: fields.user, password: fields.pass });
        res.send(JSON.stringify('ok'));
    });
});

app.get('/filemanager', function (req, res) {
    if (!isUser(req, res)) return;

    const dir = req.query.p ? req.query.p : '/';

    const resData = new fs.FilemanagerCtx(dir, function () {
        resData.set('title', 'FILEMANAGER');
        // console.log(resData);

        res.render('filemanager', resData);
    });
});

app.post('/del', function (req, res) {
    if (!isUser(req, res)) return;

    const relativePath = path.join(req.body.path, req.body.name);

    fs.del(relativePath, function () {
        res.sendStatus(200);
    });
});

app.post('/add', function (req, res) {
    if (!isUser(req, res)) return;

    fs.addFile(req.body.type, req.body.path, req.body.name, function () {
        res.sendStatus(200);
    });
});

app.post('/rename', function (req, res) {
    if (!isUser(req, res)) return;

    const basePath = fs.getBasePath();
    const filePath = path.join(basePath, req.body.path);
    const oldPath = path.join(filePath, req.body.oldName);

    fs.rename(oldPath, filePath, req.body.newName, function () {
        res.sendStatus(200);
    });
});

app.post('/upload', function (req, res) {
    if (!isUser(req, res)) return;

    const basePath = fs.getBasePath();
    const form = formidable({
        multiples: true,
        keepExtensions: true,
        uploadDir: basePath,
    });

    form.parse(req, (err, fields, files) => {
        if (err) console.error(err);

        if (files.file.length > 1) {
            for (let i in files.file) {
                const file = files.file[i];
                fs.rename(file.filepath, path.join(basePath, fields.path), file.originalFilename, function () {
                    if (i == files.file.length - 1)
                        res.redirect('/filemanager?p=' + fields.path);
                });
            }
        }
        else {
            const file = files.file;
            fs.rename(file.filepath, path.join(basePath, fields.path), file.originalFilename, function () {
                res.redirect('/filemanager?p=' + fields.path);
            });
        }
    });
});


app.get('/editor', function (req, res) {
    if (!isUser(req, res)) return;

    const file = req.query.p;

    if (!ifImg(file)) {
        const resData = new fs.EditorCtx(file, function () {
            res.render('editor', resData);
        });
        return;
    }

    res.render('imgEdit', {
        navItems: [
            { url: '/filemanager', name: 'FILEMANAGER' },
        ],
        imgEditor: true,
        fileName: file,
        filter: [
            { name: "none", filter: "none" },
            { name: "invert", filter: "invert()" },
            { name: "hue", filter: "hue-rotate(90deg)" },
            { name: "contrast", filter: "contrast(300%)" },
            { name: "grayscale", filter: "grayscale(90%)" },
            { name: "blur", filter: "blur(5px)" },
        ]
    });
});

app.post('/editor', function (req, res) {
    if (!isUser(req, res)) return;

    const path = req.body.path;
    const data = req.body.content;
    fs.saveFileContents(path, data, function () {
        res.sendStatus(200);
    });
});

app.get('/editorSettings', function (req, res) {
    if (!isUser(req, res)) return;

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(fs.getEditorConfig()));
});

app.post('/editorSettings', function (req, res) {
    if (!isUser(req, res)) return;

    if (req.body != undefined) {
        const config = JSON.stringify(req.body, null, 2);
        fs.saveEditorConfig(config, function () {
            res.sendStatus(200);
        });
    }
});

app.post('/imgoverwrite', function (req, res) {
    if (!isUser(req, res)) return;

    if (req.body != undefined) {
        const path = req.body.path;
        let base64String = req.body.fileEncoded;
        base64String = base64String.split(';base64,').pop();

        fs.imgoverwrite(path, base64String, function () {
            res.sendStatus(200);
        });
    }
});

app.get('/preview', function (req, res) {
    if (!isUser(req, res)) return;

    const file = req.query.p;
    const base = fs.getBasePath();

    res.sendFile(path.join(base, file));
});

app.listen(PORT, function () {
    console.log('App running on port: ' + PORT);
});

function ifImg(path) {
    const arr = path.split('.');
    const ext = arr.pop();

    for (const el of ["png", "jpg", "jpeg"]) {
        if (ext == el) return true;
    }

    return false;
}

function isUser(req, res) {
    const user = req.cookies.login;
    const userNames = users.map(x => x.userName);

    if (userNames.indexOf(user) === -1) {
        res.redirect('/login');
        return false;
    }

    return true;
}
