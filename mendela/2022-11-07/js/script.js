const tabSize = 12;
const amount = 2;
let currentLine;
let count = 0;
let life = 3;

const lines = [
    [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }],
    [{ x: 0, y: tabSize - 4 }, { x: 1, y: tabSize - 3 }, { x: 2, y: tabSize - 2 }, { x: 3, y: tabSize - 1 }],
    [{ x: tabSize - 1, y: 0 }, { x: tabSize - 2, y: 1 }, { x: tabSize - 3, y: 2 }, { x: tabSize - 4, y: 3 }],
    [{ x: tabSize - 1, y: tabSize - 4 }, { x: tabSize - 2, y: tabSize - 3 }, { x: tabSize - 3, y: tabSize - 2 }, { x: tabSize - 4, y: tabSize - 1 }],
]

function createTab() {
    let tab = document.createElement("table");
    for (let y = 0; y < tabSize; y++) {
        let row = document.createElement("tr");
        for (let x = 0; x < tabSize; x++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", `${x}:${y}`);
            row.append(cell);
        }
        tab.append(row);
    }
    document.getElementById("main").append(tab);
}

function setLines() {
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            document.getElementById(`${lines[i][j].x}:${lines[i][j].y}`).classList.add(`line${i}`);
        }
    }
}

function changeLine(lineNu) {
    if (document.getElementsByClassName("current")[0]) {
        document.getElementsByClassName("current")[0].classList.remove("current");
    }

    let x = lines[lineNu][lines[lineNu].length - 1].x;
    let y = lines[lineNu][lines[lineNu].length - 1].y;

    document.getElementById(`${x}:${y}`).classList.add("current");
}

function eggs(i, rand, style) {
    let line;
    if (i == lines[rand].length) {
        i = 0;
        line = (Math.random() * 3).toFixed(0);
        console.log(line)
    } else {
        line = rand;
    }

    if (document.getElementsByClassName(`egg${style}`)[0]) {
        document.getElementsByClassName(`egg${style}`)[0].classList.remove(`egg${style}`);
    }

    // console.log(line);
    document.getElementsByClassName(`line${line}`)[i].classList.add(`egg${style}`);

    if (line == currentLine && i == 3) {
        count++;
        // console.log(count);
        document.getElementById("points").innerText = `Points: ${count}, Życia: ${life}`;
    } else if (line != currentLine && i == 3) {
        life--;
        if (life < 0) {
            alert("Przegrałeś");
            life = 3;
            count = 0;
        }
        document.getElementById("points").innerText = `Points: ${count}, Życia: ${life}`;
    }

    setTimeout(function () { eggs(++i, line, style); }, 1000);
}

window.addEventListener("load", function () {
    createTab();
    setLines();

    for (let i = 0; i < amount; i++) {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `.egg${i} { background-color: black; }`;
        document.getElementsByTagName('head')[0].appendChild(style);

        let rand = (Math.random() * 3).toFixed(0);
        console.log(rand);
        setTimeout(function () { eggs(0, rand, i); }, 1000);
    }
});

window.addEventListener("keypress", function (ev) {
    // console.log(ev.key);
    switch (ev.key) {
        case '1':
        case 'h':
            currentLine = 0;
            break;
        case '2':
        case 'j':
            currentLine = 1;
            break;
        case '3':
        case 'k':
            currentLine = 2;
            break;
        case '4':
        case 'l':
            currentLine = 3;
            break;
    }

    changeLine(currentLine);
    // console.log(currentLine);
});
