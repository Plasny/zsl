let z4div = document.getElementById("z4div").getBoundingClientRect();
let z4img = document.getElementById("z4img");
let x_center = (z4div.right - z4div.left) / 2;
let y_center = (z4div.bottom - z4div.top) / 2;
let r = 80;
let d = 0;
let x, y;

console.log(`Div and circle info:\nx: ${x_center}, y: ${y_center}, r: ${r}`);

setInterval(function () {
    x = r * Math.sin(d * Math.PI/180); // convertion to radians
    y = r * Math.cos(d * Math.PI/180);

    // parseInt(z4img.style.height/width)/2 -> for centering donut
    z4img.style.left = x_center + x - parseInt(z4img.style.width)/2 + "px";
    z4img.style.top = y_center + y - parseInt(z4img.style.height)/2 + "px";

    // console.log(`x: ${x}, y: ${y}`)
    d++;
}, 5);