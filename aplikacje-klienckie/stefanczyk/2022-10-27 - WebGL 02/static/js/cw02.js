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
const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide, // dwustronny
    map: new THREE.TextureLoader().load('mats/Minecraft-Diamond-Ore.jpg'), // plik tekstury
    transparent: true, // przezroczysty / nie
    opacity: 0.9, // stopień przezroczystości
})
const cube = new THREE.Mesh(geometry, material);

// funkcja renderująca scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    cube.rotation.y += 0.01;
}

// funkcja dostosowująca rozmiar ekranu kamery z rozmiarem okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("load", function () {
    scene.add(axes);
    scene.add(cube);

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(100, 100, 100);
    camera.lookAt(scene.position);

    window.addEventListener('resize', onWindowResize, false);

    render();
});
