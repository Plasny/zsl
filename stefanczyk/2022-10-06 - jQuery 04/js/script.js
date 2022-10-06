let imgSize = 100;

let planetNu = 0;
let stepsNu = 0;
let tab = [];

let jumpingFlag = false;
let flyingFlag = false;

/**
 * Function that teleports rocket to the next planet
 */
function teleportRocket () {
    if(stepsNu >= tab.length)
        stepsNu = 0;


    $("#rocket")
        .css({
            position: 'absolute',
            left: tab[stepsNu].x - 30,  // image width = 60 => 60/2 = 30
            top: tab[stepsNu].y - 50
        });

    stepsNu++;
}

/**
 * Function for flight animation using setInterval
 * @param {(x: Number, y: Number)} vector - vector for which to move image 
 */
function flightAnimation (vector) {
    let progress = 0;

    let tmpInterval = setInterval(function () {
        progress++;

        let x = $("#rocket").offset().left;
        let y = $("#rocket").offset().top;
        x += vector.x;
        y += vector.y;
        // console.log(`x:${x}, y:${y}`)

        $("#rocket").offset({left: x, top: y});

        if (progress > 100)
            clearInterval(tmpInterval);
    }, 10);
}

/**
 * Function that makes rocket fly, but in very strange direction 
 */
function flyRocket () {
    if(stepsNu >= tab.length)
        stepsNu = 0;

    let divider = 100;
    vector = getVector(divider, divider);

    flightAnimation(vector);

    stepsNu++;
}

/**
 * Function that stops rocket from moving
 */
function stopRocket () {
    if(jumpingFlag || flyingFlag) {
        jumpingFlag = false;
        flyingFlag = false;
        clearInterval(movement);
        // console.log("stopped");
    }
}

/**
 * Function which return vector for image movement
 * @param {Number} dividerX number for which vector is divided in x-axis
 * @param {Number} dividerY number for which vector is divided in y-axis
 * @returns {(x: Number, y: Number)}
 */
function getVector (dividerX, dividerY) {
    // statement ? if true : if false
    // stepsNu+1>=tab.length ? nextStep=0 : nextStep=stepsNu+1;
    stepsNu-1<0 ? prevStep=tab.length-1 : prevStep=stepsNu-1;

    let vector = {
        x: (tab[stepsNu].x - tab[prevStep].x) / dividerX,
        y: (tab[stepsNu].y - tab[prevStep].y) / dividerY
    }

    return vector
}

$(document).ready(function () {
    $("#main").on("mousedown", function (e) {
        let x = e.clientX;
        let y = e.clientY;
        tab.push({x: x, y: y});
        // console.table(tab);

        let planet = $("<div>")
            .text(planetNu)
            .css({
                'text-align': 'center',
                'font-size': '32px',
                'line-height': imgSize+'px',
                color: "white",
                'background-image': 'url(img/planet.png)',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-size': 'cover',
                height: `${imgSize}px`,
                width: `${imgSize}px`,
                position: "absolute",
                left: x - imgSize/2,
                top: y - imgSize/2
            });

        $(this).append(planet);

        planetNu++;
    });

    $("#steps").on("click", function () {
        stopRocket();
        teleportRocket();
    });

    $("#jumping").on("click", function () {
        stopRocket();

        jumpingFlag = true;
        movement = setInterval(teleportRocket, 1000);
    });

    $("#fly").on("click", function () {
        stopRocket();

        flyingFlag = true;
        movement = setInterval(flyRocket, 1000);
    });

});
