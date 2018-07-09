/* global THREE*/

import { camera, c_Maxfov, c_Minfov, c_maxPitch, c_minPitch, sw_skyBox } from "../tool/SWConstants";
import { YPRToVector3, getNumberMax360 } from '../tool/SWTool';
const TWEEN = require('@tweenjs/tween.js');

/**
 * 相机控制类只有旋转和缩放，没有平移
 */
class SWCameraModule {
    constructor() {
        /**相机状态枚举 */
        this.STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY_PAN: 4 };

        /**相机目前状态 */
        this.state = this.STATE.NONE;

        /**鼠标按钮 */
        this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

        //这个选项实际上可以使进出进入; 为了向后兼容，保留为“缩放”。
        /**设置为false以禁用缩放 */
        this.enableZoom = true;
        /**缩放速度 */
        this.zoomSpeed = 4.0;

        /**设置为false以禁用旋转 */
        this.enableRotate = true;
        /**旋转速度 */
        this.rotateSpeed = 0.4;

        /**自动旋转 */
        this.autoRotate = true;
        /**自动旋转速度，当fps为60时，每轮30秒 */
        this.autoRotateSpeed = 2.0;

        //设置为true以启用阻尼（惯性）
        //如果启用阻尼，则必须在动画循环中调用controls.update（）
        this.enableDamping = false;
        this.dampingFactor = 0.25;
        this.dampingTime = 0;

        //旋转坐标值
        this.rotateStart = new THREE.Vector2();
        this.rotateEnd = new THREE.Vector2();
        this.rotateDelta = new THREE.Vector2();

        this.startTime = undefined;
        this.speed = { yaw: 0, pitch: 0 };

        //缩放坐标值
        this.dollyStart = new THREE.Vector2();
        this.dollyEnd = new THREE.Vector2();
        this.dollyDelta = new THREE.Vector2();

        this.rotateYaw = 0;
        this.rotatePitch = 0;

        //围绕Y轴旋转，也叫偏航角
        this.yaw_Camera = 0;
        //围绕X轴旋转，也叫做俯仰角
        this.picth_Camera = 0;
        //围绕Z轴旋转，也叫翻滚角
        this.roll_Camera = 0;

        /**是否启用陀螺仪 */
        this.enabledGyro = true;

        this.deviceOrientation = {};
        this.screenOrientation = 0;

        this.alphaOffset = 0; // radians

        this.zee = new THREE.Vector3(0, 0, 1);

        this.euler = new THREE.Euler();

        this.q0 = new THREE.Quaternion();

        this.q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

        this.startAlpha = 0;
        this.startBeta = 0;
        this.startGamma = 0;

        this.lon = this.lat = 0;
        this.moothFactor = 10;
        this.boundary = 320;
        this.lastLon = this.lastLat = undefined;

        /**相机是否推进放大 */
        this.ifCameraEnlarge = false;

        this.setHousesViewAngle(0, 0);

    }


    update() {

        if (this.enableDamping) {

            this.speed.yaw = this.getAutoRotationAngle(this.speed.yaw);

            this.speed.pitch = this.getAutoRotationAngle(this.speed.pitch);

            if (Math.abs(this.speed.yaw) <= 0.2 && Math.abs(this.speed.pitch) <= 0.2) {

                this.enableDamping = false;

                return;
            }

            this.setOverlayViewAngle(parseFloat(this.speed.yaw.toFixed(2)), Math.floor(this.speed.pitch));

        }
    }

    /**获得自动旋转角度 */
    getAutoRotationAngle(speed) {
        if (speed !== 0) {
            if (speed > 0) {
                speed -= this.dampingFactor;
                speed < 0 && (speed = 0);
            } else {
                speed += this.dampingFactor;
                speed > 0 && (speed = 0);
            }
        }
        return speed;
    }

    /**设置缩放比例 */
    getZoomScale() {
        return Math.pow(2, this.zoomSpeed);
    }

    /**缩小 */
    dollyIn(dollyScale) {

        if (camera.isPerspectiveCamera) {

            let fov = Math.max(c_Minfov, Math.min(c_Maxfov, camera.fov + dollyScale));

            if (camera.fov > (c_Maxfov + c_Minfov) * 0.5) {

                this.ifCameraEnlarge = false;

                sw_skyBox.panoBox.clearFaceTiles();

            }

            let from = { x: camera.fov };

            let to = { x: fov };

            new TWEEN.Tween(from)
                .to(to, 800)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function() {

                    camera.fov = this._object.x;
                    console.log("camera.fov：" + camera.fov);

                })
                .onComplete(() => {

                })
                .start();

            camera.updateProjectionMatrix();

        }

    }

    /**放大 */
    dollyOut(dollyScale) {

        if (camera.isPerspectiveCamera) {

            let fov = Math.max(c_Minfov, Math.min(c_Maxfov, camera.fov - dollyScale));

            camera.updateProjectionMatrix();

            if (camera.fov < (c_Maxfov + c_Minfov) * 0.5) {

                this.ifCameraEnlarge = true;

                sw_skyBox.panoBox.addFaceTiles();

            }

            let from = { x: camera.fov };

            let to = { x: fov };

            new TWEEN.Tween(from)
                .to(to, 800)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function() {

                    camera.fov = this._object.x;
                    console.log("camera.fov：" + camera.fov);

                })
                .onComplete(() => {

                })
                .start();
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

            this.startTime = Date.now();

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

            this.setOverlayViewAngle(this.rotateYaw, this.rotatePitch);

            this.slowMove(10);

            this.rotateStart.copy(this.rotateEnd);
        }
    }

    /**
     * 鼠标弹起,旋转拖尾效果
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

                this.startTime = Date.now();

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

                if (this.enableRotate === false || this.state !== this.STATE.TOUCH_ROTATE) return;

                this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);

                this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(this.rotateSpeed);

                this.rotateYaw = THREE.Math.radToDeg(2 * Math.PI * this.rotateDelta.x / window.innerWidth); // 显示区域

                this.rotatePitch = THREE.Math.radToDeg(2 * Math.PI * this.rotateDelta.y / window.innerHeight);

                this.setOverlayViewAngle(parseFloat(this.rotateYaw.toFixed(2)), Math.floor(this.rotatePitch));

                this.slowMove(20);

                this.rotateStart.copy(this.rotateEnd);

                break;

            case 2: // 双指触摸：移动/缩放

                if (this.enableZoom === false || this.state !== this.STATE.TOUCH_DOLLY_PAN) return;

                let dx = event.touches[0].pageX - event.touches[1].pageX;
                let dy = event.touches[0].pageY - event.touches[1].pageY;

                let distance = Math.sqrt(dx * dx + dy * dy);

                this.dollyEnd.set(0, distance);

                this.dollyDelta.set(0, -(this.dollyEnd.y - this.dollyStart.y) * 0.5 / this.zoomSpeed);

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

        if (event.touches.length === 1) {

            this.state = this.STATE.TOUCH_ROTATE;

            this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);

            this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);

        } else if (event.touches.length === 0) {

            this.state = this.STATE.NONE;

        }

    }

    /**
     * 帮助转动，使转动更加轻松
     * @param {Number} card 缓动值
     */
    slowMove(card) {

        this.speed = { yaw: (this.rotateEnd.x - this.rotateStart.x), pitch: (this.rotateEnd.y - this.rotateStart.y) };

        this.dampingTime = (Date.now() - this.startTime) / card;

        let yy = (this.speed.yaw / this.dampingTime) > 0 ?
            ((this.speed.yaw / this.dampingTime) > 8 ? 8 : (this.speed.yaw / this.dampingTime)) :
            ((this.speed.yaw / this.dampingTime) < -8 ? -8 : (this.speed.yaw / this.dampingTime));

        let pp = (this.speed.pitch / this.dampingTime) > 0 ?
            ((this.speed.pitch / this.dampingTime) > 3 ? 3 : (this.speed.pitch / this.dampingTime)) :
            ((this.speed.pitch / this.dampingTime) < -3 ? -3 : (this.speed.pitch / this.dampingTime));

        this.speed = { yaw: yy, pitch: pp };

        this.enableDamping = true;
    }

    /**
     * 监听并接收设备方向变化信息,检测手机倾斜旋转
     *         z   
     *         |   y
     *         |  /   
     *         | /
     *          ————————X
     * @param {*} event 
     */
    onDeviceOrientationChangeEvent(event) {
        if (this.enabledGyro) {

            if (event) {

                let alpha = event.alpha ? THREE.Math.degToRad(parseFloat((event.alpha - this.startAlpha).toFixed(2))) + this.alphaOffset : 0; // Z

                let beta = event.beta ? THREE.Math.degToRad(parseFloat((event.beta - this.startBeta).toFixed(2))) : 0; // X'

                let gamma = event.gamma ? THREE.Math.degToRad(parseFloat((event.gamma).toFixed(2))) : 0; // Y''

                let orient = this.screenOrientation ? THREE.Math.degToRad(this.screenOrientation) : 0; // O

                this.setObjectQuaternion(camera.quaternion, alpha, beta, gamma, orient);
            }
        }
    }

    /**
     * 浏览器横竖屏切换检测
     */
    onScreenOrientationChangeEvent() {

        this.screenOrientation = window.orientation || 0;

    }

    /**
     * 重新定义相机的四元素
     * @param {Quaternion} quaternion 相机的旋转四元素
     * @param {Number} alpha 设备沿 Z 轴旋转的弧度值
     * @param {Number} beta 设备在 x 轴上的旋转弧度值
     * @param {Number} gamma 设备在 y 轴上的旋转弧度值
     * @param {Number} orient 浏览器横竖屏朝向的弧度值
     */
    setObjectQuaternion(quaternion, alpha, beta, gamma, orient) {

        this.euler.set(beta, alpha, -gamma, 'YXZ'); //欧拉角是绕坐标轴旋转的角度和顺序,按照heading , pitch , roll 的顺序，应该是 YXZ

        quaternion.setFromEuler(this.euler); // 从欧拉角设置四元数

        quaternion.multiply(this.q1); //四元数的乘法

        quaternion.multiply(this.q0.setFromAxisAngle(this.zee, -orient)); // 从任意轴的旋转角设置四元数
    }

    /**
     * 有激光点云时点击墙面会放大
     */
    setWallWheel() {
        if (camera.isPerspectiveCamera) {

            if (camera.fov > c_Minfov) { //放大

                this.dollyOut((c_Maxfov - c_Minfov) / 3);

            } else if (camera.fov == c_Minfov) { //还原

                this.dollyIn(100);

            }
        }
    }

    /**
     * 这个是直接设置相机视角值
     * @param {*} yaws 经度
     * @param {*} pitch 纬度
     */
    setHousesViewAngle(yaws, pitch) {

        if (yaws) this.yaw_Camera = yaws;

        if (pitch) this.picth_Camera = pitch;

        camera.lookAt(YPRToVector3(this.yaw_Camera, this.picth_Camera));

        if (this.ifCameraEnlarge) {

            sw_skyBox.panoBox.addFaceTiles();

        }
    }

    /**
     * 叠加相机角度
     * @param {*} yaws 经度
     * @param {*} pitch 纬度
     */
    setOverlayViewAngle(yaws, pitch) {

        this.picth_Camera = Math.max(c_minPitch, Math.min(c_maxPitch, this.picth_Camera + pitch));

        this.yaw_Camera = getNumberMax360(this.yaw_Camera + yaws);

        if (isNaN(this.picth_Camera)) this.picth_Camera = 0;

        if (isNaN(this.yaw_Camera)) this.yaw_Camera = 0;

        this.setHousesViewAngle();
    }
}

export default SWCameraModule;