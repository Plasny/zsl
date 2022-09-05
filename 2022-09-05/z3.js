/// vars
let size = 0;
let message = "Podaj rozmiar figur: "
let errorMessage = "Niewłaściwy typ danych, ich brak lub wartość mniejsza od 1!\n Podaj rozmiar figur: ";
let silnia = 1;
let suma = 0;
let lPierwsza = true;

/// code
page += "<h2>Zadanie3:</h2> <br>";
console.log("-> Zadanie3: ");

while(true){
    size = prompt(message, 6)
    size = parseInt(size);
    console.log(typeof size, size);

    if(!size || size<0 ) {
        message = errorMessage;
        console.error("Wrong size");
        continue;
    };

    break;
};

// podpunkt a
for(let i = 0; i < size; i++)
    page += "X";
page += PRZERWA;

// podpunkt b
for(let i = 1; i <= size; i++) {
    for(let j = 1; j <= size; j++) {
        if ( i === 1 || i === size) {
            page += "X ";
        } else {
            if( j === 1 || j === size) {
                page += "X ";
            } else {
                page += "  ";
            };
        };
    };
    page += "<br>";
};
page += PRZERWA;

// podpunkt c
for(let i = 1; i <= size; i++) {
    for(let j = 1; j <= size; j++) {
        if ( i === size) {
            page += "X";
        } else {
            if( j === size - i + 1 || j === size) {
                page += "X";
            } else {
                page += " ";
            };
        };
    };
    page += "<br>";
};
page += PRZERWA;

// podpunkt d
for(let i = 1; i <= size; i++) {
    for(let j = 1; j <= i; j++) {
        page += j;
    };
    page += "<br>";
};
page += PRZERWA;

// podpunkt e
for(let i = 1; i <= size; i++) {
    for(let j = 0; j < size - i; j++) {
        page += " ";
    };
    for(let j = i; j > 0; j--) {
        page += j;
    };
    page += "<br>";
};
page += PRZERWA;

// podpunkt f
for(let i = size; i > 0; i--)
    silnia *= i;
page += silnia + PRZERWA;
    
// podpunkt g
for(let i = size; i > 0; i--)
    if(i%2 === 0)
        suma += i;
page += suma + PRZERWA;

// podpunkt h
for(let i = 2; i < size; i++)
    if (size%i === 0)
        lPierwsza = false;        

if(lPierwsza) 
    alert(size + " jest liczbą pierwszą");
else
    alert(size + " nie jest liczbą pierwszą");

// podpunkt i
page += "<table>";
for(let i = 0; i <= size; i++) {
    page += "<tr>";
    for(let j = 0; j <= size; j++){
        if ( i === 0 && j === 0)
            page += `<td class=w></td>`
        else if ( i === 0 )
            page += `<th> ${j} </th>`
        else if ( j === 0 )
            page += `<th> ${i} </th>`
        else if (j === i)
            page += `<td class=w> ${i*j} </td>`
        else
            page += `<td> ${i*j} </td>`
    };
    page += "</tr>";
};
page += "</table>" + PRZERWA;