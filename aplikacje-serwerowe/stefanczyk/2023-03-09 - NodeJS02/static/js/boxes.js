const clientEl = document.getElementById('client');
const serverEl = document.getElementById('server');
let obj = { start: {}, end: {} };

clientEl.addEventListener('mousedown', (e) => {
    obj.start.x = e.layerX;
    obj.start.y = e.layerY;
});

clientEl.addEventListener('mouseup', (e) => {
    obj.end.x = e.layerX;
    obj.end.y = e.layerY;

    drawBox(clientEl, obj);

    fetch('/boxes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(res => { 
            console.log(res);
            drawBox(serverEl, res); 
        });
});

function drawBox(parent, obj) {
    let div = document.createElement('div');
    if (obj.start.x < obj.end.x) {
        div.style.left = obj.start.x + 'px';
        div.style.width = obj.end.x - obj.start.x + 'px';

        if (obj.start.y < obj.end.y) {
            div.style.top = obj.start.y + 'px';
            div.style.height = obj.end.y - obj.start.y + 'px';
        } else {
            div.style.top = obj.end.y + 'px';
            div.style.height = obj.start.y - obj.end.y + 'px';
        }
    } else {
        div.style.left = obj.end.x + 'px';
        div.style.width = obj.start.x - obj.end.x + 'px';

        if (obj.start.y < obj.end.y) {
            div.style.top = obj.start.y + 'px';
            div.style.height = obj.end.y - obj.start.y + 'px';
        } else {
            div.style.top = obj.end.y + 'px';
            div.style.height = obj.start.y - obj.end.y + 'px';
        }
    }
    parent.append(div);
}
