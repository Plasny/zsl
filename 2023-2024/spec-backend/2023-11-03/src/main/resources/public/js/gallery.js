const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get("car");

const images = uuid
    ? await(await fetch(`/api/cars/${uuid}/images`)).json()
    : await(await fetch(`/api/images`)).json();

const gallery = document.getElementById("imgcontainer");

for (const uuid of images) {
    const url = `/api/images/${uuid}`;

    const a = document.createElement("a");
    a.style.position = "relative";
    a.style.display = "inline-block";
    a.href = url;

    const img = document.createElement("img");
    img.src = url;
    img.width = 150;
    img.height = 150;
    a.append(img);

    const editBtn = document.createElement("a");
    editBtn.classList.add("btn-circle");
    editBtn.style.transform = "translate(0rem, -1rem)";
    editBtn.href = `/imager.html?image=${uuid}`;
    editBtn.innerHTML = `
        <svg width="2rem" height="2rem" viewBox="-7.2 -7.2 38.40 38.40" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)">
            <g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)">
                <rect x="-7.2" y="-7.2" width="38.40" height="38.40" rx="19.2" fill="#000000" strokewidth="0"></rect>
            </g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> 
                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z" fill="#fff"></path> 
            </g>
        </svg>
    `;
    a.append(editBtn);

    gallery.append(a);
}
