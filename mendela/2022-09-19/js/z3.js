let txtArr2 = [
    "", "", "", "", "", "", "", "", "", "", "", "", "",
    ".... szósty punkt .....",
    ".... piąty punkt ......",
    ".... czwary punkt .....",
    ".... trzeci punkt .....",
    ".... drugi punkt ......",
    ".... pierszy punkt ....",
];
let j = 0;

setInterval(function () {
    txtArr2.unshift(txtArr2.pop());
    document.getElementById("z3").textContent = txtArr2.join("\n");
}, 300)