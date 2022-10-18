function keyPress(e) {
    // console.log(e);
    // console.log(e.code);
    // console.log(e.keyCode);

    switch(e.code) {
        case "KeyW":
        case "ArrowUp": 
            snakeDirection = "up";
            break;
        case "KeyS":
        case "ArrowDown": 
            snakeDirection = "down";
            break;
        case "KeyA":
        case "ArrowLeft": 
            snakeDirection = "left";
            break;
        case "KeyD":
        case "ArrowRight": 
            snakeDirection = "right";
            break;
    }
    // console.log(snakeDirection);

    if (started === false) {
        requestAnimationFrame(game);
        started = true;
    }
}

// ---------------------------------------------------------------------------
boardGen();
appleGen()
snakeGen();

document.body.setAttribute("onkeydown", "keyPress(event)");

// ---------------------------------------------------------------------------
// TODO: don't create apples on snake, win
