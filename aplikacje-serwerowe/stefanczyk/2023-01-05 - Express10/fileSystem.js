const fs = require("fs");
const path = require("path");
const filesPath = path.join(__dirname, 'PLIKI');
const editorTemplates = path.join(__dirname, 'config', 'templates');
const editorConfigPath = path.join(__dirname, 'config', 'editorConfig.json');

class FilemanagerContext {
    constructor(folderPath, callback) {
        this.navItems = [
            { url: '/filemanager', name: 'FILEMANAGER' },
            { url: '/logout', name: 'logout' },
        ];

        this.sideNav = {
            buttons: [
                { type: 'dir', name: 'nowy folder', id: 'newDir', dialogText: 'Podaj nazwę nowego folderu' },
                { type: 'file', name: 'nowy plik', id: 'newFile', dialogText: 'Podaj nazwę nowego pliku', info: 'Aktualnie dostępne szablony: css, js, json, html, txt, xml.' },
            ],
            upload: true,
        };

        this.uploadUrl = '/upload';
        this.path = folderPath;

        this.pagination = [{ urlPath: '/', display: '<img src="/img/icon/home.png" alt=".">' }];
        if (folderPath != '/') {
            const pathArr = folderPath.split('/');
            pathArr.shift();

            for (let i = 0; i < pathArr.length; i++) {
                if (pathArr[i] == '') {
                    pathArr.splice(i, 1);
                    i--;
                }
            }

            for (const i in pathArr) {
                let pathTmp = '/';
                for (let j = 0; j <= i; j++) {
                    pathTmp += pathArr[j] + '/';
                }
                this.pagination.push({ urlPath: pathTmp, display: pathArr[i] });
            }
        }
        // console.log(this.pagination);

        this.dirs = [];
        this.files = [];

        const dir = path.join(filesPath, folderPath);
        fs.access(dir, err => {
            if (err) {
                this.error = "Folder nie istnieje";
                callback();
                return;
            }

            fs.readdir(dir, (err, files) => {
                if (err) throw err;

                if (files.length == 0)
                    callback();

                files.forEach((file, i, array) => {
                    const filePath = path.join(filesPath, folderPath, file);

                    fs.lstat(filePath, (err, stats) => {
                        // this.files.push({ name: file, type: getFileType(stats) })
                        switch (getFileType(stats)) {
                            case 'file': this.files.push({ name: file, file: true }); break;
                            case 'dir': this.dirs.push({ name: file }); break;
                        }

                        if (i == array.length - 1)
                            callback();
                    });
                });
            });
        });
    }

    set(key, value) {
        this[key] = value;
    }
}

class EditorContext {
    constructor(filePath, callback) {
        this.navItems = [
            { url: '/filemanager', name: 'FILEMANAGER' },
            { url: '/logout', name: 'logout' },
        ];

        this.editor = true;

        this.fileName = filePath;
        const fullPath = path.join(filesPath, filePath);

        fs.readFile(fullPath, 'utf-8', (err, data) => {
            if (err) {
                this.error = "Podany plik nie istnieje";
                callback();
                return;
            }

            this.data = data;
            callback();
        });
    }
}

function getFileType(fileStats) {
    return fileStats.isDirectory()
        ? 'dir' : fileStats.isFile()
            ? 'file' : fileStats.isSymbolicLink()
                ? 'symlink' : 'other';
}

function deleteFile(rFilePath, callback) {
    const filePath = path.join(filesPath, rFilePath);

    if (!fs.existsSync(filePath)) {
        callback();
        return;
    }

    fs.rm(filePath, { force: true, recursive: true }, (err) => {
        if (err) throw err;
        callback();
    });
}

function createFile(type, relativePath, fileName, callback) {
    const filePath = path.join(filesPath, relativePath, fileName);
    console.log(fileName);

    if (fs.existsSync(filePath)) {
        const newFileArr = fileName.split(".");
        const newFileExt = newFileArr.length > 1 ? '.' + newFileArr.pop() : '';
        const newFileName = newFileArr.toString();
        const name = newFileName + '-' + Date.now() + newFileExt;

        createFile(type, relativePath, name, callback);
        return;
    }

    if (type == 'file') {
        const fileArr = fileName.split(".");
        const fileExt = fileArr.length > 1 ? fileArr.pop() : '';

        fs.readFile(path.join(editorTemplates, fileExt + '.template'), (err, content) => {
            if (!err && content) {
                fs.writeFile(filePath, content, (err) => {
                    if (err) throw err;
                    callback();
                });
            } else {
                fs.writeFile(filePath, '', (err) => {
                    if (err) throw err;
                    callback();
                });
            }
        });
        return;
    }

    if (type == 'dir') {
        fs.mkdir(filePath, (err) => {
            if (err) throw err;
            callback();
        });
        return;
    }
}

function getBasePath() {
    return filesPath;
}

function rename(oldPath, newPath, newName, callback) {
    const newFile = path.join(newPath, newName);

    if (fs.existsSync(newFile)) {
        const newFileArr = newName.split(".");
        const newFileExt = newFileArr.length > 1 ? '.' + newFileArr.pop() : '';
        const newFileName = newFileArr.toString();
        const name = newFileName + '-' + Date.now() + newFileExt;

        rename(oldPath, newPath, name, callback);
        return;
    }

    fs.rename(oldPath, newFile, (err) => {
        if (err) throw err;
        callback();
    });
}

function getEditorConfig() {
    return fs.readFileSync(editorConfigPath, 'utf-8');
}

function saveEditorConfig(data, callback) {
    fs.writeFile(editorConfigPath, data, err => {
        if (err) {
            console.log(err);
        }

        callback();
    });
}

function saveFile(fpath, data, callback) {
    fs.writeFile(path.join(filesPath, fpath), data, callback);
}

function imgoverwrite(fpath, base64String, callback) {
    const fullPath = path.join(filesPath, fpath);
    fs.writeFile(fullPath, base64String, { encoding: 'base64' }, function(){
        callback();
    });
};

module.exports.FilemanagerCtx = FilemanagerContext;
module.exports.EditorCtx = EditorContext;
module.exports.del = deleteFile;
module.exports.addFile = createFile;
module.exports.getBasePath = getBasePath;
module.exports.rename = rename;
module.exports.getEditorConfig = getEditorConfig;
module.exports.saveEditorConfig = saveEditorConfig;
module.exports.saveFileContents = saveFile;
module.exports.imgoverwrite = imgoverwrite;
