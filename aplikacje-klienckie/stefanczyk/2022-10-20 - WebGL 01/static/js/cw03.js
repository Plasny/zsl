let code = [];
let box = false;
let sph = false;
let cyl = false;
let con = false;

function randHex(size) {
    let result = [];
    for (let i = 0; i < size; i++)
        result[i] = Math.floor(Math.random() * 16).toString(16);

    // console.log(result.join(''));
    return '0x'+result.join('');
}

window.addEventListener("load", function () {
    // webgl setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.1, 10000
    );
    const renderer = new THREE.WebGLRenderer();

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

    document.getElementById("box").addEventListener("click", function () {
        let codeElem = { "type": "Mesh", "geometry": "BoxGeometry" };

        if (box) {
            box = false;
            this.innerText = "Box";
            scene.remove(cube);

            let index = code.map(x => {
                return x.geometry;
            }).indexOf(codeElem.geometry);
            code.splice(index, 1);
        } else {
            box = true;
            this.innerText = "dodano";
            cube.material.color.setHex(randHex(6));
            scene.add(cube);
            code.push(codeElem);
        }

        codeBlock();
    });
    document.getElementById("sph").addEventListener("click", function () {
        let codeElem = { "type": "Mesh", "geometry": "SphereGeometry" };

        if (sph) {
            sph = false;
            this.innerText = "Sphere";
            scene.remove(sphere);

            let index = code.map(x => {
                return x.geometry;
            }).indexOf(codeElem.geometry);
            code.splice(index, 1);
        } else {
            sph = true;
            this.innerText = "dodano";
            sphere.material.color.setHex(randHex(6));
            scene.add(sphere);
            code.push(codeElem);
        }

        codeBlock();
    });
    document.getElementById("con").addEventListener("click", function () {
        let codeElem = { "type": "Mesh", "geometry": "ConeGeometry" };

        if (con) {
            con = false;
            this.innerText = "Cone";
            scene.remove(cone);

            let index = code.map(x => {
                return x.geometry;
            }).indexOf(codeElem.geometry);
            code.splice(index, 1);
        } else {
            con = true;
            this.innerText = "dodano";
            cone.material.color.setHex(randHex(6));
            scene.add(cone);
            code.push(codeElem);
        }

        codeBlock();
    });
    document.getElementById("cyl").addEventListener("click", function () {
        let codeElem = { "type": "Mesh", "geometry": "CylinderGeometry" };

        if (cyl) {
            cyl = false;
            this.innerText = "Cylinder";
            scene.remove(cylinder);

            let index = code.map(x => {
                return x.geometry;
            }).indexOf(codeElem.geometry);
            code.splice(index, 1);
        } else {
            cyl = true;
            this.innerText = "dodano";
            cylinder.material.color.setHex(randHex(6));
            scene.add(cylinder);
            code.push(codeElem);
        }

        codeBlock();
    });
});
