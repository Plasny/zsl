// Variable and function declarations and discriptions are stored in ./functions.js 

let container = document.createElement("div");  // utworzenie elementu
container.classList.add("container");           // dodanie klasy
document.body.appendChild(container);           // dodanie elementu do html-a

createForm();
setInterval(checkForm, 1000);

document.getElementsByName("submit")[0].onclick = function () {
    height = document.getElementsByName("Height")[0].value;
    width = document.getElementsByName("Width")[0].value;
    mines = document.getElementsByName("Mines")[0].value;


    if (!(height.length&&width.length&&mines.length)) {
        alert("Uzupełnij wszystkie pola!")
    } else {
        // delete other boards
        if(document.getElementsByClassName("saper")[0]) {
            document.getElementsByClassName("saper")[0].remove();
            clearInterval(timerInterval);
        }

        if(width*height <= mines)
            alert("Za dużo min ;)");
        else {
            // console.log(`h: ${height}\nw: ${width}\nm: ${mines}`);
            displayBoard = boardGen(height, width);
            flags = mines;

            time = 0;
            startTime = new Date();
            // console.log(startTime);

            run = true;

            let board = minesBoard();
            gameBoard(displayBoard, board);
            timerInterval = setInterval( function () {timer()}, 1000);
        }

    }
}
