let l = 5;
let i = 0;
let addition = true;
// let img = document.images[0]

function bigSmall (imgID, step) {
    let imgSize = document.getElementById(imgID).style.height;

    if (i < l && addition) {
        imgSize = (parseInt(imgSize) + step) + "px";
        // console.log("Rozmiar po dodawaniu: " + imgSize);
    } else if (i < l && !(addition)) {
        imgSize = (parseInt(imgSize) - step) + "px";
        // console.log("Rozmiar po odejmowaniu: " + imgSize);
    } else {
        i = 0; addition ? addition=false : addition=true;
        // console.log(addition);
    }

    document.getElementById(imgID).style.height = imgSize;
    i++;
}

setInterval(function () {bigSmall("Docker", 10)}, 100);