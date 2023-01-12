const width = 400;
const height = 400;

function prepare(id, width, height) {
    this.canvas = document.getElementById(id);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");

    this.width = width;
    this.height = height;

    // console.log(this);
}

let canv1 = {
    drawLine: function (lineWidth) {
        let x = Math.random() * this.width;
        let y = Math.random() * this.height;

        this.ctx.beginPath();
        this.ctx.moveTo(this.center.x, this.center.y);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = this.randColor();
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
    },
    init: function () {
        this.center = {};
        this.center.x = width / 2;
        this.center.y = height / 2;
    },
    prep: prepare,
    randColor: () => '#' + Math.floor(Math.random() * 16777215).toString(16)
}

let canv2 = {
    drawCircle: function () {
        this.canvas.addEventListener("mouseenter", () => this.startInterval());
        this.canvas.addEventListener("mousemove", (e) => this.mouseEvent = e);
        this.canvas.addEventListener("mouseleave", () => this.stopInterval());
    },
    init: function (lineWidth, radius) {
        this.ctx.lineWidth = lineWidth;
        this.radius = radius;
        this.ctx.strokeStyle = this.randColor();
    },
    prep: prepare,
    randColor: function () {
        let rgb = [];

        for (let i = 0; i < 3; i++)
            rgb[i] = Math.floor(Math.random() * 255);

        return 'rgba(' + rgb.toString() + ',0.1)';
    },
    startInterval: function () {
        this.interval = setInterval(() => {
            let coo = {};
            coo.x = this.mouseEvent.pageX - this.canvas.offsetLeft;
            coo.y = this.mouseEvent.pageY - this.canvas.offsetTop;
            let start = Math.random() * 2 * Math.PI;

            this.ctx.beginPath();
            this.ctx.arc(coo.x, coo.y, this.radius, start, 0.5 * Math.PI + start);
            this.ctx.stroke();
        }, 10);
    },
    stopInterval: function () {
        clearInterval(this.interval);
    }
}

let canv3 = {
    init: function (size) {
        this.vector = {};
        this.imgW = size * 2;
        this.imgH = size;
        this.x = Math.random() * (this.width - this.imgW);
        this.y = Math.random() * (this.height - this.imgH);

        this.img = new Image();
        this.randImg();
        this.img.onload = () => {
            this.ctx.drawImage(this.img, this.x, this.y, this.imgW, this.imgH);
        }

        this.setVector();
        this.move();
    },
    move: function () {
        this.x += this.vector.x;
        this.y += this.vector.y;

        if (this.x + this.imgW >= this.width || this.x <= 0) {
            this.vector.x = -this.vector.x;
            this.randImg();
        } else if (this.y + this.imgH >= this.height || this.y <= 0) {
            this.vector.y = -this.vector.y;
            this.randImg();
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.img, this.x, this.y, this.imgW, this.imgH);
        requestAnimationFrame(() => this.move());
    },
    prep: prepare,
    randImg: function () {
        let randImg = Math.ceil(Math.random() * 8);
        this.img.src = `./svg/dvdlogo-0${randImg}.svg`;
    },
    setVector: function () {
        let direction = Math.floor(Math.random() * 4);
        switch (direction) {
            case 0:
                this.vector = { x: 1, y: 1 };
                break;
            case 1:
                this.vector = { x: -1, y: 1 };
                break;
            case 2:
                this.vector = { x: -1, y: -1 };
                break;
            default:
                this.vector = { x: 1, y: -1 };
                break;
        }
    },
    stop: function () {
        cancelAnimationFrame(this.frame);
    }
}

window.addEventListener("load", function () {
    canv1.prep("c1", width, height);
    canv1.init();
    setInterval(function () { canv1.drawLine(2) }, 50);

    canv2.prep("c2", width, height);
    canv2.init(4, 40);
    canv2.drawCircle();

    canv3.prep("c3", width, height);
    canv3.init(50);
});
