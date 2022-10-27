let code = {
    x: 0,
    y: 0,
    z: 0
};

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: 0xff00ff,
    transparent: true,
    opacity: 0.5
});
const cube = new THREE.Mesh(geometry, material);

function codeBlock() {
    document.getElementById("code").innerHTML = JSON.stringify(code, null, 3);
}

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

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera)
    }

    render();

    codeBlock();

    for (let element of ["x", "y", "z"]) {
        document.getElementById(element).addEventListener("input", function () {
            let x = document.getElementById("x").value;
            let y = document.getElementById("y").value;
            let z = document.getElementById("z").value;

            code = {
                x: x,
                y: y,
                z: z
            };

            cube.position.x = x;
            cube.position.y = y;
            cube.position.z = z;

            codeBlock();
        });
    }
});
