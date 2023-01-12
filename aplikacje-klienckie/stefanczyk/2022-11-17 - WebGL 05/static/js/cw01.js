// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const dist = 400;

// gracz
const player = new Player(25);

// płaszczyzna
const plane = new Grid(1000).getGrid();

// kulka
const sphereGeometry = new THREE.SphereGeometry(10, 10, 10);
const sphereMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    wireframe: true,
    color: 0xFF0000,
});
const redBall = new THREE.Mesh(sphereGeometry, sphereMaterial);

// funkcja renderująca scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    if (player.getCont().position.clone().distanceTo(clickedVect) > 2) {
        // 3 - przewidywany speed czyli względna szybkość ruchu po planszy
        player.getCont().translateOnAxis(directionVect, 3);
    }

    for (p of ['x', 'y', 'z'])
        camera.position[p] = player.getCont().position[p] + dist;
    camera.position.x -= dist;
    camera.lookAt(player.getCont().position)
}

// funkcja dostosowująca rozmiar ekranu kamery z rozmiarem okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("load", function () {
    scene.add(plane);
    scene.add(player.getCont());

    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.lookAt(scene.position);

    window.addEventListener('resize', onWindowResize, false);

    render();
});

//   ---------------------------------------------------------------------- 

/* obiekt Raycastera symulujący "rzucanie" promieni */
const raycaster = new THREE.Raycaster();

/*
 * ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie 
 * do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D
 */
const mouseVector = new THREE.Vector2();

/* punkt w który kliknie mysz w przestrzeni 3D */
let clickedVect = new THREE.Vector3(0, 0, 0);

/* wektor określający kierunek ruchu playera w przestrzeni 3D */
let directionVect = new THREE.Vector3(0, 0, 0);

window.addEventListener("mousedown", (e) => {
    mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

    /* szukanie punktów wspólnych "promienia" i obiektu 3D */
    raycaster.setFromCamera(mouseVector, camera);

    /* tablica obiektów w które "trafia" nasz "promień" wysyłany z kamery */
    let intersects = raycaster.intersectObjects(scene.children);
    // console.log(intersects.length);

    if (intersects.length > 0) {
        clickedVect = intersects[0].point;
        // console.log(clickedVect)

        /* czerwona kulka w miejscu kliknięcia */
        for (p of ['x', 'y', 'z'])
            redBall.position[p] = clickedVect[p];
        scene.add(redBall);

        directionVect = clickedVect.clone().sub(player.getCont().position).normalize(); // sub - > odejmij pozycję playera od pozycji kliknięcia
        // console.log(directionVect)

        //użyta wyżej funkcja normalize() przelicza proporcjonalnie współrzędne x,y,z wektora na zakres 0-1
        //jest to wymagane przez kolejne funkcje   

        // console.log(player.getCont().position.clone().distanceTo(clickedVect));

        let angle = Math.atan2(
            - (player.getCont().position.clone().x - clickedVect.x),
            - (player.getCont().position.clone().z - clickedVect.z)
        );

        player.getMesh().rotation.y = angle;
    }
});
