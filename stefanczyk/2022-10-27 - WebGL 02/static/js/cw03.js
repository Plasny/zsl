// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const axes = new THREE.AxesHelper(1000);
const cubeSize = 30;

const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('mats/Minecraft-Diamond-Ore.jpg'),
    transparent: true,
    opacity: 0.8,
})
const cube = new THREE.Mesh(geometry, material);

// zmienne
let move = true;
let directionPlus = false;
let interval;
let code = {
    camPosX: 100,
    camPosZ: 100,
}

// funkcja renderująca scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    camera.position.set(code.camPosX, 0, code.camPosZ);
    camera.lookAt(scene.position);

    codeBlock();
}

// funkcja dostosowująca rozmiar ekranu kamery z rozmiarem okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function codeBlock() {
    document.getElementById("code").innerHTML = JSON.stringify(code, null, 3);
}

window.addEventListener('resize', onWindowResize, false);

window.addEventListener("load", function () {
    scene.add(axes);
    scene.add(cube);

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(code.camPosX, 0, code.camPosZ);
    camera.lookAt(scene.position);

    render();

    document.getElementById("switch").addEventListener("click", function () {
        if (move) {
            move = false;
            if (directionPlus) {
                directionPlus = false;
                interval = setInterval(function () {
                    code.camPosX++;
                    code.camPosZ++;
                }, 10);
            }
            else {
                directionPlus = true;
                interval = setInterval(function () {
                    code.camPosX--;
                    code.camPosZ--;
                }, 10);
            }
        }
        else {
            clearInterval(interval);
            move = true;
        }
    });
});
