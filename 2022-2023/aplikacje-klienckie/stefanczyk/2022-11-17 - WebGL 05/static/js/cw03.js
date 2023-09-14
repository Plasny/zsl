// TODO fix following 

// stałe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 10000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const dist = 250;

// płaszczyzna
const gridSize = 1000;
const gridLen = gridSize / 2;
const plane = new Grid(gridSize).getGrid();
scene.add(plane);

// gracz
const playerSize = 26;
const speed = 3;
const player = new Player(playerSize);
scene.add(player.getCont());

// sojusznicy
const allySize = 13;
const allyNumber = 8;
const allies = [];
for (let i = 0; i < allyNumber; i++) {
    allies[i] = new Ally(allySize);
    allies[i].randPosition(-gridLen, gridLen, 0, 0, -gridLen, gridLen);
    allies[i].getMesh().userData.nu = i;
    scene.add(allies[i].getCont());
}

// lista obiektów za którymi coś podąża
let toFollow = [player.getCont()];

// funkcja renderująca scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    if (player.getCont().position.clone().distanceTo(clickedVect) > 2) {
        // 3 - przewidywany speed czyli względna szybkość ruchu po planszy
        player.getCont().translateOnAxis(directionVect, speed);
    }

    for (p of ['x', 'y', 'z'])
        camera.position[p] = player.getCont().position[p] + dist;
    camera.position.x -= dist;
    camera.lookAt(player.getCont().position)

    allies.forEach(ally => {
        if (ally.target != undefined) {
            ally.move(speed);
        }
    });
}

// funkcja dostosowująca rozmiar ekranu kamery z rozmiarem okna
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("load", function () {
    document.getElementById("root").appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);

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

    let intersectObj = intersects[0].object;
    let intersectName = intersectObj.name;

    if (intersects.length > 0) {
        if (intersectName == "grid") {
            clickedVect = intersects[0].point;

            directionVect = clickedVect.clone().sub(player.getCont().position).normalize(); // sub - > odejmij pozycję playera od pozycji kliknięcia

            let angle = Math.atan2(
                - (player.getCont().position.clone().x - clickedVect.x),
                - (player.getCont().position.clone().z - clickedVect.z)
            );

            player.getMesh().rotation.y = angle;
        } else if (intersectName == "ally") {
            let ally;
            allies.every(obj => {
                // console.log(obj.getMesh());
                if (obj.getMesh().userData.nu == intersectObj.userData.nu) {
                    ally = obj;
                    return false;
                }
                return true;
            });

            let container = ally.getCont();
            if (!toFollow.includes(container)) {
                ally.follow(toFollow[toFollow.length - 1]);
                toFollow.push(container);
                // console.log(toFollow)
            }
        }
    }
});
