const serverURL = '/';
const default_map = () => map = {
    size: 6,
    level: []
};
const minSize = 3;
const maxSize = 12;

var dirInFlag = false;
var sizeSelect;
var map = default_map();

function autoDirIn() {
    let btn = document.getElementById('dirIn');

    if (dirInFlag) {
        dirInFlag = false
        btn.innerHTML = 'AUTO DIRIN [ALFA] - <span style="color:red">OFF</span>'
        btn.classList.toggle('goEnable');
        return;
    }

    dirInFlag = true
    btn.innerHTML = 'AUTO DIRIN [ALFA] - <span style="color:green">ON</span>'
    btn.classList.toggle('goEnable');
}

function setSize() {
    map = default_map();
    map.size = parseInt(sizeSelect.value);

    displayMapJSON();
    drawMap();
}

async function loadMap() {
    const res = await fetch(serverURL, { 'method': 'post' });
    map = await res.json();
    sizeSelect.value = map.size;

    displayMapJSON();
    drawMap();
}

function saveMap() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch(serverURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(map)
    })
        .then(() => console.info('data saved'))
        .catch(err => console.error(err));
}

function displayMapJSON() {
    const json = JSON.stringify(map, null, 2);
    document.getElementsByClassName('json')[0].innerText = json;
}

function divHex(h, x, z) {
    let rotation = -1;
    const id = z * map.size + x;
    const hexHeight = h;
    const hexWidth = hexHeight / Math.sqrt(3); // z przekształconego wzoru na wysokość trójkąta równobocznego

    let hex = document.createElement('div');
    hex.classList.add('hex');
    hex.style.height = hexHeight + 'px';
    hex.style.width = hexWidth + 'px';
    hex.style.left = hexWidth / 2.5 + hexWidth * 1.55 * x + 'px';
    hex.style.top = x % 2 == 0
        ? hexHeight * z * 1.025 + 'px'
        : hexHeight * z * 1.025 + hexHeight / 2 + 'px';

    let arrow = document.createElement('p');
    arrow.style.fontSize = hexHeight / 3 + 'px';
    hex.append(arrow);

    let text = document.createElement('p');
    text.style.fontSize = hexHeight / 3 + 'px';
    hex.append(text);

    hex.addEventListener('click', () => {
        rotation++;
        if (rotation == 6)
            rotation = 0;

        hex.style.transform = `rotate(${rotation * 60}deg)`;
        // arrow.innerHTML = "&#xf062;";    // font awesome arrow
        arrow.innerHTML = "&uarr;";      // utf-8 arrow
        text.innerText = rotation;

        // * better dirIn exceptions
        const opposite = rotation + 3 >= 6 ? rotation - 3 : rotation + 3;
        if(dirInFlag) {
            var betterDirIn;
            let tests;
            if (x % 2 == 0) {
                // wyżej
                tests = [
                    { pos: id - map.size, dirOut: 3 },
                    { pos: id - map.size + 1, dirOut: 4 },
                    { pos: id + 1, dirOut: 5 },
                    { pos: id + map.size, dirOut: 0 },
                    { pos: id - 1, dirOut: 1 },
                    { pos: id - map.size - 1, dirOut: 2 }
                ];
            } else {
                // niżej
                tests = [
                    { pos: id - map.size, dirOut: 3 },
                    { pos: id + 1, dirOut: 4 },
                    { pos: id + map.size + 1, dirOut: 5 },
                    { pos: id + map.size, dirOut: 0 },
                    { pos: id + map.size - 1, dirOut: 1 },
                    { pos: id - 1, dirOut: 2 }
                ];
            }
            tests.forEach((test, index) => {
                let otherHex = map.level.find(el => el.id == test.pos && el.dirOut == test.dirOut)
                if (otherHex != undefined)
                    betterDirIn = index;
            });
            if (betterDirIn == undefined) betterDirIn = opposite;
        }

        const obj = {
            id: id,
            x: x,
            z: z,
            dirIn: dirInFlag ? betterDirIn : opposite,
            dirOut: rotation,
            type: "wall"
        };

        const index = map.level.findIndex(el => el.id == id);
        if (index == -1)
            map.level.push(obj);
        else
            map.level.splice(index, 1, obj);
        displayMapJSON();
    });

    // Map loading
    const obj = map.level.find(el => el.id == z * map.size + x)
    if (obj != undefined) {
        hex.style.transform = `rotate(${obj.dirOut * 60}deg)`;
        // arrow.innerHTML = "&#xf062;";
        arrow.innerHTML = "&uarr;";      // utf-8 arrow
        text.innerText = obj.dirOut;
    }

    document.getElementById('board').append(hex);
}

function drawMap() {
    let board = document.getElementById('board');
    let height = window.innerHeight * 0.75 / map.size;
    let width = height / Math.sqrt(3);

    board.style.height = map.size * height + 0.5 * height + 'px';
    board.style.width = map.size * width * 1.5 + width / 2 + 'px';
    board.innerHTML = "";

    for (let z = 0; z < map.size; z++) {
        for (let x = 0; x < map.size; x++) {
            divHex(height, x, z);
        }
    }
}

window.addEventListener('load', function () {
    sizeSelect = document.getElementById('size');
    for (let i = minSize; i <= maxSize; i++) {
        let o = document.createElement('option');
        o.innerText = i;
        sizeSelect.appendChild(o);
    }
    sizeSelect.value = map.size;
    sizeSelect.addEventListener('input', setSize);
    displayMapJSON();
    drawMap();

    document.getElementById('dirIn').addEventListener('click', autoDirIn);
    document.getElementById('boardReset').addEventListener('click', setSize);
    document.getElementById('load').addEventListener('click', loadMap);
    document.getElementById('save').addEventListener('click', saveMap);
});
