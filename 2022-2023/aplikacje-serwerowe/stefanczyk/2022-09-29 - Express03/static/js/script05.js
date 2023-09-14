let divSize = 40;

$(document).ready(function () {
    $("#lContent").on("mousedown", function (e) {
        let x = e.clientX - parseInt($(this).offset().left);
        let y = e.clientY - parseInt($(this).offset().top);
        let ts = Date.now();

        let circle = $("<div>")
            .addClass("round red")
            .html(`<p>${x}<br>${y}</p>`)
            .css({
                left: x - divSize/2,
                top: y - divSize/2,
            });

        $(this).append(circle);

        $.ajax({
            url: "/post",
            contentType: 'application/json',
            type: "POST",
            data: JSON.stringify({
                x: x,
                y: y
            }),
            success: function (data) {
                let circle = $("<div>")
                    .addClass("round black")
                    .html(`<p>${data.ts - ts}</p>`)
                    .css({
                        left: data.x - divSize/2,
                        top: data.y - divSize/2,
                    });

                $("#rContent").append(circle);

                console.log(data)
                console.log(ts)
            }
        });
    });
});
/*
    $.ajax({
        url: "/post",
        contentType: 'application/json',
        data: JSON.stringify({
            a: parseFloat($("#a").val()),
            b: parseFloat($("#b").val())
        }),
        type: "POST",
        success: function (data) {
            console.log(data);
            alert(`suma: ${data.suma}\niloczyn: ${data.iloczyn}`);
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        },
    });
//*/
