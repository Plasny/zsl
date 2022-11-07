let code = [];

// cube 
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    // wireframe: true,
    color: 0xff00ff,
    transparent: true,
    opacity: 0.5
});
const cube = new THREE.Mesh(geometry, material);

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

    scene.add(cube);

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

    for (let element of ["width", "height", "depth"]) {
        console.log(element);
        document.getElementById(element).addEventListener("input", function () {
            let width = document.getElementById("width").value;
            let height = document.getElementById("height").value;
            let depth = document.getElementById("depth").value;

            code = {
                width: "10*" + width,
                height: "10*" + height,
                depth: "10*" + depth,
            };

            cube.scale.x = width;
            cube.scale.y = height;
            cube.scale.z = depth;

            codeBlock();
        });

    }
});
