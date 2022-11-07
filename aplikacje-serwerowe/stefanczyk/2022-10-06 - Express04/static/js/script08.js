let fd;

document.getElementById("fileUpload").addEventListener("click", function () {
    fd = new FormData();
    fd.append("file", document.getElementById("fileInput").files[0]); // plik z inputa

    let options = {
        method: "post",
        body: fd,
    };

    fetch("/api", options)
        .then((res) => res.json())
        .then((data) => {
            document.getElementById("main").innerText = JSON.stringify(data, null, 3);
            console.log(data);
        });
});
