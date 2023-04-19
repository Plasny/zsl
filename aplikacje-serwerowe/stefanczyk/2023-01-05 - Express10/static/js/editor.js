const configUrl = '/editorSettings';
const lineNumbers = document.getElementById("lineNr");
const content = document.getElementById("content");
const saveBtn = document.getElementById("save");
const path = document.getElementById("fileName").innerText;

const step = 3;
let fontSize;
let selectedTheme;
const themes = [
    {
        bgColor: "#000000",
        priColor: "#ffffff",
        secColor: "#ff00ff",
    },
    {
        bgColor: "#ffffff",
        priColor: "#000000",
        secColor: "#5555ff",
    },
];

function lineNumeration() {
    const lines = content.value.split('\n');
    content.rows = lines.length;
    for (const i in lines) {
        const div = document.createElement('div');
        div.innerText = parseInt(i) + 1;
        lineNumbers.append(div);
    }
}

function setColors() {
    content.style.backgroundColor = themes[selectedTheme].bgColor;
    content.style.color = themes[selectedTheme].priColor;
    lineNumbers.style.backgroundColor = themes[selectedTheme].bgColor;
    lineNumbers.style.color = themes[selectedTheme].secColor;
}

function nextColor() {
    selectedTheme++;
    if (selectedTheme >= themes.length) selectedTheme = 0;
    setColors();
}

function setFontSize() {
    content.style.fontSize = fontSize + "px";
    lineNumbers.style.fontSize = fontSize + "px";
}

function increaseFontSize() {
    fontSize += step;
    setFontSize();
}

function decreaseFontSize() {
    fontSize -= step;
    setFontSize();
}

async function postData(url, data) {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function saveConfig() {
    postData(configUrl, {
        fontSize: fontSize,
        theme: selectedTheme,
    })
        .then(alert("Ustawienia edytora zapisane :)"));
}

function preview() {
    window.location.href = `/preview?p=${path}`
}

fetch(configUrl)
    .then(res => res.json())
    .then(res => JSON.parse(res))
    .then(res => {
        fontSize = res.fontSize;
        selectedTheme = res.theme ? res.theme : 0;
        setColors();
        setFontSize();
        // content.style.backgroundColor = res.backgroundColor;
        // content.style.color = res.primaryColor;
        // lineNumbers.style.backgroundColor = res.backgroundColor;
        // lineNumbers.style.color = res.secondaryColor;
    });

content.addEventListener("input", function () {
    lineNumbers.innerHTML = "";
    lineNumeration();
});

saveBtn.addEventListener("click", function (e) {
    e.preventDefault();
    postData('/editor', {
        content: content.value,
        path: path,
    })
        .then(alert("Plik został zapisany na serwerze :)"));
});

window.addEventListener("load", function () {
    lineNumeration();
});
