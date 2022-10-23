const BoxGeometry = new THREE.BoxGeometry(100, 100, 100, 3, 3, 3);
const BoxMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    wireframe: true,
});
const cube = new THREE.Mesh(BoxGeometry, BoxMaterial);

const SphereGeometry = new THREE.SphereGeometry(50, 10, 10);
const SphereMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    wireframe: true,
});
const sphere = new THREE.Mesh(SphereGeometry, SphereMaterial);

const ConeGeometry = new THREE.ConeGeometry(50, 100, 20, 3);
const ConeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    wireframe: true,
});
const cone = new THREE.Mesh(ConeGeometry, ConeMaterial);

const CylinderGeometry = new THREE.CylinderGeometry(50, 50, 100, 20);
const CylinderMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    wireframe: true,
});
const cylinder = new THREE.Mesh(CylinderGeometry, CylinderMaterial);
