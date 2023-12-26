const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get("image");

if (!uuid) {
    window.location.assign("/");
}

const img = document.getElementById("img");
img.src = `/api/images/${uuid}`;

document.getElementById("delete").onclick = () => {
    fetch(`/api/images/${uuid}`, {
        method: "DELETE",
    }).then(() => {
        window.location.replace(document.referrer);
    })
}

document.getElementById("rotate").onclick = () => {
    fetch(`/api/images/${uuid}/rotate`, {
        method: "POST",
    }).then(() => {
        img.src = `/api/images/${uuid}#${Math.random()}`;
    })
}

document.getElementById("flip-h").onclick = () => {
    fetch(`/api/images/${uuid}/flipX`, {
        method: "POST",
    }).then(() => {
        img.src = `/api/images/${uuid}#${Math.random()}`;
    })
}

document.getElementById("flip-v").onclick = () => {
    fetch(`/api/images/${uuid}/flipY`, {
        method: "POST",
    }).then(() => {
        img.src = `/api/images/${uuid}#${Math.random()}`;
    })
}

const cropBtn = document.getElementById("crop");
let clicks, img_x, img_y, img_x2, img_y2, a = {};
cropBtn.onclick = () => {
    clicks = 0;
    img.removeEventListener("click", imgCrop);
    img.removeEventListener("mousemove", getImgXY);

    img.addEventListener("click", imgCrop);
    img.addEventListener("mousemove", getImgXY);
}


let areaEl;

function imgCrop(e) {
    clicks++;

    if (clicks == 1) {
        areaEl = document.createElement("div");
        areaEl.style.position = "absolute";
        areaEl.style.border = "4px dashed blue";
        areaEl.style.pointerEvents = "none";
        areaEl.style.background = "#00f4"
        a.x = e.x;
        a.y = e.y;
        img.parentNode.append(areaEl);

        img_x2 = img_x;
        img_y2 = img_y;
    } else if (clicks == 2) {
        img.removeEventListener("click", imgCrop);
        img.removeEventListener("mousemove", getImgXY);
        a = {};

        const area = new cropArea(img_x, img_y, img_x2, img_y2);
        if (confirm("crop?")) {
            fetch(`/api/images/${uuid}/crop`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(area),
            }).then(() => {
                img.src = `/api/images/${uuid}#${Math.random()}`;
            })
        }

        areaEl.remove();
    }
}

const getImgXY = e => {
    const rect = img.getBoundingClientRect();
    const yRatio = img.naturalHeight / img.height;
    const xRatio = img.naturalWidth / img.width;

    img_x = e.x < rect.left
        ? 0
        : e.x > rect.right
            ? Math.round((rect.right - rect.left) * xRatio)
            : Math.round((e.x - rect.left) * xRatio)

    img_y = e.y < rect.top
        ? 0
        : e.y > rect.bottom
            ? Math.round((rect.bottom - rect.top) * yRatio)
            : Math.round((e.y - rect.top) * yRatio)

    if (img_x > img.naturalWidth)
        img_x = img.naturalWidth;

    if (img_y > img.naturalHeight)
        img_y = img.naturalHeight;

    draw(e);
}

const draw = e => {
    if (!a || !areaEl) return;

    if (a.x > e.x) {
        areaEl.style.left = e.x + "px";
        areaEl.style.width = (a.x - e.x) + "px";
    } else {
        areaEl.style.left = a.x + "px";
        areaEl.style.width = (e.x - a.x) + "px";
    }
    if (a.y > e.y) {
        areaEl.style.top = e.y + "px";
        areaEl.style.height = (a.y - e.y) + "px";
    } else {
        areaEl.style.top = a.y + "px";
        areaEl.style.height = (e.y - a.y) + "px";
    }

}

class cropArea {
    constructor(x1, y1, x2, y2) {
        if (y1 <= y2) {
            this.top = y1;
            this.bottom = y2;
        } else {
            this.top = y2;
            this.bottom = y1;
        }

        if (x1 >= x2) {
            this.right = x1;
            this.left = x2;
        } else {
            this.right = x2;
            this.left = x1;
        }
    }
}
