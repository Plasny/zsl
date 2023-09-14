const toRad = (degrees) => degrees * Math.PI / 180;
var amount = 0;

// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// płaszczyzna
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    wireframe: true,
    color: 0xFFA500,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = toRad(90);

// model
const modelMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("mats/mario/mario2.jpg"),
    morphTargets: true  // opcja odpowiadająca za możliwość animowania materiału modelu
});
const loader = new THREE.JSONLoader();
loader.load('models/mario/mario.json', function (geometry) {

    meshModel = new THREE.Mesh(geometry, modelMaterial)
    meshModel.name = "mario";
    meshModel.rotation.y = toRad(135);  // obrót modelu
    meshModel.position.y = 50;          // pozycje modelu
    meshModel.scale.set(2, 2, 2);       // skalę modelu

    pro = meshModel.clone();

    scene.add(meshModel);

    mixer = new THREE.AnimationMixer(meshModel);
    mixer.clipAction("stand").play();

    let html = document.getElementById("animations");
    for (i in geometry.animations) {
        let btn = document.createElement("button");
        let animation = geometry.animations[i].name;

        btn.innerText = animation;
        btn.addEventListener("click", function () {
            mixer.uncacheRoot(meshModel);
            mixer.clipAction(animation).play();
        });

        html.append(btn);
    }
});

const clock = new THREE.Clock();

// clones
let cloneMixers = [];
function clones() {
    cloneMixers = [];

    while (scene.getObjectByName("clone")) {
        scene.remove(scene.getObjectByName("clone"));
    }

    for (let o = -(amount / 2), i = o, n = amount / 2, t1 = 0; i < n; i++, t1++) {
        cloneMixers[t1] = [];
        for (let j = o, t2 = 0; j < n; j++, t2++) {
            clone = pro.clone();
            clone.name = "clone";
            clone.position.x = i * 100 + 50;
            clone.position.z = j * 100 + 50;

            // to fix
            let cloneMixer = new THREE.AnimationMixer(clone);
            cloneMixer.clipAction("crwalk").play();
            cloneMixers[t1][t2] = cloneMixer;

            scene.add(clone);
        }
    }

}

// funkcja renderująca scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    let delta = clock.getDelta();
    // console.log(delta);
    if (mixer) mixer.update(delta);

    if (cloneMixers.length > 0) {
        // console.log(cloneMixers)
        for(i in cloneMixers) {
            for( j in cloneMixers[i]) {
                cloneMixers[i][j].update(delta);
            }
        }
    }
}

// funkcja dostosowująca rozmiar ekranu kamery z rozmiarem okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("load", function () {
    scene.add(plane);

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(300, 200, 300);
    camera.lookAt(scene.position);

    window.addEventListener('resize', onWindowResize, false);

    render();

    document.getElementById("add").addEventListener("click", function () {
        // console.log("add");
        amount += 2;
        clones()
    });
    document.getElementById("del").addEventListener("click", function () {
        // console.log("del");
        if (amount > 0) {
            amount -= 2;
            clones()
        }
    });
    document.getElementById("rem").addEventListener("click", function () {
        // console.log("rem");
        amount = 0;
        clones()
    });
});
