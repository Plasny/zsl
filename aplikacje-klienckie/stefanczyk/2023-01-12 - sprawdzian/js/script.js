const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
camera.position.set(100, 500, 100);

const cube = new Player(10);
scene.add(cube);

const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeTexture = new THREE.TextureLoader().load('mats/grass.jpg');
planeTexture.wrapS = THREE.RepeatWrapping;
planeTexture.wrapT = THREE.RepeatWrapping;
planeTexture.repeat.set(8, 8);
const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    map: planeTexture,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = toRad(90);
scene.add(plane);


//---------------------------------------- 

// lights
let counter = 0;
const lightPos = 20;
const lightY = 50;
const change = toRad(60);
const lightArr = [];
function addLight() {
    const light = new Light(lightPos, lightY, counter * change);
    counter++;
    scene.add(light.GetLight());
    lightArr.push(light);
    createMenu(counter);
}

function createMenu(id) {
    const controls = document.getElementById("controls");
    const menu = document.createElement('div');
    menu.classList.add('menu');

    const colors = document.createElement('div');
    for (const color of ['red', 'green', 'blue', 'yellow', 'magenta', 'white']) {
        const div = document.createElement('div');
        div.classList.add(color);
        div.addEventListener('click', function () {
            lightArr[id - 1].SetColor(color);
        });
        colors.append(div);
    }
    menu.append(colors);

    const pos = document.createElement('INPUT');
    pos.setAttribute('type', 'range');
    pos.setAttribute('value', lightPos);
    pos.addEventListener('input', function () {
        lightArr[id - 1].SetPosition(this.value);
        console.log(this.value);
    });
    menu.append(pos);

    const y = document.createElement('INPUT');
    y.setAttribute('type', 'range');
    y.setAttribute('value', lightY);
    y.addEventListener('input', function () {
        lightArr[id - 1].SetY(this.value);
        console.log(this.value);
    });
    menu.append(y);

    controls.append(menu);
}

function toRad(degrees) {
    return degrees * Math.PI / 180;
}

let cameraAngle = 0;
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    camera.lookAt(scene.position);
    const z = Math.cos(cameraAngle) * 100;
    const x = Math.sin(cameraAngle) * 100;
    camera.position.set(x, 500, z);
    cameraAngle += 0.01;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('load', function () {
    window.addEventListener('resize', onWindowResize, false);
    document.getElementById('root').appendChild(renderer.domElement);
    document.getElementById('add').addEventListener('click', addLight);

    render();
});
