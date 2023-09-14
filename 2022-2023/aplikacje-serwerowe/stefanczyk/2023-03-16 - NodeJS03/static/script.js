const container = document.getElementById('monitor');
const typeHeader = document.getElementById('typeHeader');
const d = 1024 * 1024;
let run = false;
var type = "heap"; // "os"

function switchType() {
    if (type === "heap") {
        type = "os";
    } else {
        type = "heap";
    }

    typeHeader.innerText = type;
}

function start() {
    fetch('/start');
}

function stop() {
    fetch('/stop');
}

function read() {
    if (run) return;
    run = true;

    setInterval(async () => {
        let high = 0;
        let url;

        if(type === "heap") {
            url = '/getData?limit=20'
        } else {
            url = '/getData?limit=25&type=os'
        }

        const response = await fetch(url);
        const arr = await response.json();

        container.innerHTML = "";

        // console.log("\n new");
        for (const i in arr) {
            const el = arr[i];
            // const time = new Date(el.timestamp);
            // console.log({ timestamp: time.toLocaleTimeString(), mem: el.memoryUsage / (1024 * 1024) });

            const column = document.createElement('div');
            column.classList.add('column');
            column.style.right = (20 * i + 2) + 'px';
            column.style.bottom = '10px';
            switch (type) {
                case "heap":
                    column.style.height = (el.memoryUsage / 51200) + 'px';
                    break;
                case "os":
                    column.style.height = (el.memoryUsage / (d * 20)) + 'px';
                    break;
            }
            container.append(column);

            if (high < el.memoryUsage) high = el.memoryUsage;
        }

        const line = document.createElement('div');
        line.classList.add('topLine');
        switch (type) {
            case "heap":
                line.style.bottom = (high / 51200) + 10 + 'px';
                break;
            case "os":
                line.style.bottom = (high / (d * 20)) + 10 + 'px';
                break;
        }
        container.append(line);

        const text = document.createElement('div');
        text.classList.add('topText');
        text.innerText = 'Memory max: ' + (high / d).toFixed(2) + 'Mb';
        switch (type) {
            case "heap":
                text.style.bottom = (high / 51200) + 10 + 'px';
                break;
            case "os":
                text.style.bottom = (high / (d * 20)) + 10 + 'px';
                break;
        }
        container.append(text);

    }, 1000);
}
