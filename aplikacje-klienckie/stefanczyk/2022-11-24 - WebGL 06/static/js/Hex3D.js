class Hex3D {
    constructor(size, wallWidth, d0, d1, d2, d3, d4, d5) {
        const container = new THREE.Object3D();

        const material = new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide,
        });
        // const material = new THREE.MeshBasicMaterial({
        //     side: THREE.DoubleSide,
        //     wireframe: true,
        //     color: 0x000000
        // });

        const hexGeometry = new THREE.CylinderGeometry(size, size, 1, 6);
        const hex = new THREE.Mesh(hexGeometry, material);
        hex.rotation.y = this.toRad(30);
        container.add(hex);

        const r = (size * Math.sqrt(3)) / 2;
        const h = size / 2;

        const wallGeometry = new THREE.BoxGeometry(size, h, wallWidth);
        const wall = new THREE.Mesh(wallGeometry, material);

        const door = new THREE.Object3D()
        const wall1Geometry = new THREE.BoxGeometry(size * 2 / 7, h, wallWidth);
        const wall1 = new THREE.Mesh(wall1Geometry, material);
        for (let i = 0; i < 2; i++) {
            let wall2 = wall1.clone();
            let size2 = size * 2.5 / 7
            i % 2 == 0 ? wall2.position.x = -size2 : wall2.position.x = size2;
            door.add(wall2);
        }

        for (let i = 0; i < 6; i++) {
            let angle = this.toRad(60 * (-i));

            let side;
            if (d0 == i || d1 == i || d2 == i || d3 == i || d4 == i || d5 == i) {
                side = door.clone();
            } else {
                side = wall.clone();
            }

            side.position.z = r * -Math.cos(angle);
            side.position.x = r * -Math.sin(angle);
            side.lookAt(container.position);
            side.position.y = h / 2;
            container.add(side);
        }

        // center content in container
        const box = new THREE.Box3().setFromObject(container);
        const c = box.getCenter(new THREE.Vector3());
        container.position.set(-c.x, 0, -c.z);

        return container;
    }

    toRad = (degrees) => degrees * Math.PI / 180;
}
