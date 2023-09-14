class Player {
    constructor(cubeSize) {
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshPhongMaterial({
            specular: 0xffffff,
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("mats/crate.jpg"),
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.y = cubeSize / 2;

        return cube;
    }
}
