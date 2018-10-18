/* global THREE*/

import {
	camera,
	c_Maxfov,
	c_Minfov,
	c_maxPitch,
	c_minPitch,
	sw_skyBox
} from '../tool/SWConstants';
import {
	YPRToVector3,
	getNumberMax360
} from '../tool/SWTool';
import initStore from '../../views/redux/store/store';
import {
	show_PanoMap_fun
} from '../../views/redux/action';

const TWEEN = require('@tweenjs/tween.js');

/**
 * 相机控制类只有旋转和缩放，没有平移
 */
class SWCameraModule {
	constructor() {
		/**相机状态枚举 */
		this.STATE = {
			NONE: -1,
			ROTATE: 0,
			DOLLY: 1,
			PAN: 2,
			TOUCH_ROTATE: 3,
			TOUCH_DOLLY_PAN: 4
		};

		/**相机目前状态 */
		this.state = this.STATE.NONE;

		/**鼠标按钮 */
		this.mouseButtons = {
			ORBIT: THREE.MOUSE.LEFT,
			ZOOM: THREE.MOUSE.MIDDLE,
			PAN: THREE.MOUSE.RIGHT
		};

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

		//旋转坐标值
		this.rotateStart = new THREE.Vector2();
		this.rotateEnd = new THREE.Vector2();
		this.rotateDelta = new THREE.Vector2();

		this.startTime = 0;

		this.speed = {
			yaw: 0,
			pitch: 0
		};

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

		this.onPointerDownYaw = 0;
		this.onPointerDownPitch = 0;
		this.config = {
			yaw: 0,
			pitch: 0,
			roll: 0,
			touchPanSpeedCoeffFactor: 1
		};
		this.prevTime;
		this.animatedMove = {};

		/***********************陀螺仪参数**************************** */
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

		this.store = initStore();

		this.setHousesViewAngle(0, 0, true);
	}

	update() {

		this.config.pitch = Math.max(c_minPitch, Math.min(c_maxPitch, this.config.pitch));

		this.setHousesViewAngle(this.config.yaw, this.config.pitch);

		if (Math.abs(this.speed.yaw) > 0.05 || Math.abs(this.speed.pitch) > 0.05) {

			let prevPitch = this.config.pitch;
			let prevYaw = this.config.yaw;

			let newTime;
			if (typeof performance !== 'undefined' && performance.now()) {
				newTime = performance.now();
			} else {
				newTime = Date.now();
			}
			if (this.prevTime === undefined) {
				this.prevTime = newTime;
			}
			let diff = (newTime - this.prevTime) * (camera.fov + 32) / 1700;
			diff = Math.min(diff, 1.0);

			// 惯性
			if (diff > 0 && !this.autoRotate) {
				// 摩擦
				let friction = 0.85;

				// Yaw
				if (!this.animatedMove.yaw) {
					this.config.yaw += this.speed.yaw * diff * friction;
				}
				// Pitch
				if (!this.animatedMove.pitch) {
					this.config.pitch += this.speed.pitch * diff * friction;
				}
			}

			this.prevTime = newTime;
			if (diff > 0) {
				this.speed.yaw = this.speed.yaw * 0.8 + (this.config.yaw - prevYaw) / diff * 0.2;
				this.speed.pitch = this.speed.pitch * 0.8 + (this.config.pitch - prevPitch) / diff * 0.2;

				// Limit speed
				var maxSpeed = this.autoRotate ? Math.abs(this.autoRotate) : 5;
				this.speed.yaw = Math.min(maxSpeed, Math.max(this.speed.yaw, -maxSpeed));
				this.speed.pitch = Math.min(maxSpeed, Math.max(this.speed.pitch, -maxSpeed));
			}

		} else {
			this.prevTime = undefined;
		}
	}

	/**设置缩放比例 */
	getZoomScale() {
		return Math.pow(2, this.zoomSpeed);
	}

	/**缩小 */
	dollyIn(dollyScale) {
		let fov = Math.max(c_Minfov, Math.min(c_Maxfov, camera.fov + dollyScale));

		let from = {
			x: camera.fov
		};

		let to = {
			x: fov
		};

		new TWEEN.Tween(from)
			.to(to, 800)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function () {
				camera.fov = this._object.x;
			})
			.onComplete(() => {
				if (camera.fov > (c_Maxfov + c_Minfov) * 0.5) {

					this.ifCameraEnlarge = false;

					sw_skyBox.panoBox.clearFaceTiles();
				}
			})
			.start();

		camera.updateProjectionMatrix();
	}

	/**放大 */
	dollyOut(dollyScale) {
		let fov = Math.max(c_Minfov, Math.min(c_Maxfov, camera.fov - dollyScale));

		camera.updateProjectionMatrix();

		let from = {
			x: camera.fov
		};

		let to = {
			x: fov
		};

		new TWEEN.Tween(from)
			.to(to, 800)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function () {
				camera.fov = this._object.x;
			})
			.onComplete(() => {

				if (camera.fov < (c_Maxfov + c_Minfov) * 0.5) {

					this.ifCameraEnlarge = true;

					sw_skyBox.panoBox.addFaceTiles();
				}
			})
			.start();
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

			this.autoRotate = false;
			this.speed.pitch = this.speed.yaw = 0;

			this.startTime = Date.now();

			this.onPointerDownYaw = this.config.yaw;
			this.onPointerDownPitch = this.config.pitch;

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

			this.startTime = Date.now();

			let canvasWidth = window.innerWidth;
			let canvasHeight = window.innerHeight;

			this.rotateEnd.set(event.clientX, event.clientY);

			let yaw = -((Math.atan(this.rotateStart.x / canvasWidth * 2 - 1) - Math.atan(this.rotateEnd.x / canvasWidth * 2 - 1)) * 180 / Math.PI * (camera.fov + 32) / 90) + this.onPointerDownYaw;
			this.speed.yaw = (yaw - this.config.yaw) % 360 * 0.3;
			this.config.yaw = yaw;

			let vfov = 2 * Math.atan(Math.tan((camera.fov + 32) / 360 * Math.PI) * canvasHeight / canvasWidth) * 180 / Math.PI;

			let pitch = ((Math.atan(this.rotateEnd.y / canvasHeight * 2 - 1) - Math.atan(this.rotateStart.y / canvasHeight * 2 - 1)) * 180 / Math.PI * vfov / 90) + this.onPointerDownPitch;
			this.speed.pitch = (pitch - this.config.pitch) * 0.3;
			this.config.pitch = pitch;
		}
	}

	/**
	 * 鼠标弹起,旋转拖尾效果
	 * @param {MouseEvent} event 
	 */
	onMouseUp(event) {
		this.state = this.STATE.NONE;

		if (Date.now() - this.startTime > 15) {

			this.speed.pitch = this.speed.yaw = 0;

		}

		this.latestInteraction = Date.now();
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

				this.autoRotate = false;
				this.config.roll = 0;
				this.speed.pitch = this.speed.yaw = 0;

				this.onPointerDownYaw = this.config.yaw;
				this.onPointerDownPitch = this.config.pitch;

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

				this.startTime = Date.now();

				this.rotateEnd.set(event.targetTouches[0].clientX, event.targetTouches[0].clientY);

				let touchmovePanSpeedCoeff = ((camera.fov + 32) / 360) * this.config.touchPanSpeedCoeffFactor;

				let yaw = -(this.rotateStart.x - this.rotateEnd.x) * touchmovePanSpeedCoeff + this.onPointerDownYaw;
				this.speed.yaw = (yaw - this.config.yaw) % 360 * 0.1;
				this.config.yaw = yaw;

				let pitch = (this.rotateEnd.y - this.rotateStart.y) * touchmovePanSpeedCoeff + this.onPointerDownPitch;
				this.speed.pitch = (pitch - this.config.pitch) * 0.1;
				this.config.pitch = pitch;

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

			if (Date.now() - this.startTime > 150) {

				this.speed.pitch = this.speed.yaw = 0;
			}
			this.startTime = Date.now();
		}
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
				let alpha = event.alpha ?
					THREE.Math.degToRad(parseFloat((event.alpha - this.startAlpha).toFixed(2))) + this.alphaOffset :
					0; // Z

				let beta = event.beta ? THREE.Math.degToRad(parseFloat((event.beta - this.startBeta).toFixed(2))) : 0; // X'

				let gamma = event.gamma ? THREE.Math.degToRad(parseFloat(event.gamma.toFixed(2))) : 0; // Y''

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

			if (camera.fov > c_Minfov) {

				this.dollyOut((c_Maxfov - c_Minfov) / 3); //放大

			} else if (camera.fov == c_Minfov) {

				this.dollyIn(100); //还原
			}
		}
	}

	/**
	 * 这个是直接设置相机视角值
	 * @param {*} yaws 经度
	 * @param {*} pitch 纬度
	 * @param {*} updatas 更新坐标
	 */
	setHousesViewAngle(yaws, pitch, updatas) {
		if (this.yaw_Camera == getNumberMax360(yaws) && this.picth_Camera == pitch) {
			return;
		}
		if (yaws) this.yaw_Camera = getNumberMax360(yaws);

		if (pitch) this.picth_Camera = pitch;

		if (updatas) {
			this.config.yaw = this.yaw_Camera;
			this.config.pitch = this.picth_Camera;
		}

		this.store.dispatch(show_PanoMap_fun({
			radarAngle: this.yaw_Camera
		}));

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
		// let picthCamera = this.picth_Camera + pitch;

		let yawCamera = getNumberMax360(this.yaw_Camera + yaws);

		this.setHousesViewAngle(yawCamera, pitch, true);
	}
}

export default SWCameraModule;