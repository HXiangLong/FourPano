/* global THREE*/

import * as constants from '../tool/SWConstants';
import {
    ShakeAmbient,
    jumpSite
} from '../tool/SWInitializeInstance';
import initStore from '../../views/redux/store/store';
import {
    show_Thumbnails_fun,
    show_HotPhotoWall_fun
} from '../../views/redux/action';
import {
    notify
} from 'reapop';

/**
 * 鼠标事件
 * 将要解决手机双击的问题
 * 由UI层传递屏幕点击坐标之后，在转换成三维坐标射线判定
 */
class SWMouseModule {
    constructor(canvas) {

        this.canvas3d = canvas;

        this.startMouse = new THREE.Vector2();

        /**鼠标坐标 */
        this.mouseV2 = new THREE.Vector2();

        /**射线 */
        this.raycaster = new THREE.Raycaster();

        /**VR模式下射到的对象 */
        this.hoverObject;

        this.speed = 25;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.lastZ = 0;

        this.shakeOff = false;
        this.SHAKE_THRESHOLD = 3000;
        this.last_update = 0;

        if ('ontouchstart' in window) {
            this.addTouchEvent();
        } else {
            this.addMosueEvent();
        }
    }

    /**添加鼠标事件 */
    addMosueEvent() {
        this.canvas3d.addEventListener("mousedown", this.mouseDown.bind(this), false); //鼠标按钮被按下
        this.canvas3d.addEventListener("mouseup", this.mouseUp.bind(this), false); //鼠标按键被松开
        this.canvas3d.addEventListener("mousemove", this.mouseMove.bind(this), false); //鼠标被移动

        this.canvas3d.addEventListener("mouseover", this.mouseOver.bind(this), false); //鼠标移到某元素之上
        this.canvas3d.addEventListener("mouseout", this.mouseOut.bind(this), false); //鼠标从某元素移开

        this.canvas3d.addEventListener("wheel", this.mouseWheel.bind(this), false); //鼠标滚轮

        document.addEventListener('contextmenu', this.contextMenu, false); //关闭右键事件
    }

    /**清除鼠标事件 */
    deleteMouseEvent() {
        this.canvas3d.removeEventListener("mousedown", this.mouseDown.bind(this), false); //鼠标按钮被按下
        this.canvas3d.removeEventListener("mouseup", this.mouseUp.bind(this), false); //鼠标按键被松开
        this.canvas3d.removeEventListener("mousemove", this.mouseMove.bind(this), false); //鼠标被移动

        this.canvas3d.removeEventListener("mouseover", this.mouseOver.bind(this), false); //鼠标移到某元素之上
        this.canvas3d.removeEventListener("mouseout", this.mouseOut.bind(this), false); //鼠标从某元素移开

        this.canvas3d.removeEventListener("wheel", this.mouseWheel.bind(this), false); //鼠标滚轮

    }

    /**添加触摸事件 */
    addTouchEvent() {
        this.canvas3d.addEventListener("touchstart", this.touchStart.bind(this), false); //触摸按下
        this.canvas3d.addEventListener("touchmove", this.touchMove.bind(this), false); //触摸移动
        this.canvas3d.addEventListener("touchend", this.touchEnd.bind(this), false); //触摸结束
    }

    /**清除触摸事件 */
    deleteTouchEvent() {
        this.canvas3d.removeEventListener("touchstart", this.touchStart.bind(this), false); //触摸按下
        this.canvas3d.removeEventListener("touchmove", this.touchMove.bind(this), false); //触摸移动
        this.canvas3d.removeEventListener("touchend", this.touchEnd.bind(this), false); //触摸结束
    }

    /**添加摇一摇功能监听事件 */
    addShakeEvent() {
        if (window.DeviceMotionEvent) {
            this.shakeOff = true;
            window.addEventListener('devicemotion', this.devicemotionEvent.bind(this), false);
        } else {
            let store = initStore();
            store.dispatch(notify({
                title: '无法检测到您设备的陀螺仪，请您更换设备再试。',
                message: '',
                position: 'tc',
                status: 'error',
                dismissible: true,
                dismissAfter: 5000
            }));
        }
    }

    /**删除摇一摇功能监听事件 */
    deleteShakeEvent() {
        window.removeEventListener('devicemotion', this.devicemotionEvent.bind(this), false);
        this.shakeOff = false;
    }

    devicemotionEvent(event) {
        if (this.shakeOff) {
            let acceleration = event.accelerationIncludingGravity;

            let curTime = new Date().getTime();
            let diffTime = curTime - this.last_update;

            // 固定时间段
            if (diffTime > 100) {

                this.last_update = curTime;

                this.x = acceleration.x;
                this.y = acceleration.y;
                this.z = acceleration.z;

                let speed = Math.abs(this.x + this.y + this.z - this.lastX - this.lastY - this.lastZ) / diffTime * 10000;

                if (speed > this.SHAKE_THRESHOLD) {
                    ShakeAmbient();
                    console.log('====================================');
                    console.log("摇一摇");
                    console.log('====================================');
                }

                this.lastX = this.x;
                this.lastY = this.y;
                this.lastZ = this.z;
            }
        }
    }

    /**
     * 鼠标屏幕位置 转换到三维（-1 ~ +1）中的
     * @param {Number} ex 鼠标/触摸点X坐标
     * @param {Number} ey 鼠标/触摸点Y坐标
     */
    mousePosition(ex, ey) {

        this.mouseV2.x = (ex / window.innerWidth) * 2 - 1;

        this.mouseV2.y = -(ey / window.innerHeight) * 2 + 1;
    }


    /**
     * 朝着某个点发射线
     * @param {Vector2} mouseXY 屏蔽坐标点
     * @param {Array} [children = constants.scene.children] 默认射击对象为场景所有 
     * @param {Boolean} [recursive = false] 是否启用递归 
     */
    mouseRaycaster(mouseXY, children = constants.scene.children, recursive = true) {

        this.raycaster.setFromCamera(mouseXY, constants.camera);

        let intersects = this.raycaster.intersectObjects(children, recursive);

        let intersect, depthlevel;

        if (intersects.length > 0) {

            depthlevel = intersects[0].object.userData.depthlevel;

            intersect = intersects[0];

            for (let i = 1; i < intersects.length; i++) {

                if (depthlevel > intersects[i].object.userData.depthlevel) {

                    depthlevel = intersects[i].object.userData.depthlevel;

                    intersect = intersects[i];
                }
            }
        }

        return intersect;
    }

    /**
     * 鼠标滚轮事件
     * @param {Event} e 
     */
    mouseWheel(e) {

        constants.sw_cameraManage.onMouseWheel(e);

    }

    /**
     * 鼠标弹起
     * @param {Event} e 
     */
    mouseUp(e) {

        constants.sw_cameraManage.onMouseUp(e);

        if (constants.c_currentState === constants.c_currentStateEnum.editorStatus &&
            constants.c_editorState === constants.c_editorStateEnum.markerPoint) {

            constants.sw_markPoint.addPoint(e.clientX, e.clientY, 2);

        } else {
            this.mousePosition(e.clientX, e.clientY);

            this.intersect = this.mouseRaycaster(this.mouseV2);

            let v2 = new THREE.Vector2(e.clientX, e.clientY);

            if (v2.equals(this.startMouse) && this.intersect && this.intersect.object.mouseclick) {

                console.log("点击事件");
                this.intersect.object.mouseclick(e, this.intersect);
            }

            if (this.intersect && this.intersect.object.mouseUp) { //模型弹起事件

                this.intersect.object.mouseUp(e, this.intersect);

            } else if(this.intersect && this.intersect.object && this.intersect.object.parent && this.intersect.object.parent.mouseUp){

                this.intersect.object.parent.mouseUp(e, this.intersect);
                
            }else if (!this.intersect && constants.c_isMeasureStatus) { //测量状态时点击空白处

                let store = initStore();

                store.dispatch(notify({
                    title: '此处不能测量，请点击附近墙面和地面。',
                    message: '',
                    position: 'tc',
                    status: 'error',
                    dismissible: true,
                    dismissAfter: 5000
                }));
            }
        }
    }

    /**
     * 鼠标移动
     * @param {Event} e 
     */
    mouseMove(e) {

        constants.sw_cameraManage.onMouseMove(e);

        this.mousePosition(e.clientX, e.clientY);

        let rayObj = this.mouseRaycaster(this.mouseV2);

        if (rayObj) {

            if (this.intersect && this.intersect != rayObj) { //如果再次返回对象不是上次对象，就是离开对象了

                if (this.intersect.object.mouseOut) { //离开模型事件

                    this.intersect.object.mouseOut(e, this.intersect);

                }
            }

            if (rayObj.object.mouseOver) { //进入模型事件

                rayObj.object.mouseOver(e, rayObj);

            }

            if (rayObj.object.mouseMove) { //移动事件

                rayObj.object.mouseMove(e, rayObj);

            }

        } else if (this.intersect) {

            if (this.intersect.object.mouseOut) { //离开模型事件

                this.intersect.object.mouseOut(e, this.intersect);

            }
        }

        this.intersect = rayObj;
    }

    /**
     * 鼠标按下
     * @param {Event} e 
     */
    mouseDown(e) {

        let store = initStore();

        store.dispatch(show_Thumbnails_fun(false));
        store.dispatch(show_HotPhotoWall_fun({
            off: false
        }));

        constants.sw_roamingModule.EndRoaming();

        constants.sw_cameraManage.onMouseDown(e);

        this.startMouse = new THREE.Vector2(e.clientX, e.clientY);

        if (constants.c_currentState === constants.c_currentStateEnum.editorStatus &&
            constants.c_editorState === constants.c_editorStateEnum.markerPoint) {

            constants.sw_markPoint.addPoint(e.clientX, e.clientY, 1);

        } else {

            this.mousePosition(e.clientX, e.clientY);

            this.intersect = this.mouseRaycaster(this.mouseV2);

            if (this.intersect && this.intersect.object.mouseDown) {

                this.intersect.object.mouseDown(e, this.intersect);

            }else if(this.intersect && this.intersect.object && this.intersect.object.parent && this.intersect.object.parent.mouseDown){

                this.intersect.object.parent.mouseDown(e, this.intersect);

            }
        }
    }

    /**
     * 鼠标从某元素移开 PS:为解决鼠标移动到UI界面上
     * @param {Event} e 
     */
    mouseOut(e) {
        constants.sw_cameraManage.onMouseUp(e);
    }

    /**
     * 鼠标移到某元素之上
     * @param {Event} e 
     */
    mouseOver(e) {

    }

    /**
     * 触摸开始
     * @param {Event} e 
     */
    touchStart(e) {

        let store = initStore();

        store.dispatch(show_Thumbnails_fun(false));

        store.dispatch(show_HotPhotoWall_fun({
            off: false
        }));

        constants.sw_roamingModule.EndRoaming(); //停止漫游

        constants.sw_cameraManage.onTouchStart(e);

        this.mousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);

        this.intersect = this.mouseRaycaster(this.mouseV2);

        if (this.intersect && this.intersect.object.mouseDown) {

            this.intersect.object.mouseDown(e.targetTouches[0], this.intersect);

        }
    }

    /**
     * 触摸结束
     * @param {Event} e 
     */
    touchEnd(e) {

        constants.sw_cameraManage.onTouchEnd(e);

        if (e.touches.length == 0) { //屏幕上没有手指才是真的触摸事件触发时

            this.mousePosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

            this.intersect = this.mouseRaycaster(this.mouseV2);

            if (this.intersect && this.intersect.object.mouseUp) { //模型弹起事件

                this.intersect.object.mouseUp(e.changedTouches[0], this.intersect);

            }
        }
    }

    /**
     * 触摸移动
     * @param {Event} e 
     */
    touchMove(e) {

        constants.sw_cameraManage.onTouchMove(e);

    }

    /**屏蔽右键 */
    contextMenu(e) {
        e.preventDefault();
    }

    update() {

        if (constants.c_mode != constants.c_modes.STEREO || !window) return;

        this.mousePosition(constants.c_clientWidth * 0.5, constants.c_clientHeight * 0.5);

        let rayIntersect = this.mouseRaycaster(this.mouseV2, constants.c_arrowCurentArr, true);

        if (rayIntersect) {

            if (!this.hoverObject || rayIntersect.object !== this.hoverObject.object) {

                this.hoverObject = rayIntersect;

                constants.sw_SWReticle.startDwelling(() => {

                    jumpSite(this.hoverObject.object.name);

                });
            }
        } else {

            this.hoverObject = rayIntersect;

            //离开对象清除动画
            constants.sw_SWReticle.cancelDwelling();
        }
    }
}

export default SWMouseModule;