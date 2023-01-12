// stałe
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
camera.position.set(0, 1000, 0);
const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);

// plansza
const map = new THREE.Object3D();
const size = 100;
const wallWidth = size / 25;
getMapFromUrl('/');

// siatka 
const grid = new THREE.GridHelper(10000, 100);
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

// funkcja pobierająca dane z podanego url i tworząca z niego trójwymiarową plansze
async function getMapFromUrl(boardUrl) {
    const res = await fetch(boardUrl, {'method': 'post'});
    const data = await res.json();

    for (let i = 0; i < data.level.length; i++) {
        const d = data.level[i];
        const hex = new Hex3D(size, wallWidth, d.dirIn, d.dirOut);

        hex.position.x = d.x * size * 1.5;
        if (d.x % 2 == 0) {
            hex.position.z = d.z * (size - 3.4 * wallWidth) * 2;
        } else {
            // ️🧙‍♂ magic number  0.865555555555555555555555
            hex.position.z = d.z * (size - 3.4 * wallWidth) * 2 + size * 0.86555555;
        }

        map.add(hex);
    }
    map.position.x = map.position.z = -data.size * size / 2;
    scene.add(map);
}

window.addEventListener('load', function () {
    document.getElementById('root').appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', onWindowResize, false);

    render();

    document.getElementById('gridSwitch').addEventListener('click', switchGrid);
});
