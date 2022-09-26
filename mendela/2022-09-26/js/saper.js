let container = document.createElement("div");  // utworzenie elementu
container.classList.add("container");           // dodanie klasy
document.body.appendChild(container);           // dodanie elementu do html-a

createForm();
setInterval(checkForm, 1000);

document.getElementsByName("submit")[0].onclick = function () {
    let height = document.getElementsByName("Height")[0].value;
    let width = document.getElementsByName("Width")[0].value;
    let mines = document.getElementsByName("Mines")[0].value;


    if (!(height.length&&width.length&&mines.length)) {
        alert("Uzupełnij wszystkie pola!")
    } else {
        // delete other boards
        if(document.getElementsByClassName("saper")[0]) {
            document.getElementsByClassName("saper")[0].remove();
            clearInterval(timerInterval);
        }

        // console.log(`h: ${height}\nw: ${width}\nm: ${mines}`);
        displayBoard = boardGen(height, width);
        time = 0;
        mines_left = mines;

        if(width*height <= mines)
            alert("Za dużo min ;)");
        else {
            run = true;

            let board = minesBoard(height, width, mines);
            gameBoard(height, width, displayBoard, board, mines);
            timerInterval = setInterval( function () {timer()}, 1000);
        }

    }
}

// ------------------------------------------------------------ 

// TODO: flagi, oznaczone bomby, zwycięstwo