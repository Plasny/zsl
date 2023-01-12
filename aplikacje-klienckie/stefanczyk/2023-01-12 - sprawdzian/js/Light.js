class Light {
    constructor(y, position, angle) {
        this.y = y;
        this.position = position;
        this.angle = angle;

        this.container = new THREE.Object3D();

        this.light = new THREE.SpotLight(0xffffff);
        this.light.position.set(0, 0, 0);
        this.container.add(this.light);

        const geometry = new THREE.SphereGeometry(5, 16, 8);
        const material = new THREE.MeshBasicMaterial({
            wireframe: true,
        });
        material.color.setHex('0xffff00')
        this.mesh = new THREE.Mesh(geometry, material);
        this.container.add(this.mesh);

        this.changePosition();
    }

    changePosition() {
        const z = Math.cos(this.angle) * this.position;
        const x = Math.sin(this.angle) * this.position;
        this.container.position.set(x, this.y, z);
    }

    GetLight() {
        return this.container;
    }

    SetPosition(num) {
        this.position = num;
        this.changePosition();
    }

    SetY(num) {
        this.y = num;
        this.changePosition();
    }

    SetColor(color) {
        this.light.color.set(color);
    }
}
