const serverUrl = "./actions.php";
let alloys, countries;
let hiddenEl, editEl;

/**
 * Function that returns data required for creating table
 * @param {URL} url 
 * @returns {Object}
 */
async function get(url) {
    return await fetch(url).then(res => res.json());
}

/**
 * Function that sends actions to a server
 * @param {URL} url 
 * @param {Object} data 
 */
async function send(url, data) {
    const formBody = new URLSearchParams(data);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: formBody
    })
        .then(() => {
            const tab = document.getElementById('tab');
            drawTab(tab);
        });
}

/**
 * Function that gets the list of countries and alloys, and creates a select element using them. Has to be run at the begining.
 */
function init() {
    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: new URLSearchParams({ action: 'init' })
    })
        .then(res => res.json())
        .then(res => {
            const alloySelect = document.getElementById('alloy');
            const countrySelect = document.getElementById('country');

            alloys = res.alloys;
            countries = res.countries;

            for (const el of res.alloys) {
                const option = document.createElement('option');
                option.value = el[0];
                option.label = el[1];
                alloySelect.appendChild(option);
            }

            for (const el of res.countries) {
                const option = document.createElement('option');
                option.value = el[0];
                option.label = el[1];
                countrySelect.appendChild(option);
            }
        });
}

/**
 * Wrapper function for deleting row from table
 */
function del(e) {
    // console.log('del:', this.val);
    e.stopPropagation();
    send(serverUrl, { action: 'del', id: this.val });
    this.removeEventListener('click', del);
}

/**
 * Function that clears open edit box
 */
function clear() {
    if (hiddenEl != undefined) {
        hiddenEl.style.display = "table-row";
    }
    if (editEl != undefined) {
        editEl.remove();
    }
}

/**
 * Function that is used for editing row in table
 * @param {Number} id 
 * @param {HTMLTableRowElement} htmlEl
 * @param {} values 
 */
function edit(id, htmlEl, values) {
    console.log(values);
    clear();

    // const form = document.getElementById("editForm");
    const form = "editForm";
    const rowEl = document.createElement('tr');

    const actionEl = document.createElement('input');
    actionEl.type = 'hidden';
    actionEl.name = 'action';
    actionEl.value = 'edit';
    actionEl.form = form;
    actionEl.setAttribute("form", form);
    rowEl.append(actionEl);

    const idEl = document.createElement('input');
    idEl.type = 'hidden';
    idEl.name = 'id';
    idEl.value = id;
    idEl.setAttribute("form", form);
    rowEl.append(idEl);

    const inputs = [
        { name: 'country_id', type: 'select', options: countries },
        { name: 'denomination', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'alloy_id', type: 'select', options: alloys },
        { name: 'year', type: 'text' },
    ];
    for (const el of inputs) {
        const cell = document.createElement('td');

        if (el.type == 'text') {
            const input = document.createElement('input');
            input.name = el.name;
            input.type = el.type;
            input.required = true;
            input.setAttribute("form", form);
            cell.append(input);
        } else if (el.type == 'select') {
            const select = document.createElement('select');
            select.name = el.name;
            select.required = true;
            select.setAttribute("form", form);

            for (const opt of el.options) {
                const option = document.createElement('option');
                option.value = opt[0];
                option.label = opt[1];
                select.append(option);
            }
            cell.append(select);
        }
        rowEl.append(cell);
    }

    const cell = document.createElement('td');
    const button = document.createElement('button');
    button.innerText = "✅";
    button.classList.add("add");
    button.setAttribute("form", form);
    button.type = "submit";
    cell.append(button);
    rowEl.append(cell);

    htmlEl.after(rowEl);
    editEl = rowEl;

    htmlEl.style.display = 'none';
    hiddenEl = htmlEl;

    const elements = document.getElementById(form).elements;
    for (let i = 0; i < inputs.length; i++) {
        switch (elements[inputs[i].name].type) {
            case 'text':
                elements[inputs[i].name].value = values[i];
                break;
            case 'select-one':
                for (const option of elements[inputs[i].name].options) {
                    console.log(option);
                    if (option.label === values[i]) {
                        elements[inputs[i].name].value = option.value;
                        break;
                    }
                }
                break;
        }
    }
}


/**
 * Function that draws body of the table in the document
 * @param {HTMLTableElement} htmlTab 
 */
async function drawTab(htmlTab) {
    let data = await get(serverUrl);
    htmlTab.innerHTML = "";

    for (const rec of data) {
        let row = document.createElement('tr');
        let id = rec.shift();

        let values = [...rec];
        row.addEventListener('click', function () { edit(id, row, values = values); });

        let cell = document.createElement('td');
        const flag = document.createElement('img');
        const flag_val = rec.shift();
        flag.src = `./gfx/${flag_val}.jpg`;
        cell.append(flag);
        row.append(cell);

        for (const el of rec) {
            let cell = document.createElement('td');
            cell.innerText = el;
            row.append(cell);
        }

        // adding delete button
        cell = document.createElement('td');
        let btn = document.createElement('div');
        btn.classList.add('del');
        btn.innerText = '❌';
        btn.val = id;
        btn.addEventListener('click', del);
        cell.append(btn);
        row.append(cell);

        htmlTab.prepend(row);
    }
}

init();
window.addEventListener("load", function () {
    const table = document.getElementById('tab');
    drawTab(table);

    const newForm = document.getElementById('newForm');
    newForm.addEventListener('submit', (e) => {
        e.preventDefault();
        send(serverUrl, new FormData(newForm));
    });

    const editForm = document.getElementById('editForm');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        send(serverUrl, new FormData(editForm));
    });
});
