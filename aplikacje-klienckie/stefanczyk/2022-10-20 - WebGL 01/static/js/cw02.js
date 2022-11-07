let fov = 60;

window.addEventListener("load", function () {
    // webgl setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.1, 10000
    );
    const renderer = new THREE.WebGLRenderer();

    // for axes
    const axes = new THREE.AxesHelper(1000);

    // for cube
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({
        color: 0x8888ff,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
        opacity: 0.5
    });
    const cube = new THREE.Mesh(geometry, material);

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(100, 0, 100);
    camera.lookAt(scene.position);

    scene.add(axes);
    scene.add(cube);


    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera)

        cube.rotation.y += 0.01;

        camera.fov = fov;
        camera.updateProjectionMatrix();
    }

    render();

    function codeBlock() {
        code = { "fov": fov };
        document.getElementById("code").innerHTML = JSON.stringify(code, null, 3);
    }

    codeBlock();

    document.getElementById("fov").addEventListener("change", function () {
        fov = document.getElementById("fov").value;
        codeBlock();
        // console.log(fov);
    });
})
