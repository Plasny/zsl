/// vars
let z2 = {  
            p1: "wynik 1 podpunktu: \n", 
            p2: "wynik 2 podpunktu: \n", 
            p3: "wynik 3 podpunktu: \n"
        };
let z2_1p = -40;
let z2_1k = 40;
let z2_1bp = 3;
let z2_1bk = 30;
let z2_2p = -20;
let z2_2k = 20;
let z2_2bp = 5;
let z2_2bk = 10;
let z2_3p = -100;
let z2_3k = 41;
let z2_3bp = -28;
let z2_3bk = 14;

/// code
console.info("-> Zadanie2: ")
for (let i = z2_1p; i < z2_1k; i++)
    if (!(i > z2_1bp && i < z2_1bk) && i % 2 !== 0)
        z2["p1"] += i + " ";

for (let i = z2_2p; i < z2_2k; i++)
    if (!(i > z2_2bp && i < z2_2bk) && i % 2 === 0)
        z2["p2"] += i + " ";

for (let i = z2_3p; i < z2_3k; i++)
    if (!(i > z2_3bp && i < z2_3bk) && i % 7 === 0)
        z2["p3"] += i + " ";

for( each in z2)
    console.info(z2[each]);
