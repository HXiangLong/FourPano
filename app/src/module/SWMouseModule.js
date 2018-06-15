/* global THREE*/

import { camera, scene, sw_cameraManage } from '../tool/SWConstants'

/**
 * 鼠标事件
 * 将要解决手机双击的问题
 * 由UI层传递屏幕点击坐标之后，在转换成三维坐标射线判定
 */
class SWMouseModule {
    constructor(canvas) {

        this.canvas3d = canvas;

        /**是否按下鼠标 */
        this.ifMouseDownBoo = false;

        /**是否鼠标离开 */
        this.ifMouseOutBoo = false;

        /**鼠标坐标 */
        this.mouseV2 = new THREE.Vector2();

        /**射线 */
        this.raycaster = new THREE.Raycaster();

        this.addMosueEvent();
        // this.addGyroEvent();
        this.addTouchEvent();
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

    /**添加手机陀螺仪事件 */
    addGyroEvent() {
        window.addEventListener('orientationchange', this.screenOrientationChangeEvent.bind(this), false); //浏览器横竖屏切换检测
        //处理方向事件 接收设备方向变化信息
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', this.deviceOrientationChangeEvent.bind(this), false); //检测手机倾斜旋转
        } else {
            alert('本设备不支持deviceorientation事件');
        }
    }

    /**清除手机陀螺仪事件 */
    deleteGyroEvent() {
        window.removeEventListener('orientationchange', this.screenOrientationChangeEvent.bind(this), false); //浏览器横竖屏切换检测
        window.removeEventListener('deviceorientation', this.deviceOrientationChangeEvent.bind(this), false); //检测手机倾斜旋转
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
     */
    mouseRaycaster(mouseXY) {

        this.raycaster.setFromCamera(mouseXY, camera);

        let intersects = this.raycaster.intersectObjects(scene.children);

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

        sw_cameraManage.onMouseWheel(e);

    }

    /**
     * 鼠标弹起
     * @param {Event} e 
     */
    mouseUp(e) {
        sw_cameraManage.onMouseUp(e);

        this.mousePosition(e.clientX, e.clientY);

        this.intersect = this.mouseRaycaster(this.mouseV2);

        if (this.intersect && this.intersect.object.mouseUp) { //模型弹起事件

            this.intersect.object.mouseUp(e, this.intersect);

        }
    }

    /**
     * 鼠标移动
     * @param {Event} e 
     */
    mouseMove(e) {

        sw_cameraManage.onMouseMove(e);

        this.mousePosition(e.clientX, e.clientY);

        let rayObj = this.mouseRaycaster(this.mouseV2);

        if (rayObj) {

            if (rayObj.object.mouseOver) { //离开模型事件

                rayObj.object.mouseOver(e, rayObj);

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

        sw_cameraManage.onMouseDown(e);

        this.mousePosition(e.clientX, e.clientY);

        this.intersect = this.mouseRaycaster(this.mouseV2);

        if (this.intersect && this.intersect.object.mouseDown) {

            this.intersect.object.mouseDown(e, this.intersect);

        }
    }

    /**
     * 鼠标从某元素移开
     * @param {Event} e 
     */
    mouseOut(e) {

        this.ifMouseOutBoo = true;
    }

    /**
     * 鼠标移到某元素之上
     * @param {Event} e 
     */
    mouseOver(e) {

        this.ifMouseOutBoo = false;
    }

    /**
     * 触摸开始
     * @param {Event} e 
     */
    touchStart(e) {

        sw_cameraManage.onTouchStart(e);
    }

    /**
     * 触摸结束
     * @param {Event} e 
     */
    touchEnd(e) {

        sw_cameraManage.onTouchEnd(e);
    }

    /**
     * 触摸移动
     * @param {Event} e 
     */
    touchMove(e) {

        sw_cameraManage.onTouchMove(e);
    }

    /**陀螺仪旋转事件-设备定位改变事件 */
    deviceOrientationChangeEvent(event) {

        sw_cameraManage.onDeviceOrientationChangeEvent(event);

    }

    /**陀螺仪旋转事件-屏幕方向改变事件 */
    screenOrientationChangeEvent() {

        sw_cameraManage.onScreenOrientationChangeEvent();

    }

    /**屏蔽右键 */
    contextMenu(e) {
        e.preventDefault();
    }
}

export default SWMouseModule;