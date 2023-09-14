import { texturePath } from "../Game.js";

export class CheckersBoard {
    constructor(size) {
        const container = new THREE.Object3D();

        const geometry = new THREE.BoxGeometry(size, size / 5, size);
        const lightMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xc0c0c0,
            map: new THREE.TextureLoader().load(texturePath)
        });
        const darkMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x205020,
            map: new THREE.TextureLoader().load(texturePath)
        });

        for (let i = -3.5, x = 0; i <= 3.5; i++, x++) {
            for (let j = -3.5, z = 0; j <= 3.5; j++, z++) {
                let tile;
                if ((i + j) % 2 == 0) {
                    tile = new ownMesh(geometry.clone(), darkMaterial.clone());
                    tile.userData.ok = true;
                } else {
                    tile = new ownMesh(geometry.clone(), lightMaterial.clone());
                    tile.userData.ok = false;
                }

                tile.position.x = i * size;
                tile.position.z = j * size;
                tile.userData.x = x;
                tile.userData.z = z;

                container.add(tile);
            }
        }

        return container;
    }
}

class ownMesh extends THREE.Mesh {
    Select() {
        this.prevColor = this.material.color.getHex();
        this.material.color.setHex(0xff8800);
    }
    Unselect() {
        this.material.color.setHex(this.prevColor);
    }
}
