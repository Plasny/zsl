$(document).ready(function () {
    /*
    // Wyznaczenie koordynatów kiedy mysz jest kliknięta
    $(window).on("mousedown", function (mouse) {
        console.log("x: " + mouse.clientX + ", y: " + mouse.clientY)
    })
    // Wyznaczenie koordynatów kiedy mysz jest odkliknięta
    $(window).on("mouseup", function (mouse) {
        console.log("x: " + mouse.clientX + ", y: " + mouse.clientY)
    })

    // Wyznaczenie koordynatów kiedy mysz się porusza
    $(window).on("mousemove", function (mouse) {
        console.log("x: " + mouse.clientX + ", y: " + mouse.clientY)
    })
    // */
    
    $("#move").on("mousemove", function (e) {
        let x = e.clientX - $("#move").offset().left
        let y = e.clientY - $("#move").offset().top
        $("#where").html("x: "+x+" ,y: "+y)
    })
    $("#move").on("mousedown", function (e) {
        $("#where").css("background-color","white")
    })
    $("#move").on("mouseup", function (e) {
        $("#where").css("background-color","black")
    })
})