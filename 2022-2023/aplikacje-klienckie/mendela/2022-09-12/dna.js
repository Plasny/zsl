/// input: https://www.bioinformatics.org/sms2/random_dna.html

var page = "<pre>"
let arr1 = []

function strToArr (string, array) {
    let length = string.length
    string = string.toUpperCase()
    for(let i = 0; i < length; i += 3) {
        array.push(string.substr(i,3))
    }
}

function complement (stringIn) {
    let stringOut = ""
    for (i in stringIn) {
        // console.log(stringIn[i])
        switch(stringIn[i]) {
            case 'a':
                stringOut = stringOut.concat('t')
                break
            case 't':
                stringOut = stringOut.concat('a')
                break
            case 'c':
                stringOut = stringOut.concat('g')
                break
            case 'g':
                stringOut = stringOut.concat('c')
                break
        }
    }
    return stringOut
}

function sort2DArr (array) {
    let tmp, j
    for (let i = 1; i < array.length; i++) {
        tmp = array[i]
        j = i - 1

        while(j >= 0 && array[j][1] > tmp[1]) {
            array[j + 1] = array[j]
            j--
        }
        array[j + 1] = tmp
    }

    return array.reverse()
}

function groupArr (arrayIn) {
    let object = {}
    for (i in arrayIn) {
        if(object[arrayIn[i]]) {
            object[arrayIn[i]]++
        } else {
            object[arrayIn[i]] = 1
        }
    }

    let array = Object.entries(object)

    return sort2DArr(array)
}

/// pobranie ciągu i wypisanie go
let dnaPart1 = prompt("Podaj nić DNA").replace(/\s/g, "") // .replace removes whitespace
page += dnaPart1 + "<br>"
// console.log("dnaPart1: "+dnaPart1+"\nLength: "+length)

/// zamiana liter w ciągu na duze, pogrupowanie ich po 3 i pokolorowanie określonych grup
strToArr(dnaPart1, arr1)
for (i in arr1) {
    if (arr1[i] == "ATG") {
        page += arr1[i].bold().fontcolor("green")+" "
    } else if (arr1[i] == "TAA" || arr1[i] == "TAG" || arr1[i] == "TGA") {
        page += '<span style="background-color:yellow">' + arr1[i] + '</span> '
    } else {
        page += arr1[i]+" "
    }
}
// console.table(arr1)

/// stworzenie nici komplementarnej i jej wypisanie
let dnaPart2 = complement(dnaPart1)
page += "<br><br>"
for (let i = 0; i < dnaPart2.length; i += 3) {
    page += dnaPart2.substr(i, 3).toUpperCase() + " "
}
page += "<br>" + dnaPart2

/// pogrupowanie i zliczenie ile razy występuje dany zbiór
let arr2 = groupArr(arr1)
// console.table(arr2)
page += "<br><br>"
let color
for (i in arr2) {
    if ( i%5 == 0 )
        color = (Math.random()*16777215).toString(16).substring(0,6)
    // console.log(color+" "+i)
    page += "<span style='background-color:#" + color + "'>" + arr2[i][0] + " - " + arr2[i][1] + "</span><br>"
}

document.write(page)