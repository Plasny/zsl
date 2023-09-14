import { texturePath } from "../Game.js";

export class CheckersPawn extends THREE.Mesh {
    constructor({ size = 80, dark = false }) {
        const segments = 50;
        let color;

        dark ? color = 0x303030 : color = 0xe0e0e0;

        super(
            new THREE.CylinderGeometry(size / 2, size / 2, size / 4, segments),
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: color,
                map: new THREE.TextureLoader().load(texturePath),
            })
        );

        this.userData.super = false;
        this.userData.color = color;
    }

    Select() {
        this.material.color.setHex(0xffff00);
    }

    Unselect() {
        this.material.color.setHex(this.userData.color);
    }

    SetPosition(x, z) {
        this.userData.x = x;
        this.userData.z = z;
    }

    MakeSuper() {
        this.material.wireframe = true;
        this.userData.super = true;
    }
}
