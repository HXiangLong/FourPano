import * as constants from '../../tool/SWConstants';

class SWLittlePlanetModel {
    constructor() {

        let path = `${constants.sw_getService.resourcesUrl}/panoImages/${constants.c_StationInfo.panoID}/${constants.c_StationInfo.panoID}.jpg`;

        let loader = new THREE.TextureLoader();

        this.mesh;
        this.material;
        this.geometry;
        this.dragging = false;
        this.userMouse = new THREE.Vector2();

        this.EPS = 0.000001;
        this.frameId;

        this.quatA = new THREE.Quaternion();
        this.quatB = new THREE.Quaternion();
        this.quatCur = new THREE.Quaternion();
        this.quatSlerp = new THREE.Quaternion();

        this.vectorX = new THREE.Vector3(1, 0, 0);
        this.vectorY = new THREE.Vector3(0, 1, 0);

        let container = document.getElementById('canvas3d');
        container.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        container.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        container.addEventListener('mouseup', this.onMouseUp.bind(this), false);

        loader.load(path,
            (texture) => {
                let uniforms = constants.StereographicShader.uniforms;
                uniforms.zoom.value = 1000;

                this.material = new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: constants.StereographicShader.vertexShader,
                    fragmentShader: constants.StereographicShader.fragmentShader
                });

                texture.minFilter = texture.magFilter = THREE.LinearFilter;

                texture.needsUpdate = true;

                this.material.uniforms["tDiffuse"].value = texture;

                this.material.uniforms.resolution.value = window.innerWidth / window.innerHeight;

                this.geometry = new THREE.PlaneGeometry(2048, 1024);

                this.mesh = new THREE.Mesh(this.geometry, this.material);

                constants.scene.add(this.mesh);
            },
            (xhr) => {},
            (xhr) => {
                console.log(`图片加载失败：${path}`);
            }
        );
    }

    onMouseDown(event) {

        let x = (event.clientX >= 0) ? event.clientX : event.touches[0].clientX;
        let y = (event.clientY >= 0) ? event.clientY : event.touches[0].clientY;

        let inputCount = (event.touches && event.touches.length) || 1;

        switch (inputCount) {

            case 1:

                this.dragging = true;
                this.userMouse.set(x, y);

                break;

            case 2:

                let dx = event.touches[0].pageX - event.touches[1].pageX;
                let dy = event.touches[0].pageY - event.touches[1].pageY;
                let distance = Math.sqrt(dx * dx + dy * dy);
                this.userMouse.pinchDistance = distance;

                break;

            default:

                break;

        }

        this.onUpdateCallback();

    }

    onMouseMove(event) {

        let x = (event.clientX >= 0) ? event.clientX : event.touches[0].clientX;
        let y = (event.clientY >= 0) ? event.clientY : event.touches[0].clientY;

        let inputCount = (event.touches && event.touches.length) || 1;

        switch (inputCount) {

            case 1:

                let angleX = THREE.Math.degToRad(x - this.userMouse.x) * 0.4;
                let angleY = THREE.Math.degToRad(y - this.userMouse.y) * 0.4;

                if (this.dragging) {
                    this.quatA.setFromAxisAngle(this.vectorY, angleX);
                    this.quatB.setFromAxisAngle(this.vectorX, angleY);
                    this.quatCur.multiply(this.quatA).multiply(this.quatB);
                    this.userMouse.set(x, y);
                }

                break;

            case 2:

                let uniforms = this.material.uniforms;
                let dx = event.touches[0].pageX - event.touches[1].pageX;
                let dy = event.touches[0].pageY - event.touches[1].pageY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                this.addZoomDelta(this.userMouse.pinchDistance - distance);

                break;

            default:

                break;

        }

    }

    onMouseUp(event) {

        this.dragging = false;

    }

    reset() {

        this.quatCur.set(0, 0, 0, 1);
        this.quatSlerp.set(0, 0, 0, 1);
        this.onUpdateCallback();

    }

    onUpdateCallback() {

        this.frameId = window.requestAnimationFrame(this.onUpdateCallback.bind(this));

        this.quatSlerp.slerp(this.quatCur, 0.1);
        this.material.uniforms.transform.value.makeRotationFromQuaternion(this.quatSlerp);

        if (!this.dragging && 1.0 - this.quatSlerp.clone().dot(this.quatCur) < this.EPS) {

            window.cancelAnimationFrame(this.frameId);

        }

    }
}

export default SWLittlePlanetModel;