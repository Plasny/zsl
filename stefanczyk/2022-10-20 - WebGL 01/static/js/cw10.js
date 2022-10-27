// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const axes = new THREE.AxesHelper(1000);

// zmienne
let fov = 60;
let yCamera = 100;
let count = 5;
let cubeSize = 10;

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

    camera.fov = fov;
    camera.updateProjectionMatrix();
}

// funkcja dostosowująca rozmiar ekranu kamery z rozmiarem okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function schody(count) {
    console.log(count / 2)
    console.log(-(count / 2))
    addCube((count / 2) * cubeSize, (count / 2) * cubeSize, (count / 2) * cubeSize)
    addCube(-(count / 2) * cubeSize, -(count / 2) * cubeSize, (count / 2) * cubeSize)
    addCube(-(count / 2) * cubeSize, (count / 2) * cubeSize, -(count / 2) * cubeSize)
    addCube((count / 2) * cubeSize, -(count / 2) * cubeSize, -(count / 2) * cubeSize)
}

window.addEventListener("load", function () {
    scene.add(axes);
    // scene.add(cube);

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(100, yCamera, 100);
    camera.lookAt(scene.position);

    window.addEventListener('resize', onWindowResize, false);

    schody(count);
    render()

    document.getElementById("fov").addEventListener("input", function () {
        fov = document.getElementById("fov").value;
        // console.log(fov);
    });

    document.getElementById("yCamera").addEventListener("input", function () {
        yCamera = document.getElementById("yCamera").value;
        camera.position.set(100, yCamera, 100);
        camera.lookAt(scene.position);
    });

    document.getElementById("count").addEventListener("input", function () {
        count = document.getElementById("count").value;

        while (scene.getObjectByName("cube"))
            scene.remove(scene.getObjectByName("cube"));

        schody(count);
    });
});
