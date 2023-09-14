class Light {

    constructor() {

        this.container = new THREE.Object3D();

        //wywołanie funkcji init()
        this.init()
    }

    init() {

        // utworzenie i pozycjonowanie światła
        this.light = new THREE.PointLight(0xffffff, 1);
        this.light.position.set(0, 0, 0); // ma być w pozycji 0,0,0 kontenera - nie zmieniamy!!!

        // dodanie światła do kontenera
        this.container.add(this.light);

        //utworzenie widzialnego elementu reprezentującego światło (mały sześcian, kula, czworościan foremny, do wyboru)
        const geometry = new THREE.SphereGeometry(15, 32, 16);
        const material = new THREE.MeshBasicMaterial({
            wireframe: true
        });
        this.mesh = new THREE.Mesh(geometry, material);

        // dodanie go do kontenera
        this.container.add(this.mesh);
    }


    // funkcja zwracająca obiekt kontenera
    // czyli nasze światło wraz z bryłą
    getLight() {
        return this.container;
    }

    setIntensity(num) {
        this.light.intensity = num;
    }

}
