const dropzone = document.getElementById("dropzone");
const fileUpload = document.getElementById("fileUpload");
const urlParams = new URLSearchParams(window.location.search);

document.getElementById("carUUID").value = urlParams.get("car");

document.querySelector("html").ondrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
}

dropzone.ondragenter = () => {
    dropzone.classList.add("drop-hover");
}

dropzone.ondragleave = () => {
    dropzone.classList.remove("drop-hover");
}

dropzone.onclick = () => {
    fileUpload.click();
}

dropzone.ondrop = e => {
    e.preventDefault();

    fileUpload.files = e.dataTransfer.files;

    dropzone.classList.remove("drop-hover");
    renderFiles();
}

fileUpload.onchange = renderFiles;

function renderFiles() {
    dropzone.innerHTML = "";

    if (fileUpload.files.length == 0) {
        const el = document.createElement("p")
        el.innerText = "Drop images here";
        dropzone.append(el);
    }

    for (let i = 0; i < fileUpload.files.length; i++) {
        const file = fileUpload.files[i];

        const el = document.createElement("div");
        const img = document.createElement("img");
        const removeBtn = document.createElement("button");

        el.classList.add("uploaded-file");
        el.setAttribute("data-idx", i);
        img.width = 150;
        img.height = 150;

        removeBtn.type = "button";
        removeBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem">
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier"> 
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z" fill="#000"></path> 
                </g>
            </svg>
        `
        removeBtn.onclick = e => {
            e.preventDefault();
            e.stopPropagation();

            const idx = parseInt(el.getAttribute("data-idx"));
            const fileArr = Array.from(fileUpload.files);
            fileArr.splice(idx, 1);

            const dt = new DataTransfer();
            for (const file of fileArr) {
                dt.items.add(file);
            }

            for (let j = idx; j < dropzone.children.length; j++) {
                dropzone.children.item(j).setAttribute("data-idx", j - 1);
            }

            fileUpload.files = dt.files;
            el.remove();

            if (fileArr.length == 0)
                renderFiles();
        }

        const reader = new FileReader();
        reader.onload = () => {
            img.src = reader.result;
        }

        reader.readAsDataURL(file);

        el.append(removeBtn);
        el.append(img);
        dropzone.append(el);
    }
}
