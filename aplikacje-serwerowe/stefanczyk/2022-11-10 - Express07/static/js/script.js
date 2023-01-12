let change = false;

/*
let table = document.getElementById("table");
let list = document.getElementById("list");
document.getElementById("change").addEventListener("click", function () {
    if(change) {
        change = false;
        table.style.display = "block";
        list.style.display = "none";
    } else {
        change = true;
        table.style.display = "none";
        list.style.display = "";
    }
});
// */

let children = Array.from(document.getElementsByClassName("t"));
document.getElementById("change").addEventListener("click", function () {
    if(change) {
        change = false;
        children.forEach(element => {
            element.style.display = "block";
        });
    } else {
        change = true;
        children.forEach(element => {
            element.style.display = "inline-block";
        });
    }
});
