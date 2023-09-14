let code = [];
let id = 0;

const randPos = maxVal => ((Math.random() * 2 * maxVal) - maxVal).toFixed(2);

function randHex(size) {
    let result = [];
    for (let i = 0; i < size; i++)
        result[i] = Math.floor(Math.random() * 16).toString(16);
    return '0x'+result.join('');
}

// cube 
const geometry = new THREE.BoxGeometry(40, 40, 40);
const material = () => new THREE.MeshBasicMaterial({ 
    side: THREE.DoubleSide, 
});
const newCube = () => new THREE.Mesh(geometry, material());

window.addEventListener("load", function () {
    // webgl setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.1, 10000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // for axes
    const axes = new THREE.AxesHelper(1000);
    scene.add(axes);

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(200, 200, 200);
    camera.lookAt(scene.position);

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera)
    }

    render();

    function codeBlock() {
        document.getElementById("code").innerHTML = JSON.stringify(code, null, 3);
    }

    codeBlock();

    document.getElementById("add").addEventListener("click", function () {
        let codeElem = { id: id++, pos: {
            x: randPos(150),
            y: randPos(100),
            z: randPos(150),
        } };

        let cube = newCube();

        cube.name = "cube";
        cube.material.color.setHex(randHex(6));
        cube.position.x = codeElem.pos.x;
        cube.position.y = codeElem.pos.y;
        cube.position.z = codeElem.pos.z;

        scene.add(cube);
        code.push(codeElem);

        codeBlock();
    });
    document.getElementById("del").addEventListener("click", function () {
        while(scene.getObjectByName("cube"))
            scene.remove(scene.getObjectByName("cube"));

        id = 0;
        code = [];
        codeBlock();
    });
});
