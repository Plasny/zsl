// ------------------------------ fetchPost button ------------------------------

function fetchPost() {
    const options = {
        method: "POST",
        body: JSON.stringify({                      // body czyli treść wiadomości do wysłania na server
            a: 0, 
            b: 2, 
            c: "test"
        }), 
        headers: {                                  // nagłowek czyli typ danych
            'Content-Type': 'application/json'
        }
    }

    console.log(options.body)

    fetch("/api", options)
        .then(res => res.json())                    // sparsowanie informacji zwrotnej do odpowiedniego formatu
        .then(data => {                             // dane odpowiedzi z serwera
            console.log(data);
        });
}

// ------------------------------ makeTable button ------------------------------

let clicked = false;

function onBoxClick(cell) {
    fetch("/api", {
        method: 'POST',
        body: JSON.stringify({
            x: cell.offsetLeft,
            y: cell.offsetTop
        }),
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => response.json())
        .then(response => {
            console.log(response)
            document.querySelectorAll(".box").forEach(element => {
                element.style.background = "black";
            });
            cell.style.background = "red";
        })

}

function makeTable(size) {
    if (!clicked) {
        clicked = true;

        let table = document.createElement("div");
        for (let i = 0; i < size; i++) {
            let row = document.createElement("div");
            for (let j = 0; j < size; j++) {
                let cell = document.createElement("div");
                cell.classList.add("box");
                cell.addEventListener("click", function () {
                    onBoxClick(cell);
                });
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        document.getElementById("main").appendChild(table);
    }
}
