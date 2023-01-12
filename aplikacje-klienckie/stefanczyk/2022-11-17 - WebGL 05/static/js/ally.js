class Ally {
    constructor(sphereRadius) {
        this.size = sphereRadius;
        const sphereGeometry = new THREE.SphereGeometry(sphereRadius);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            wireframe: true,
            color: 0x00FF88,
        });

        this.container = new THREE.Object3D();

        this.ally = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.ally.position.y = sphereRadius;
        this.ally.name = 'ally';
        this.container.add(this.ally);

        this.axes = new THREE.AxesHelper(sphereRadius * 2); // osie konieczne do kontroli kierunku ruchu
        this.ally.add(this.axes);
    }

    // set target to follow
    follow = (target) => this.target = target;

    //funkcja zwracająca cały kontener
    getCont = () => this.container;

    //funkcja zwracająca allya czyli samą kulę 
    getMesh = () => this.ally;

    // move towards selected target at a given speed
    move(speed) {
        // rotate
        let allyPosiotion = this.getCont().position.clone();
        let targetPosition = this.target.position.clone();
        let angle = Math.atan2(
            - (allyPosiotion.x - targetPosition.x),
            - (allyPosiotion.z - targetPosition.z)
        );
        this.getMesh().rotation.y = angle;

        // move
        let directionVector = targetPosition.sub(this.getCont().position).normalize();
        let distance = this.target.position.distanceTo(this.getCont().position);
        if (distance > this.size * 2) {
            this.getCont().translateOnAxis(directionVector, speed);
        }
    }

    // funkcja ustawiająca allya w losowej pozycji na planszy
    randPosition = (minX, maxX, minY, maxY, minZ, maxZ) => {
        this.container.position.x = this.range(minX, maxX);
        this.container.position.y = this.range(minY, maxY);
        this.container.position.z = this.range(minZ, maxZ);
    }

    // funkcja zwracająca losową wartość z danego przedziału
    range = (start, end) => Math.random() * (-start + end) + start;
}
