const columns = ["produkt", "cena / szt", "liczba", "wartość"];
const products = [
    { price: "2.22", product: "kurtka" },
    { price: "3.34", product: "szalik" },
    { price: "4.44", product: "rękawiczki" },
    { price: "5.55", product: "buty" },
    { price: "6.66", product: "bluza" },
    { price: "7.77", product: "coś na wieczór" },
    { price: "7.77", product: "coś na wieczór" },
];

let numbers = [];

$("document").ready(function () {

    let table = $("<table>");

    let tr = $("<tr>");
    for (let i in columns) {

        let th = $("<th>");
        th.text(columns[i]);
        tr.append(th);

    }
    table.append(tr);

    for (let i in products) {
        let tr = $("<tr>");
        let number = 0;

        let td1 = $("<td>");
        td1.text(products[i].product);
        td1.addClass("pink");
        tr.append(td1);

        let td2 = $("<td>");
        td2.text(products[i].price);
        td2.addClass("purple");
        tr.append(td2);

        let td3 = $("<td>");
        let range = $("<input type=range min=0 max=5 value=0>")
        range.on("change", function () {
            let number = $(this).val();
            td4.text((number * products[i].price).toFixed(2));

            numbers[i] = number;
            let numberss = 0;
            for (let i in numbers) {
                numberss += parseInt(numbers[i]);
            }
            $("#numbers").text(numberss);

            let total = 0;
            for (let i in products) {
                total += parseFloat($(".gray").eq(i).text());
                // console.log($(".gray").eq(i).text())
            }
            $("#total").text(total.toFixed(2));

        })
        td3.append(range);
        td3.addClass("pink");
        tr.append(td3);

        let td4 = $("<td>");
        td4.text(0);
        td4.attr("id",)
        td4.addClass("gray");
        tr.append(td4);

        table.append(tr);
    }


    tr = $("<tr>");
    for (let i = 0; i < 3; i++) {
        let td;
        switch (i) {
            case 0:
                td = $("<td colspan=2>");
                break;
            case 1:
                td = $("<td>");
                td.attr("id", "numbers");
                td.addClass("orange");
                break;
            case 2:
                td = $("<td>");
                td.attr("id", "total");
                td.addClass("orange");
                break;
        }
        tr.append(td);
    }
    table.append(tr);

    $("#main").append(table);
    console.log("test");

});