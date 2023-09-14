const path = document.getElementById("fileName").innerText;
const filtersBtn = document.getElementById("filtersBtn");
const filtersEl = document.getElementById("filters");
const main = document.getElementById("mainIMG");
const canvas = document.getElementById('canvas');
let display = false;

window.addEventListener("load", function () {
    filtersEl.style.display = "none";
    canvasSetup();
});

function filters() {
    if (display) {
        display = false;
        filtersEl.style.display = "none";
    } else {
        display = true;
        filtersEl.style.display = "block";
    }
}

function canvasSetup(filter = "none") {
    canvas.width = main.naturalWidth;
    canvas.height = main.naturalHeight;

    const ctx = canvas.getContext('2d');
    ctx.filter = filter;
    ctx.drawImage(main, 0, 0, canvas.width, canvas.height);
}

function save() {
    canvas.toBlob(blob => {
        // todo add mime type checking for img
        // todo add error checking from server -> file to large or sth
        const mime = '';

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            fetch('/imgoverwrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path: path,
                    mime: mime,
                    fileEncoded: reader.result
                })
            }).then(window.location.reload());
        };
    });
}
