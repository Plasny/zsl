const table = document.getElementById("table");
const selectYear = document.getElementById("select-year");
const minPrice = document.getElementById("min-price");
const maxPrice = document.getElementById("max-price");
const allInvoices = document.getElementById("invoice-all-list");
const yearInvoices = document.getElementById("invoice-year-list");
const priceInvoices = document.getElementById("invoice-price-list");

const years = new Set();

function addSelectOption(value) {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = value;
    selectYear.append(option);
}

function createTableRow(row, i = 0) {
    years.add(row.year);

    const tr = document.createElement("tr");
    let td;
    tr.id = row.uuid;

    td = document.createElement("td");
    td.innerText = i;
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
    td.innerText = row.date;
    tr.append(td);

    td = document.createElement("td");
    td.innerText = row.price;
    tr.append(td);

    td = document.createElement("td");
    td.innerText = row.tax + "%";
    tr.append(td);

    return tr
}

async function load() {
    table.innerHTML = "";

    const res = await fetch("/api/cars");
    if (!res.ok)
        return

    const json = await res.json()

    for (let i in json) {
        const row = json[i];
        const tr = createTableRow(row, 1 + parseInt(i));

        table.append(tr);
    }

    selectYear.innerHTML = "";
    Array.from(years).sort().reverse().forEach(addSelectOption)
}

function addInvoiceLink(invoice) {
    const link = document.createElement("a");
    link.href = "/api/invoices/" + invoice.uuid;
    link.innerText = "Pobierz";
    link.title = invoice.description;

    const li = document.createElement("li");
    li.append(link);

    switch (invoice.type) {
        case "All":
            allInvoices.append(li);
            break;
        case "Year":
            yearInvoices.append(li);
            break;
        case "PriceRange":
            priceInvoices.append(li);
            break;
    }
}

async function getInvoices() {
    const invoices = await fetch("/api/invoices");

    priceInvoices.innerHTML = "";
    yearInvoices.innerHTML = "";
    allInvoices.innerHTML = "";

    for (const invoice of await invoices.json()) {
        addInvoiceLink(invoice);
    }
}

document.getElementById("invoice-all").addEventListener("click", async () => {
    await fetch("/api/invoices/all", {
        method: "POST"
    });
    getInvoices()
})

document.getElementById("invoice-year").addEventListener("click", async () => {
    await fetch("/api/invoices/year", {
        method: "POST",
        body: selectYear.value
    });

    getInvoices()
})

document.getElementById("invoice-price").addEventListener("click", async () => {
    await fetch("/api/invoices/price", {
        method: "POST",
        body: `${minPrice.value}-${maxPrice.value}`
    });
    getInvoices()
})

load()
getInvoices()
