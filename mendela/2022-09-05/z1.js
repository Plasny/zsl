/// vars
let NAPIS = "<b>Witaj JavaScript</b><br>";
let z1_1p = -22;
let z1_1k = 22;
let z1_2p = -15;
let z1_2k = 55;
let z1_3p = 10;
let z1_3k = 40;
let z1_3bp = 15;
let z1_3bk = 25

/// code
page += "<h2>Zadanie1:</h2> <br>"
page += NAPIS + PRZERWA;

for (let i = z1_1p; i < z1_1k; i++)
    page += i + "<br>";
page += PRZERWA;

for (let i = z1_2k; i > z1_2p; i -= 5)
    page += i + " ";
page += PRZERWA;

for (let i = z1_3k; i >= z1_3p; i--)
    if (!(i > z1_3bp && i < z1_3bk))
        page += i + " ";
page += PRZERWA;
