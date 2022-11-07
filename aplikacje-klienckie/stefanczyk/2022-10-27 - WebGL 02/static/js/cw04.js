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
let angle = 0;
let frame;
let code = {
    camPosX: 100,
    camPosY: 0,
    camPosZ: 100,
}

// funkcja renderująca scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    camera.lookAt(scene.position);
    codeBlock();
}

function sinUpAndDown() {
    frame = requestAnimationFrame(sinUpAndDown);
    code.camPosY = (Math.sin(angle) * 100).toFixed(2);
    camera.position.y = Math.sin(angle) * 100;
    angle += 0.01;
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

    camera.position.set(code.camPosX, code.camPosY, code.camPosZ);
    camera.lookAt(scene.position);

    render();

    document.getElementById("switch").addEventListener("click", function () {
        if (move) {
            move = false;
            sinUpAndDown();
        }
        else {
            move = true;
            cancelAnimationFrame(frame);
        }
    });
});
