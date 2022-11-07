$(document).ready(function() {
    $("#klik").on("click", function () {
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
    })
});
