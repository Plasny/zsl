window.addEventListener("load", function () {
    const scene = new THREE.Scene();
    const axes = new THREE.AxesHelper(1000);
    scene.add(axes);

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );

    const renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(0xffffff);

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("root").appendChild(renderer.domElement);

    camera.position.set(100, 100, 100)

    camera.lookAt(scene.position);

    function render() {

        requestAnimationFrame(render);

        // console.log("render leci")

        renderer.render(scene, camera);
    }

    // na koniec jednokrotne wykonanie powyższej funkcji
    render();

});
