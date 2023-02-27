let code = {
    cube: {
        x: 0,
        y: 0,
        z: 0
    },
    object3D: {
        x: 0,
        y: 0,
        z: 0
    },
};

const toRad = (degrees) => degrees * Math.PI / 180;

// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const axes = new THREE.AxesHelper(1000);
const cubeSize = 100;

// obiekt zrobiony w cw03o.js
const myObject = new MyObject3D(0, cubeSize / 2, 0, cubeSize, 3);
const object = myObject.getObj();

// płaszczyzna
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeTexture = new THREE.TextureLoader().load('mats/grass.jpg');
planeTexture.wrapS = THREE.RepeatWrapping;
planeTexture.wrapT = THREE.RepeatWrapping;
planeTexture.repeat.set(4, 4);
const planeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: planeTexture,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = toRad(90);

// światło
const light = new THREE.AmbientLight(0xffffd0, 1);

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

// funkcja aktualizująca wyświetlany kod na stronie
function codeBlock() {
    document.getElementById("code").innerHTML = JSON.stringify(code, null, 3);
}

window.addEventListener("load", function () {
    scene.add(axes);
    scene.add(plane);
    scene.add(light);
    scene.add(object);

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(4 * cubeSize, 3 * cubeSize, 4 * cubeSize);
    camera.lookAt(scene.position);

    window.addEventListener('resize', onWindowResize, false);

    codeBlock();
    render();

    document.getElementById("cubeX").addEventListener("input", function () {
        let value = document.getElementById("cubeX").value;
        let i = 2;
        let cube = scene.getObjectByName(`cube${i}`);

        cube.position.x = value * cubeSize / 2 + myObject.getCubesX(i);
        code.cube.x = value;
        codeBlock();
    });
    document.getElementById("objY").addEventListener("input", function () {
        let value = document.getElementById("objY").value;

        object.position.y = value * cubeSize / 2;
        code.object3D.y = value;
        codeBlock();
    });
});
