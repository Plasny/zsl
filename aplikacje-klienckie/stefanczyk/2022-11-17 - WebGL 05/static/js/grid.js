// how to antialias grid?

class Grid {
    constructor(size) {
        const size2 = Math.round(Math.sqrt(size));
        // płaszczyzna
        const planeGeometry = new THREE.PlaneGeometry(size, size, size2, size2);
        const planeMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x000000
        });

        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.rotateX(-Math.PI / 2);
        this.plane.name = "grid";
        this.grid = new THREE.GridHelper(size, size2);
        this.grid.name = "grid";

        this.container = new THREE.Object3D();
        this.container.add(this.plane);
        this.container.add(this.grid);
    }

    getGrid = () => this.container;
}
