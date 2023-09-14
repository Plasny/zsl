$(document).ready(function () {
    $("#add").on("click", function () {
        let value = $("#select").val()

        for (let i = 0; i < value; i++) {
            let counter = 0;
            let add_child = $(`<button>`)
                .addClass("add_child")
                .on("click", function () {
                    counter++
                    $(this).html(counter)
                    let child = $("<div>")
                        .addClass("child")
                        .html("child")
                        .on("click", function () {
                            counter--
                            $(this).remove()
                        })
                    $(child).insertAfter($(this).next())
                })
            let del_parent = $(`<button>`)
                .addClass("del_item")
                .on("click", function () {
                    $(this).parent().remove()
                })
            let dv = $(`<div>`)
                .addClass("container")
                .html(`parent${i}`)
                .append(add_child)
                .append(del_parent)
            $("#main").append(dv)
        }

    })
    $("#del").on("click", function () {
        $("#main").empty()
    })
})
