const select = document.getElementById("car-year");
const addBtn = document.getElementById("car-add");

let currentYear = new Date().getFullYear();
for (let i = 0; i < 100; i++) {
    const option = document.createElement("option");
    option.innerText = currentYear - i;
    select.appendChild(option);
}
select.firstElementChild.setAttribute("selected", true);

addBtn.addEventListener("click", async () => {
    const model = document.getElementById("car-model").value;
    const color = document.getElementById("car-color").value;
    const year = parseInt(document.getElementById("car-year").value);
    const airbags = [
        document.getElementById("airbag-dr").checked,
        document.getElementById("airbag-ps").checked,
        document.getElementById("airbag-bs").checked,
        document.getElementById("airbag-sd").checked,
    ];

    const body = JSON.stringify({
        model: model,
        year: year,
        color: color,
        airbags: airbags
    });

    const res = await fetch("/api/cars", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    });

    alert(JSON.stringify(await res.json(), null, 4));
});
