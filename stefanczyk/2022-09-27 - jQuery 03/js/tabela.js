let lps = ["lp", "cena", "produkt"];
let ceny = ["5,60", "3,23", "7,45", "10,00", "3,20"];
let produkty = ["chleb", "mąka", "masło", "kefir", "dżem"];

function stringToFloat(string) {
    let float = parseFloat(string.replace(',', '.'));
    return float;
}

function insideTable(table) {
    let suma = 0.0;

    for (let i = 0; i < ceny.length; i++) {
        let tr = $("<tr>");
        for (let j = 0; j < lps.length; j++) {
            let td = $("<td>");
            switch (j) {
                case 0:
                    td.text(i + 1);
                    break;
                case 1:
                    td.text(ceny[i]);
                    suma += stringToFloat(ceny[i]);
                    break;
                case 2:
                    td.text(produkty[i]);
                    break;
            }
            tr.append(td);
        }
        table.append(tr);
    }

    return suma;
}

$(document).ready(function () {
    let table = $("<table>");

    // nagłówki -->
    let nagR = $("<tr>");
    for (let i = 0; i < lps.length; i++) {
        let nagT = $("<th>");
        nagT.text(lps[i]);
        nagT.appendTo(nagR);
    }
    nagR.appendTo(table);
    // --> nagłówki

    // lista zakupów
    let suma = insideTable(table);

    // pole sumy -->
    let sumaR = $("<tr>");

    let sumaT = $("<td>");
    sumaT.text("suma")
    sumaR.append(sumaT);

    let sumaV = $("<td>")
    sumaV.attr("colspan", "2");
    sumaV.attr("class", "red");
    sumaV.text(suma);
    sumaR.append(sumaV);
    // --> pole sumy

    table.append(sumaR);
    $("#main").append(table);

})
