let txt = "Ciekawe czy uda ci się to zrobić :)               "
let txtArr1 = txt.split("")

setInterval(function () {
    // let tmp = txtArr1.pop();
    // txtArr1.unshift(tmp);
    txtArr1.unshift(txtArr1.pop());
    document.getElementById("z2").value = txtArr1.join("");

}, 100)