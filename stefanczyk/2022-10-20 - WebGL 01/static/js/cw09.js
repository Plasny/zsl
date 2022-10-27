// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const axes = new THREE.AxesHelper(1000);
const cubeSize = 10;

// funkcje generujące bryły
const geometry = () => new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = () => new THREE.MeshNormalMaterial();
const newCube = () => new THREE.Mesh(geometry(), material());
function addCube(x, y, z) {
    let cube = newCube();
    cube.name = "cube";

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    scene.add(cube);
}

// funkcja renderująca scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

// funkcja dostosowująca rozmiar ekranu kamery z rozmiarem okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function surface(number) {
    let nu = Math.floor(number / 2);
    let size = cubeSize + 5;

    for (let i = -nu; i <= nu; i++)
        for (let j = -nu; j <= nu; j++)
            addCube(i * size, 0, j * size);
}

window.addEventListener("load", function () {
    scene.add(axes);
    // scene.add(cube);

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(100, 100, 100);
    camera.lookAt(scene.position);

    window.addEventListener('resize', onWindowResize, false);

    surface(5);
    render();
});
