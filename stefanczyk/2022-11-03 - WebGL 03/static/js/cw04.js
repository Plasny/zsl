// TODO

const toRad = (degrees) => degrees * Math.PI / 180;

let obj = {
    intensity: 1,
    position: {
        x: 0,
        y: 50,
        z: 0
    }
};

// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const axes = new THREE.AxesHelper(1000);
const cubeSize = 80;

// bryła
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMaterial = new THREE.MeshPhongMaterial({
    specular: 0xffffff,
    shininess: 50,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load("mats/crate.jpg"),
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = cubeSize / 2;

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
const light = new THREE.PointLight(0xffffd0, 1);
light.position.set(obj.position.x, obj.position.y, obj.position.z);

// funkcja renderująca scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    cube.rotation.y += 0.005;
}

// funkcja dostosowująca rozmiar ekranu kamery z rozmiarem okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// funkcja aktualizująca wyświetlany kod na stronie
function codeBlock() {
    document.getElementById("code").innerHTML = JSON.stringify(obj, null, 3);
}

window.addEventListener("load", function () {
    scene.add(axes);
    scene.add(plane);
    scene.add(cube);
    scene.add(light);

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(300, 200, 300);
    camera.lookAt(scene.position);

    window.addEventListener('resize', onWindowResize, false);

    codeBlock();
    render();

    document.getElementById("intensity").addEventListener("input", function () {
        obj.intensity = document.getElementById("intensity").value / 10;
        light.intensity = obj.intensity;

        codeBlock();
    });

    document.getElementById("yPos").addEventListener("input", function () {
        console.log("test")
        obj.position.y = document.getElementById("yPos").value;
        light.position.set(obj.position.x, obj.position.y, obj.position.z);

        codeBlock();
    });
});
