const select = document.getElementById("car-year");
const table = document.getElementById("table");
const dialog = document.getElementById("update-dialog");
const dialogClose = document.getElementById("dialog-close");
const dialogUpdate = document.getElementById("dialog-update");

let selectedUUID;

function createTableRow(row, i = 0) {
    const tr = document.createElement("tr");
    let td, btn, a;
    tr.id = row.uuid;

    td = document.createElement("td");
    td.innerText = i;
    tr.append(td);

    td = document.createElement("td");
    td.innerText = row.uuid;
    tr.append(td);

    td = document.createElement("td");
    td.innerText = row.model;
    tr.append(td);

    td = document.createElement("td");
    td.innerText = row.year;
    tr.append(td);

    td = document.createElement("td");
    td.innerText = `driver: ${row.airbags[0]}
            passanger: ${row.airbags[1]}
            backseat: ${row.airbags[2]}
            side: ${row.airbags[3]}
        `;
    tr.append(td);

    td = document.createElement("td");
    td.innerHTML = "<div class='color-box' style='background-color: " + row.color + "'></div>";
    tr.append(td);

    td = document.createElement("td");
    btn = document.createElement("button");
    btn.type = "button";
    btn.onclick = () => delCar(row.uuid);
    btn.innerText = "Delete";
    td.append(btn);
    tr.append(td);

    td = document.createElement("td");
    btn = document.createElement("button");
    btn.type = "button";
    btn.onclick = () => showUpdateDialog(row);
    btn.innerText = "Update";
    td.append(btn);
    tr.append(td);

    td = document.createElement("td");
    btn = document.createElement("button");
    btn.type = "button";
    btn.onclick = () => genInvoice(row.uuid);
    btn.innerText = "Generate Invoice";
    td.append(btn);
    if (row.hasInvoice) {
        a = document.createElement("a");
        a.classList.add("btn");
        a.href = `/api/cars/${row.uuid}/invoice`;
        a.style.marginTop = "0.5rem";
        a.innerText = "Show invoice";
        td.append(a);
    }
    tr.append(td);

    td = document.createElement("td");
    a = document.createElement("a");
    a.classList.add("btn");
    a.href = `/upload.html?car=${row.uuid}`;
    a.innerText = "Add images";
    td.append(a);
    tr.append(td)

    td = document.createElement("td");
    a = document.createElement("a");
    a.classList.add("btn");
    a.href = `/gallery.html?car=${row.uuid}`;
    a.innerText = "Show images";
    td.append(a);
    tr.append(td)

    return tr
}


function showUpdateDialog(car) {
    selectedUUID = car.uuid;
    document.getElementById("car-year").value = car.year;
    document.getElementById("car-model").value = car.model;

    dialog.showModal();
}

async function delCar(UUID) {
    await fetch(`/api/cars/${UUID}`, { method: "DELETE" });
    const tr = document.getElementById(UUID);
    let tmp = tr.nextSibling;

    while (tmp != null) {
        let i = parseInt(tmp.firstElementChild.innerHTML);
        tmp.firstElementChild.innerHTML = --i;
        tmp = tmp.nextSibling
    }

    tr.remove()
}

async function updateCar() {
    const dialogYear = parseInt(document.getElementById("car-year").value);
    const dialogModel = document.getElementById("car-model").value;
    const tr = document.getElementById(selectedUUID);

    await fetch(`/api/cars/${selectedUUID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            year: dialogYear,
            model: dialogModel
        })
    });


    const res = await fetch(`/api/cars/${selectedUUID}`);

    if (res.ok) {
        const row = await res.json();
        tr.replaceWith(createTableRow(row, tr.firstElementChild.innerHTML));
    }

    dialog.close();
}

async function genInvoice(UUID) {
    await fetch(`/api/cars/${UUID}/invoice`, { method: "POST" });

    const tr = document.getElementById(UUID);
    const res = await fetch(`/api/cars/${UUID}`);

    if (res.ok) {
        const row = await res.json();
        tr.replaceWith(createTableRow(row, tr.firstElementChild.innerHTML));
    }
}

async function load() {
    const res = await fetch("/api/cars");
    if (!res.ok)
        return

    const json = await res.json()

    for (let i in json) {
        const row = json[i];
        const tr = createTableRow(row, 1 + parseInt(i));
        // console.log(tr);

        table.append(tr);
    }

    // console.log(json)
}

let currentYear = new Date().getFullYear();
for (let i = 0; i < 100; i++) {
    const option = document.createElement("option");
    option.innerText = currentYear - i;
    select.appendChild(option);
}
select.firstElementChild.setAttribute("selected", true);

dialogUpdate.addEventListener("click", updateCar);
dialogClose.addEventListener("click", () => dialog.close());

load()
