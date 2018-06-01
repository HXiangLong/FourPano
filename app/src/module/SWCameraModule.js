import { camera, c_Maxfov, c_Minfov } from "../tool/SWConstants";
import { YPRToVector3, getNumberMax360 } from '../tool/SWTool'

/**
 * 相机控制类只有旋转和缩放，没有平移
 */
class SWCameraModule {
    constructor() {
        /**相机状态枚举 */
        this.STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY_PAN: 4 };

        /**相机目前状态 */
        this.state = this.STATE.NONE;

        /**更新条件 */
        this.EPS = 0.000001;

        /**鼠标按钮 */
        this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

        /**查看球的坐标*/
        this.spherical = new THREE.Spherical();
        /**操作球的坐标*/
        this.sphericalDelta = new THREE.Spherical();

        //这个选项实际上可以使进出进入; 为了向后兼容，保留为“缩放”。
        /**设置为false以禁用缩放 */
        this.enableZoom = true;
        /**缩放速度 */
        this.zoomSpeed = 2.0;

        /**设置为false以禁用旋转 */
        this.enableRotate = true;
        /**旋转速度 */
        this.rotateSpeed = 1.5;

        /**自动旋转 */
        this.autoRotate = true;
        /**自动旋转速度，当fps为60时，每轮30秒 */
        this.autoRotateSpeed = 2.0;

        //缩放距离（仅适用于PerspectiveCamera）
        this.minDistance = 100;
        this.maxDistance = 500;

        //相机水平上限和下限
        //如果设置，则必须是区间[ - Math.PI，Math.PI]的子区间。
        this.minAzimuthAngle = -Math.PI; // 弧度
        this.maxAzimuthAngle = Math.PI; // 弧度

        //相机垂直上限和下限
        //范围从-Math.PI到Math.PI弧度。
        this.minPolarAngle = -Math.PI / 2; // 弧度
        this.maxPolarAngle = Math.PI / 2; // 弧度

        //设置为true以启用阻尼（惯性）
        //如果启用阻尼，则必须在动画循环中调用controls.update（）
        this.enableDamping = true;
        this.dampingFactor = 0.25;

        this.scale = 1;
        this.zoomChanged = false;

        //旋转坐标值
        this.rotateStart = new THREE.Vector2();
        this.rotateEnd = new THREE.Vector2();
        this.rotateDelta = new THREE.Vector2();

        //缩放坐标值
        this.dollyStart = new THREE.Vector2();
        this.dollyEnd = new THREE.Vector2();
        this.dollyDelta = new THREE.Vector2();

        //可以放大或缩小多少（仅限OrthographicCamera）
        this.minZoom = 0;
        this.maxZoom = Infinity;

        //“target”设置焦点的位置，对象绕过的位置
        this.target = new THREE.Vector3();

        this.offset = new THREE.Vector3();

        // 所以camera.up是轨道轴
        this.quat = new THREE.Quaternion().setFromUnitVectors(camera.up, new THREE.Vector3(0, 1, 0));
        this.quatInverse = this.quat.clone().inverse();

        this.lastPosition = new THREE.Vector3();
        this.lastQuaternion = new THREE.Quaternion();

        this.rotateYaw = 0;
        this.rotatePitch = 0;

        // 围绕X轴旋转，也叫做俯仰角
        this.maxPitch = 85;
        //围绕X轴旋转，也叫做俯仰角
        this.minPitch = -85;
        //75.0179580971,//围绕Y轴旋转，也叫偏航角
        this.yaw_Camera = 0;
        //围绕X轴旋转，也叫做俯仰角
        this.picth_Camera = 0;
        //围绕Z轴旋转，也叫翻滚角
        this.roll_Camera = 0;

    }

    update() {


        // this.offset.copy(camera.position);

        // // 将偏移量旋转到“y轴向上”空间
        // this.offset.applyQuaternion(this.quat);

        // // 从z轴绕y轴的角度
        // this.spherical.setFromVector3(this.offset);

        // if (this.autoRotate && this.state === this.STATE.NONE) {

        //     this.rotateLeft(this.getAutoRotationAngle());

        // }

        // this.spherical.theta += this.sphericalDelta.theta;
        // this.spherical.phi += this.sphericalDelta.phi;

        // // 将θ限制在期望的限制之间
        // this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));

        // //限制phi在期望的限制之间
        // this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));

        // this.spherical.makeSafe();

        // this.spherical.radius *= this.scale;

        // //将半径限制在期望的限制之间
        // this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));

        // this.offset.setFromSpherical(this.spherical);

        // //将偏移量旋转回“camera-up-vector-is-up”空间
        // this.offset.applyQuaternion(this.quatInverse);

        // // position.copy(this.target).add(this.offset);

        // camera.lookAt(this.offset);

        // if (this.enableDamping === true) {

        //     this.sphericalDelta.theta *= (1 - this.dampingFactor);
        //     this.sphericalDelta.phi *= (1 - this.dampingFactor);

        // } else {
        //     this.sphericalDelta.set(0, 0, 0);
        // }

        // this.scale = 1;

        // //更新条件是：
        // // min（相机位移，相机以弧度旋转）^ 2> EPS
        // //使用小角度逼近cos（x / 2）= 1 - x ^ 2/8
        // if (this.zoomChanged ||
        //     this.lastPosition.distanceToSquared(camera.position) > this.EPS ||
        //     8 * (1 - this.lastQuaternion.dot(camera.quaternion)) > this.EPS) {

        //     // this.dispatchEvent(this.changeEvent);

        //     this.lastPosition.copy(camera.position);
        //     this.lastQuaternion.copy(camera.quaternion);
        //     this.zoomChanged = false;

        //     return true;
        // }
        // return false;
    }

    /**获得自动旋转角度 */
    getAutoRotationAngle() {
        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
    }

    /**设置缩放比例 */
    getZoomScale() {
        return Math.pow(2, this.zoomSpeed);
    }

    /**缩小 */
    dollyIn(dollyScale) {

        if (camera.isPerspectiveCamera) {

            camera.fov = Math.max(c_Minfov, Math.min(c_Maxfov, camera.fov + dollyScale));

        } else if (camera.isOrthographicCamera) {

            camera.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, camera.zoom * dollyScale));
            camera.updateProjectionMatrix();
            this.zoomChanged = true;

        } else {
            this.enableZoom = false;
        }
    }

    /**放大 */
    dollyOut(dollyScale) {

        if (camera.isPerspectiveCamera) {

            camera.fov = Math.max(c_Minfov, Math.min(c_Maxfov, camera.fov - dollyScale));

        } else if (camera.isOrthographicCamera) {

            camera.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, camera.zoom / dollyScale));
            camera.updateProjectionMatrix();
            this.zoomChanged = true;

        } else {
            this.enableZoom = false;
        }
    }

    /**
     * 鼠标按下
     * @param {MouseEvent} event 
     */
    onMouseDown(event) {

        event.preventDefault();

        if (event.button == this.mouseButtons.ORBIT) {

            if (this.enableRotate === false) return;

            this.rotateStart.set(event.clientX, event.clientY);

            this.state = this.STATE.ROTATE;
        }
    }

    /**
     * 鼠标移动
     * @param {MouseEvent} event 
     */
    onMouseMove(event) {

        event.preventDefault();

        if (this.state == this.STATE.ROTATE) {

            if (this.enableRotate === false) return;

            this.rotateEnd.set(event.clientX, event.clientY);

            this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(this.rotateSpeed);

            this.rotateYaw = THREE.Math.radToDeg(2 * Math.PI * this.rotateDelta.x / window.innerWidth); // 显示区域

            this.rotatePitch = THREE.Math.radToDeg(2 * Math.PI * this.rotateDelta.y / window.innerHeight);

            this.cameraLookAt(this.rotateYaw, this.rotatePitch);

            this.rotateStart.copy(this.rotateEnd);
        }
    }

    /**
     * 鼠标弹起
     * @param {MouseEvent} event 
     */
    onMouseUp(event) {

        this.state = this.STATE.NONE;

    }

    /**
     * 滚轮缩放
     * @param {MouseEvent} event 
     */
    onMouseWheel(event) {

        if (this.enableZoom === false || (this.state !== this.STATE.NONE && this.state !== this.STATE.ROTATE)) return;

        event.preventDefault();
        event.stopPropagation();

        if (event.deltaY < 0) {

            this.dollyOut(this.getZoomScale());

        } else if (event.deltaY > 0) {

            this.dollyIn(this.getZoomScale());

        }
    }

    /**
     * 手指按下
     * @param {MouseEvent} event 
     */
    onTouchStart(event) {

        event.preventDefault();

        switch (event.touches.length) {

            case 1: // 单指触摸：旋转

                if (this.enableRotate === false) return;

                this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);

                this.state = this.STATE.TOUCH_ROTATE;

                break;

            case 2: // 双指触摸：移动/缩放

                if (this.enableZoom === false && this.enablePan === false) return;

                if (this.enableZoom) {

                    let dx = event.touches[0].pageX - event.touches[1].pageX;
                    let dy = event.touches[0].pageY - event.touches[1].pageY;

                    let distance = Math.sqrt(dx * dx + dy * dy);

                    this.dollyStart.set(0, distance);
                }

                this.state = this.STATE.TOUCH_DOLLY_PAN;

                break;

            default:
                this.state = this.STATE.NONE;

        }

    }

    /**
     * 手指移动
     * @param {MouseEvent} event 
     */
    onTouchMove(event) {

        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {

            case 1: // 单指触摸：旋转

                if (this.enableRotate === false) return;
                if (this.state !== this.STATE.TOUCH_ROTATE) return; // is this needed?

                this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);

                this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(this.rotateSpeed);

                this.rotateYaw = THREE.Math.radToDeg(2 * Math.PI * this.rotateDelta.x / window.innerWidth); // 显示区域

                this.rotatePitch = THREE.Math.radToDeg(2 * Math.PI * this.rotateDelta.y / window.innerHeight);

                this.cameraLookAt(this.rotateYaw, this.rotatePitch);

                this.rotateStart.copy(this.rotateEnd);

                this.update();

                break;

            case 2: // 双指触摸：移动/缩放

                if (this.enableZoom === false && this.enablePan === false) return;
                if (this.state !== this.STATE.TOUCH_DOLLY_PAN) return; // is this needed?

                let dx = event.touches[0].pageX - event.touches[1].pageX;
                let dy = event.touches[0].pageY - event.touches[1].pageY;

                let distance = Math.sqrt(dx * dx + dy * dy);

                this.dollyEnd.set(0, distance);

                this.dollyDelta.set(0, Math.pow(this.dollyEnd.y / this.dollyStart.y, this.zoomSpeed));

                this.dollyIn(this.dollyDelta.y);

                this.dollyStart.copy(this.dollyEnd);
                break;

            default:

                this.state = this.STATE.NONE;
        }

    }

    /**
     * 手指弹起
     * @param {MouseEvent} event 
     */
    onTouchEnd(event) {

        this.state = this.STATE.NONE;

    }

    /**
     * 有激光点云时点击墙面会放大
     * @param {Number} type 
     */
    setWallWheel(type) {

    }

    /**
     * 这个是直接设置相机视角值
     * @param {*} yaws 
     * @param {*} pitch 
     */
    setHousesViewAngle(yaws, pitch) {
        if (yaws) this.yaw_Camera = yaws;
        if (pitch) this.picth_Camera = pitch;
        camera.lookAt(YPRToVector3(this.yaw_Camera, this.picth_Camera, 0));
    };

    /**
     * 这是设置累加值
     * @param {*} yaws 
     * @param {*} pitch 
     */
    cameraLookAt(yaws, pitch) {
        this.picth_Camera = Math.max(this.minPitch, Math.min(this.maxPitch, this.picth_Camera + pitch));
        this.yaw_Camera = getNumberMax360(this.yaw_Camera + yaws);

        camera.lookAt(YPRToVector3(this.yaw_Camera, this.picth_Camera, 0));
    };
}

export default SWCameraModule;