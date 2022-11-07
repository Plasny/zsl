
// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const axes = new THREE.AxesHelper(1000);

// funkcje generujące bryły
const cubeSize = 60;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
let materials = [];
const material = (path) => new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load(path)
});
for (let type of ['grass_side', 'grass_side', 'grass_top', 'dirt', 'grass_side', 'grass_side'])
    materials.push(material(`mats/${type}.png`));
const newCube = () => new THREE.Mesh(geometry, materials);

const toRad = (degrees) => degrees * Math.PI / 180;

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

function rotate(name, i) {
    if (i < 360) {
        let object = scene.getObjectByName(name);
        object.rotation.y = toRad(i);
        requestAnimationFrame(function () { rotate(name, ++i) });
    }
}

window.addEventListener("load", function () {
    scene.add(axes);
    for (let i = -1; i <= 1; i++) {
        let cube = newCube();
        cube.name = `cube${i}`
        cube.position.y = i * (cubeSize + 5);
        scene.add(cube);
    }

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(200, 100, 200);
    camera.lookAt(scene.position);

    window.addEventListener('resize', onWindowResize, false);

    render();
});

//   ---------------------------------------------------------------------- 

/* obiekt Raycastera symulujący "rzucanie" promieni */
const raycaster = new THREE.Raycaster();
/*
 * ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie 
 * do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D
 */
const mouseVector = new THREE.Vector2()

window.addEventListener("mousedown", (e) => {
    mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

    /* szukanie punktów wspólnych "promienia" i obiektu 3D */
    raycaster.setFromCamera(mouseVector, camera);

    /* tablica obiektów w które "trafia" nasz "promień" wysyłany z kamery */
    let intersects = raycaster.intersectObjects(scene.children);
    // console.log(intersects.length);

    if (intersects.length > 0) {
        // for (let i = 0; i < intersects.length; i++)
        //     console.log(intersects[i].object);

        /* zerowy w tablicy czyli najbliższy kamery obiekt to ten, którego potrzebujemy */
        requestAnimationFrame(function () { rotate(intersects[0].object.name, 0) });
    }
})
