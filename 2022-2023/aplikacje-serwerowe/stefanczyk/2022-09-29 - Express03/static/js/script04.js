$(document).ready(function () {
    // on "input" działa przy każdej zmianie wartości danego obiektu, np. przy wpisywaniu wartości
    $("#r1").on("input", function () {
        $.ajax({
            url: "/post",
            contentType: 'application/json',
            type: "POST",
            data: JSON.stringify({
                val: $(this).val()
            }),
            success: function (data) {
                $("#r2").val(data.val);
                // console.log(data.val)
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
