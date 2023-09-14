let code = [];
let id = 0;

function randHex(size) {
    let result = [];
    for (let i = 0; i < size; i++)
        result[i] = Math.floor(Math.random() * 16).toString(16);
    return '0x'+result.join('');
}

// cube 
const geometry = () => new THREE.BoxGeometry(1,1,1);
const material = () => new THREE.MeshBasicMaterial({ 
    side: THREE.DoubleSide, 
    transparent: true,
    opacity: 0.5
});
const newCube = () => new THREE.Mesh(geometry(), material());

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

    camera.position.set(100, 100, 100);
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
        let width = document.getElementById("width").value;
        let height = document.getElementById("height").value;
        let depth = document.getElementById("depth").value;
        
        let codeElem = { id: id++, dimensions: {
            width: width,
            height: height,
            depth: depth,
        } };

        let cube = newCube();

        cube.scale.x = width;
        cube.scale.y = height; 
        cube.scale.z = depth;
        cube.material.color.setHex(randHex(6));

        scene.add(cube);
        code.push(codeElem);

        codeBlock();
    });
});
