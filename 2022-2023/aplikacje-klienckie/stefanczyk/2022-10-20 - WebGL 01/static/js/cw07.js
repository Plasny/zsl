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

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera)
    }

    render();
    codeBlock();

    document.getElementById("set").addEventListener("click", function () {
        code = {
            x: (Math.random() * 200 - 100).toFixed(2),
            y: (Math.random() * 200 - 100).toFixed(2),
            z: (Math.random() * 200 - 100).toFixed(2)
        }

        camera.position.set(code.x, code.y, code.z);
        camera.lookAt(scene.position);

        codeBlock();
    });

});
