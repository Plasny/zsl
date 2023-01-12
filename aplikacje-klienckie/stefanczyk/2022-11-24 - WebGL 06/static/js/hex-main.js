// stałe
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
camera.position.set(0, 1000, 0);
const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);

// hex
const hex = new Hex3D(200, 200 / 25, 2, 5);
scene.add(hex);

// grid
const grid = new THREE.GridHelper(1000, 10);
let gridFlag = false;
function switchGrid() {
    let gridSwitch = document.getElementById('gridSwitch');
    if (gridFlag) {
        scene.remove(grid);
        gridSwitch.innerText = 'Enable grid';
        gridFlag = false;
    } else {
        scene.add(grid);
        gridSwitch.innerText = 'Disable grid';
        gridFlag = true;
    }
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

window.addEventListener('load', function () {
    document.getElementById('root').appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', onWindowResize, false);

    render();

    document.getElementById('gridSwitch').addEventListener('click', switchGrid);
});
