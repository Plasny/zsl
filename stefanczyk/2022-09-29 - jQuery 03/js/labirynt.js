let divSize = 50;
let h = 5;
let w = 5;

let board = [];

/**
 * Number of moves made by pawns
 * @type {Number}
 */
let move = 0;

/**
 * Create board with given height and width
 * @param {Number} height board height
 * @param {Number} width board width
 */
function boardGen (height, width) {
    let xPos = 0;
    let yPos = 0;

    let boardDiv = $("<div>")
        .addClass("board");
    boardDiv.appendTo("#main")

    for (let y = 0; y < height; y++){
        yPos += divSize;
        for (let x = 0; x < width; x++){
            xPos += divSize;

            let fieldDiv = $("<div>")
                .addClass("field")
                .css({
                    position: "absolute",
                    left: xPos,
                    top: yPos,
                })
                .on("click", function () {
                    $(this).addClass("clicked");
                    board.push({y:parseInt($(this).position().top), x:parseInt($(this).position().left)})
                    console.table(board);
                });

            fieldDiv.appendTo(boardDiv)
        }
        xPos = 0;
    }
}

/**
 * 
 * @param {Number} [nMove] which move is going to be performed now
 */
function pawnMove (nMove) {
    if (nMove == null) {
        // console.log("null")
        let pawn1 = $("<div>")
            .addClass(["pawn1","green"])
        pawn1.appendTo("#main");
        let pawn2 = $("<div>")
            .addClass(["pawn2","blue"]);
        pawn2.appendTo("#main");

    } else if (nMove == 0) {
        $(".pawn1")
            .css({
                position: "absolute",
                top: board[nMove].y+50,
                left: board[nMove].x,
            })
        $(".pawn2")
            .css({
                position: "absolute",
                top: board[board.length-1-nMove].y+50,
                left: board[board.length-1-nMove].x,
            })
    } else if (nMove%2 != 0) {
        $(".pawn1")
            .css({
                position: "absolute",
                top: board[Math.ceil(nMove/2)].y+50,
                left: board[Math.ceil(nMove/2)].x,
            })
        console.log(Math.ceil(nMove/2))
    } else if (nMove%2 == 0) {
        $(".pawn2")
            .css({
                position: "absolute",
                top: board[board.length-1-parseInt(nMove/2)].y+50,
                left: board[board.length-1-parseInt(nMove/2)].x,
            })
        console.log(nMove/2)
        // console.log("some parameter")
    }

}

$(document).ready(function () {
    boardGen(h, w);
    pawnMove();

    $("#start").on("click", function () {
        pawnMove(move);
    })

    $("#move").on("click", function () {
        move++;
        pawnMove(move);
    })

    $("#reset").on("click", function () {
        board = [];
        move = 0;
        $("#main").empty();
        boardGen(h, w);
        pawnMove();
    })
})
