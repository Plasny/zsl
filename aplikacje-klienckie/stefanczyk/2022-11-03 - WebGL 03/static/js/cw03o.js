class Test {
    constructor() {
        this.x = 100;
    }

    setX(arg) {
        this.x = arg;
    }

    getX() {
        return this.x;
    }
}

class MyObject3D {
    constructor(x, y, z, size, cubeAmmount) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.cubeX = [];
        this.cubeSize = size;

        const cubeGeometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
        const cubeMaterial = new THREE.MeshPhongMaterial({
            specular: 0xffffff,
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("mats/crate.jpg"),
        });

        this.obj3D = new THREE.Object3D();
        for (let i = 0; i < cubeAmmount; i++) {
            let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            if (i % 2 == 0) {
                let x = this.x - i / 2 * this.cubeSize;
                cube.position.set(x, this.y, this.z);
                this.cubeX[i] = x;
            }
            else {
                let x = this.x;
                cube.position.set(x, this.y, this.z - Math.ceil(i / 2) * this.cubeSize);
                this.cubeX[i] = x;
            }
            cube.name = `cube${i}`;
            this.obj3D.add(cube);
        }
    }

    getCubesX(i) {
        return this.cubeX[i]
    }

    getObj() {
        return this.obj3D;
    }
}
