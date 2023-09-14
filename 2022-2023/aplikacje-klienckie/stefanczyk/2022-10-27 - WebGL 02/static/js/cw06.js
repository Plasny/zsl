// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const axes = new THREE.AxesHelper(1000);
const cubeSize = 80;

// funkcje generujące bryły
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
let materials = [];
const material = (path) => new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load(path)
});
for (let type of ['grass_side', 'grass_side', 'grass_top', 'dirt', 'grass_side', 'grass_side'])
    materials.push(material(`mats/${type}.png`));
const cube = new THREE.Mesh(geometry, materials);

let angle = 0;

// funkcja renderująca scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    camera.position.z = Math.cos(angle) * 200;
    camera.position.x = Math.sin(angle) * 200;
    camera.lookAt(scene.position);
    angle += 0.01;
}

// funkcja dostosowująca rozmiar ekranu kamery z rozmiarem okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// function cameraMovement() {
//     frame = requestAnimationFrame(cameraMovement);
//     camera.position.z = Math.cos(angle) * 200;
//     camera.position.x = Math.sin(angle) * 200;
//     camera.lookAt(scene.position);
//     angle += 0.01;
// }

window.addEventListener("load", function () {
    scene.add(axes);
    scene.add(cube);

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(200, 100, 200);
    camera.lookAt(scene.position);

    window.addEventListener('resize', onWindowResize, false);

    // cameraMovement();
    render();
});
