/* global THREE*/

import {
	camera,
	c_Maxfov,
	c_Minfov,
	c_maxPitch,
	c_minPitch,
	sw_skyBox,
	c_movingSpeedMultiple
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

		/**相机是否在缩放中 */
		this.ifCameraRun = false;

		this.store = initStore();

		this.setHousesViewAngle(0, 0, true);
	}

	update() {
		this.config.pitch = Math.max(c_minPitch, Math.min(c_maxPitch, this.config.pitch));

		this.setHousesViewAngle(this.config.yaw, this.config.pitch);

		if (Math.abs(this.speed.yaw) > 0.01 || Math.abs(this.speed.pitch) > 0.01) {

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

			this.prevTime = newTime;

			// 惯性
			if (diff > 0) {
				// 摩擦
				let friction = 0.85;

				this.config.yaw += this.speed.yaw * diff * friction;
				this.config.pitch += this.speed.pitch * diff * friction;

				this.speed.yaw = this.speed.yaw * 0.8 + (this.config.yaw - prevYaw) / diff * 0.2;
				this.speed.pitch = this.speed.pitch * 0.8 + (this.config.pitch - prevPitch) / diff * 0.2;
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
				camera.updateProjectionMatrix();
			})
			.onComplete(() => {
				camera.fov = fov;
				camera.updateProjectionMatrix();
				if (camera.fov > (c_Maxfov + c_Minfov) * 0.5) {
					this.ifCameraEnlarge = false;

					sw_skyBox.panoBox.clearFaceTiles();
				}
			})
			.start();
	}

	/**放大 */
	dollyOut(dollyScale) {
		let fov = Math.max(c_Minfov, Math.min(c_Maxfov, camera.fov - dollyScale));

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

				camera.updateProjectionMatrix();
			})
			.onComplete(() => {
				camera.fov = fov;

				camera.updateProjectionMatrix();
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

			this.onPointerDownYaw = this.config.yaw;
			this.onPointerDownPitch = this.config.pitch;

			this.speed.pitch = this.speed.yaw = 0;

			this.startTime = Date.now();

			this.state = this.STATE.ROTATE;

			this.update();
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

			let yaw = THREE.Math.radToDeg(Math.atan(this.rotateEnd.x / canvasWidth * 2 - 1) - Math.atan(this.rotateStart.x / canvasWidth * 2 - 1)) * ((camera.fov + 32) / 90);
			this.speed.yaw = yaw * 0.1 * c_movingSpeedMultiple;
			this.config.yaw += yaw;

			let vfov = 2 * THREE.Math.radToDeg(Math.atan(Math.tan((camera.fov + 32) / 360 * Math.PI) * canvasHeight / canvasWidth));
			let pitch = THREE.Math.radToDeg(Math.atan(this.rotateEnd.y / canvasHeight * 2 - 1) - Math.atan(this.rotateStart.y / canvasHeight * 2 - 1)) * (vfov / 90);

			this.speed.pitch = pitch * 0.1 * c_movingSpeedMultiple;
			this.config.pitch += pitch;

			this.rotateStart.x = this.rotateEnd.x;
			this.rotateStart.y = this.rotateEnd.y;
		}
	}

	/**
	 * 鼠标弹起,旋转拖尾效果
	 * @param {MouseEvent} event 
	 */
	onMouseUp(event) {
		if (this.state == this.STATE.ROTATE) {

			this.state = this.STATE.NONE;

			if (Date.now() - this.startTime > 15) {
				this.speed.pitch = this.speed.yaw = 0;
			}
		}
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

				let canvasWidth = window.innerWidth;
				let canvasHeight = window.innerHeight;

				this.rotateEnd.set(event.targetTouches[0].clientX, event.targetTouches[0].clientY);

				let yaw = THREE.Math.radToDeg(Math.atan(this.rotateEnd.x / canvasWidth * 2 - 1) - Math.atan(this.rotateStart.x / canvasWidth * 2 - 1)) * ((camera.fov + 32) / 90);
				this.speed.yaw = yaw * 0.1 * c_movingSpeedMultiple;
				this.config.yaw += yaw;

				let vfov = 2 * THREE.Math.radToDeg(Math.atan(Math.tan((camera.fov + 32) / 360 * Math.PI) * canvasHeight / canvasWidth));
				let pitch = THREE.Math.radToDeg(Math.atan(this.rotateEnd.y / canvasHeight * 2 - 1) - Math.atan(this.rotateStart.y / canvasHeight * 2 - 1)) * (vfov / 90);

				this.speed.pitch = pitch * 0.1 * c_movingSpeedMultiple;
				this.config.pitch += pitch;

				this.rotateStart.x = this.rotateEnd.x;
				this.rotateStart.y = this.rotateEnd.y;

				break;

			case 2: // 双指触摸：移动/缩放
				if (this.enableZoom === false || this.state !== this.STATE.TOUCH_DOLLY_PAN) return;

				let dx = event.touches[0].pageX - event.touches[1].pageX;
				let dy = event.touches[0].pageY - event.touches[1].pageY;

				let distance = Math.sqrt(dx * dx + dy * dy);

				this.dollyEnd.set(0, distance);

				this.dollyDelta.set(0, (this.dollyEnd.y - this.dollyStart.y) * 8 / this.zoomSpeed);

				this.dollyIn(-this.dollyDelta.y);

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
		if (yaws || yaws == 0) this.yaw_Camera = getNumberMax360(yaws); //if(0) => false

		if (pitch || pitch == 0) this.picth_Camera = pitch;

		if (updatas) {
			this.config.yaw = this.yaw_Camera;
			this.config.pitch = this.picth_Camera;
		}

		this.store.dispatch(
			show_PanoMap_fun({
				radarAngle: this.yaw_Camera
			})
		);

		camera.lookAt(YPRToVector3(this.yaw_Camera, this.picth_Camera));

		if(sw_skyBox.panoBox)sw_skyBox.panoBox.addFaceTiles();

	}

	/**
	 * 叠加相机角度
	 * @param {*} yaws 经度
	 * @param {*} pitch 纬度
	 */
	setOverlayViewAngle(yaws, pitch) {
		let yawCamera = getNumberMax360(this.yaw_Camera + yaws);

		this.setHousesViewAngle(yawCamera, pitch, true);
	}
}

export default SWCameraModule;