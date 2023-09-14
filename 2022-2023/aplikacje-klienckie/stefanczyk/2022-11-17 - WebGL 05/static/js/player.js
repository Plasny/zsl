class Player {
    constructor(cubeSize) {
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize, 2, 2, 2);
        const cubeMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            wireframe: true,
            color: 0x0088FF,
        });

        this.container = new THREE.Object3D();

        this.player = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.player.position.y = cubeSize / 2;
        this.player.name = 'player';
        this.container.add(this.player);

        this.axes = new THREE.AxesHelper(cubeSize * 2); // osie konieczne do kontroli kierunku ruchu
        this.player.add(this.axes);
    }

    //funkcja zwracająca cały kontener
    getCont = () => this.container;

    //funkcja zwracająca playera czyli sam sześcian
    getMesh = () => this.player;
}
