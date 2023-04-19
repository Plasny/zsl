const fpath = document.getElementById('path').value;

async function postData(url = '.', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    // console.log(response);
    location.reload();
}

function del(fname) {
    if (!confirm(`Czy jesteś pewny, że chcesz usunąć ${fname}`)) {
        return;
    }

    postData('/del', { path: fpath, name: fname });
}

function add(type, fname) {
    postData('/add', { type: type, path: fpath, name: fname });
}

function goTo(path) {
    // console.log(path);
    window.location = window.location.origin + window.location.pathname + "?p=" + path;
}

function edit(path) {
    if (fpath == '/')
        window.location.href = "/editor?p=" + path;
    else
        window.location.href = "/editor?p=" + fpath + path;
}

function preview(path) {
    window.location.href = "/preview?p=" + path;
}

let fileName;
function rename(fname) {
    renameDialog.showModal();
    fileName = fname;
}

renameDialog.addEventListener('submit', (e) => {
    postData('/rename', { path: fpath, oldName: fileName, newName: e.target.fname.value });
});
