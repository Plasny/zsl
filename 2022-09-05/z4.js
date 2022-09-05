/// vars
let REGON = "";
let test_r9 = [8, 9, 2, 3, 4, 5, 6, 7];
let test_r14 = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];
let rArr = [];
let rLength = 0;
let rSum = 0;

// code
console.log("-> Zadanie4: ")
while(true){
    REGON = prompt("Podaj prawidłowy numer REGON: ", "123456785");
    rLength = REGON.length;
    if((rLength === 9 || rLength === 14) && !isNaN(REGON))
        break;
};

for(n in REGON)
    rArr[n] = parseInt(REGON[n]);

for(let i = 0; i<rLength-1; i++)
    rLength === 9 ? rSum += rArr[i] * test_r9[i] : rSum += rArr[i] * test_r14[i];

if(rSum%11 === rArr[rLength-1]) {
    alert(`Numer REGON (${REGON}) jest prawidłowy :)`)
    console.log(`Numer REGON (${REGON}) jest prawidłowy :)`)
} else {
    alert(`Numer REGON (${REGON}) nie jest prawidłowy :)`)
    console.log(`Numer REGON (${REGON}) nie jest prawidłowy :)`)
};

/*
for(n in rArr)
    console.log(rArr[n]);
console.log(rSum);
//*/