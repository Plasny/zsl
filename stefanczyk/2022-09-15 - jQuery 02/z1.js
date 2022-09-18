$(document).ready(function () {
    $("#add").on("click", function () {
        let value = $("#select").val()

        for (let i = 0; i < value; i++) {
            let dv = $(`<div>`)
                .html(i)
                .addClass("menu")
                .on("click", function() {
                    let co = confirm('Czy usunąć ten obiekt?')
                    if(co)
                        $(this).remove()
                    // console.log($(this).width())
                })
             $("#main").append(dv)
        }

    })
    $("#del").on("click", function () {
        $("#main").empty()
    })
})