export function padWithZero(num) {
    if (num >= 10) {
        return '' + num
    } else {
        return '0' + num;
    }
}

