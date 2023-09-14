let type;
let color;
let selected;

window.addEventListener('load', () => {
    document.getElementById('typeSelect').addEventListener('change', (e) => {
        type = e.target.options[e.target.selectedIndex].value;
    });

    document.getElementById('colorSelect').addEventListener('change', (e) => {
        color = e.target.options[e.target.selectedIndex].value;
    });

    document.getElementById('idSelect').addEventListener('change', (e) => {
        selected = e.target.options[e.target.selectedIndex].value;
    });
});

function postData(url, body) {
    console.log(JSON.stringify(body));

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

async function drawAnimalsTab(res) {
    const tab = document.getElementById('idSelect');
    res = await res.json();


    tab.innerHTML = '';
    for (const el of res) {
        const option = document.createElement('option');
        option.value = el.id;
        option.innerText = el.id + ' -> ' + el.animal.type + ' ' + el.animal.color;
        tab.append(option);
    }

    alert(JSON.stringify(res, null, 5));
}

function addOne() {
    postData('/addOne', { type: type, color: color }).then(drawAnimalsTab);
}

function delOne() {
    postData('/delOne', { id: selected }).then(drawAnimalsTab);
}

function updateOne() {
    if (selected === undefined) {
        alert("Wybierz jakie element chcesz zmodyfikować");
        return;
    }

    postData('/updateOne', { id: selected, type: type, color: color }).then(drawAnimalsTab);
}

function getAll() {
    fetch('/getAll').then(drawAnimalsTab);
}
