// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const axes = new THREE.AxesHelper(1000);

// pozycje obiektów x, y, z
const positions = [
    { x: -2, y: 0, z: -2 },
    { x: -1, y: 0, z: -2 },
    { x: 0, y: 0, z: -2 },
    { x: 1, y: 0, z: -2 },
    { x: 2, y: 0, z: -2 },
    { x: 2, y: 0, z: -1 },
    { x: 2, y: 0, z: 0 },
    { x: 2, y: 0, z: 1 },
    { x: 2, y: 0, z: 2 },
    { x: 1, y: 0, z: 2 },
    { x: 0, y: 0, z: 2 },
    { x: -1, y: 0, z: 2 },
    { x: -2, y: 0, z: 2 },
    { x: -2, y: 0, z: 1 },
    { x: -2, y: 0, z: 0 },
    { x: -2, y: 0, z: -1 },
    { x: -2, y: 0, z: -2 },
    { x: 0, y: 1, z: -2 },
    { x: -1, y: 1, z: -2 },
    { x: -2, y: 1, z: -2 },
    { x: -2, y: 1, z: -1 },
    { x: -2, y: 1, z: 0 },
    { x: -1, y: 2, z: -2 },
    { x: -2, y: 2, z: -2 },
    { x: -2, y: 2, z: -1 },
    { x: -2, y: 3, z: -2 },
]

// funkcje generujące bryły
const cubeSize = 100;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
let materials = [];
const material = (path) => new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load(path)
});
for (let type of ['grass_side', 'grass_side', 'grass_top', 'dirt', 'grass_side', 'grass_side'])
    materials.push(material(`mats/${type}.png`));
const newCube = () => new THREE.Mesh(geometry, materials);

// funkcja dostosowująca rozmiar ekranu kamery z rozmiarem okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("load", function () {
    scene.add(axes);
    for (let i in positions) {
        let cube = newCube();
        cube.name = `cube${i}`
        cube.position.y = (cubeSize * positions[i].y);
        cube.position.x = (cubeSize * positions[i].x);
        cube.position.z = (cubeSize * positions[i].z);
        scene.add(cube);
    }

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(1000, 500, 1000);
    camera.lookAt(scene.position);

    window.addEventListener('resize', onWindowResize, false);

    render();
});

//   ---------------------------------------------------------------------- 

const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2()

let movementFlag = false;
let cameraMode = true;
let cameraModeType = 0;
let cCube;
let keyCode;

// zamiana stopnie na radiany
const toRad = (degrees) => degrees * Math.PI / 180;

// funkcja renderująca scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    if(movementFlag) {
        movement();
    }
}

// funkcja wybierająca element
function select(name) {
    cCube = scene.getObjectByName(name);
    cameraMode = false;
    console.log("object movement mode");
}

function movement() {
    if (cameraMode) {
        if (cameraModeType == 0)
            switch (keyCode) {
                case 27:    // esc
                    cameraModeType = 1;
                    console.log("camera movement y and rotation");
                    break;
                case 37:    // left
                    camera.position.z++;
                    break;
                case 38:    // up
                    camera.position.x--;
                    break;
                case 39:    // right
                    camera.position.z--;
                    break;
                case 40:    // down
                    camera.position.x++;
                    break;
            }
        else if (cameraModeType == 1) {
            switch (keyCode) {
                case 27:    // esc
                    console.log("camera movement x z");
                    cameraModeType = 0;
                    break;
                case 37:    // left
                    camera.rotation.y += toRad(1);
                    break;
                case 38:    // up
                    camera.position.y++;
                    break;
                case 39:    // right
                    camera.rotation.y -= toRad(1);
                    break;
                case 40:    // down
                    camera.position.y--;
                    break;
            }

        }

    }

}

window.addEventListener("mousedown", (e) => {
    mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

    /* szukanie punktów wspólnych "promienia" i obiektu 3D */
    raycaster.setFromCamera(mouseVector, camera);

    /* tablica obiektów w które "trafia" nasz "promień" wysyłany z kamery */
    let intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        /* zerowy w tablicy czyli najbliższy kamery obiekt to ten, którego potrzebujemy */
        select(intersects[0].object.name, 0);
    }
});

window.addEventListener("keydown", (e) => {
    // console.log(e.keyCode);
    movementFlag = true;
    keyCode = e.keyCode;

    if (!cameraMode)
        switch (keyCode) {
            case 27:    // esc
                cameraMode = true;
                console.log("return to camera mode")
                break;
            case 37:    // left
                cCube.position.z += cubeSize;
                break;
            case 38:    // up
                cCube.position.x -= cubeSize;
                break;
            case 39:    // right
                cCube.position.z -= cubeSize;
                break;
            case 40:    // down
                cCube.position.x += cubeSize;
                break;
        }
});

window.addEventListener("keyup", () => {
    movementFlag = false;
});
