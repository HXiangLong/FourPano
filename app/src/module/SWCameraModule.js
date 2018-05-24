/**
 * 相机控制类
 */
class SWCameraManage {
    constructor() {
        /**相机状态枚举 */
        this.STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4, WALL_ZOOM: 5 };
        /**相机目前状态 */
        this._state = STATE.NONE;
        /**是否启用 */
        this.enabled = true;
        /**初始朝向 */
        this.target = new THREE.Vector3(0, 0, 0);
        /**是否移动 */
        this.noRotate = false;
        /**是否缩放 */
        this.noZoom = false;
        /**移动起点 */
        this._movePrev = new THREE.Vector2();
        /**移动中点 */
        this._moveCurr = new THREE.Vector2();
        /**缩放两指之间的开始距离 */
        this._touchZoomDistanceStart = 0;
        /**缩放两指之间的中距 */
        this._touchZoomDistanceEnd = 0;
        /**缩放开始点 */
        this._zoomStart = [new THREE.Vector2(), new THREE.Vector2()];
        /**缩放中间点 */
        this._zoomEnd = [new THREE.Vector2(), new THREE.Vector2()];
        /**是缩小还是放大 */
        this._zoomBoolen = false;
        /**中间滚轴向前还是向后*/
        this._wheelDelta = 1;
        this._detailBrowser = 0;
        /**缩放值 */
        this._wheelNum = 0;
        /**缩放次数 */
        this._wheelNint = 0;
        /**鼠标是否按下*/
        this.isMousuDownBool = false;
        /**鼠标按下坐标*/
        this.onMouseDownMouseX = 0;
        /**鼠标按下坐标*/
        this.onMouseDownMouseY = 0;
        /**鼠标按下俯相机的俯仰角*/
        this.onMouseDownPitch = 0;
        /**鼠标按下相机的偏航角*/
        this.onMouseDownYaw = 0;
        /**围绕X轴旋转，也叫做俯仰角*/
        this.maxPitch = 85;
        /**围绕X轴旋转，也叫做俯仰角*/
        this.minPitch = -85;
        /**围绕Y轴旋转，也叫偏航角*/
        this.yaw_Camera = 0;
        /**围绕X轴旋转，也叫做俯仰角*/
        this.picth_Camera = 0;
        /**围绕Z轴旋转，也叫翻滚角*/
        this.roll_Camera = 0;
        /**相机正前方（屏幕正中心）世界位置*/
        this.cameraTargets = new THREE.Vector3(0, 0, 0);
    }

    updateCameraManage() {
        // if (!noRotate) {
        //     _this.rotateModel();
        // }

        // if (!noZoom) {
        //     _this.zoomModel();
        // }
    }

    // rotateModel = (function() {

    //     var delta = new THREE.Vector3(),
    //         dynamicDampingFactor = 0.2,
    //         lastAngle,
    //         angle,
    //         wns,
    //         hns, nx, ny;

    //     return function rotateModel() {

    //         wns = camera.fov * 0.00125 * (100000 - window.innerWidth) * 0.000012;
    //         hns = camera.fov * 0.00125 * (100000 - window.innerHeight) * 0.000012;
    //         delta.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
    //         angle = delta.length();
    //         if (angle > 0) {
    //             angle *= 0.1;
    //             lastAngle = angle;
    //             nx = -(_moveCurr.x - _movePrev.x) * 0.05;
    //             ny = (_moveCurr.y - _movePrev.y) * 0.05;
    //         }
    //         if (lastAngle) {
    //             lastAngle *= Math.sqrt(1.0 - dynamicDampingFactor);
    //             _this.setHousesViewAngle(
    //                 (-nx * lastAngle * wns + _this.yaw_Camera),
    //                 (ny * lastAngle * hns + _this.picth_Camera));
    //         }
    //         _movePrev.copy(_moveCurr);
    //     }
    // }());

    // this.zoomModel = (function() {

    //     var delta = 0;
    //     var factor = 0;
    //     var x_y = 0;
    //     var fovDiffer = 0;
    //     var stalls = 0;
    //     var zoomV = [new THREE.Vector2(), new THREE.Vector2()];

    //     return function zoomModel() {
    //         if (_state === STATE.WALL_ZOOM) {
    //             fovDiffer = (SWPanoView.maxfov - SWPanoView.minfov);
    //             stalls = fovDiffer / 30;
    //         } else {
    //             fovDiffer = (SWPanoView.maxfov - SWPanoView.minfov) / 3;
    //             stalls = fovDiffer / 30;
    //         }
    //         if (_state === STATE.ZOOM || _state === STATE.WALL_ZOOM) {
    //             if (_detailBrowser == 1) {
    //                 delta = _wheelDelta > 0 ? 1 : -1; //-_wheelDelta / 40;// WebKit / Opera / Explorer 9
    //             } else if (_detailBrowser == 2) {
    //                 delta = _wheelDelta > 0 ? -1 : 1; //_wheelDelta / 3;// Firefox
    //             }
    //             if (_wheelNint < 10) {
    //                 _wheelNum = delta * stalls * 2;
    //             } else if (_wheelNint >= 10 && _wheelNint < 20) {
    //                 _wheelNum = delta * stalls;
    //             }
    //             camera.fov = Math.max(SWPanoView.minfov, Math.min(SWPanoView.maxfov, camera.fov - _wheelNum));
    //             _wheelNint++;
    //             if (_wheelNint >= 20) {
    //                 _state = STATE.NONE;
    //                 _wheelNum = 0;
    //                 _wheelNint = 0;
    //             }
    //         } else if (_state === STATE.TOUCH_ZOOM_PAN) {
    //             factor = _touchZoomDistanceEnd / _touchZoomDistanceStart;
    //             _touchZoomDistanceStart = _touchZoomDistanceEnd;
    //             zoomV[0].subVectors(_zoomEnd[0], _zoomStart[0]);
    //             zoomV[1].subVectors(_zoomEnd[1], _zoomStart[1]);
    //             x_y = zoomV[0].x * zoomV[1].x + zoomV[0].y * zoomV[1].y;
    //             if (factor > 1 && x_y < -0.5) {
    //                 _zoomBoolen = true;
    //                 delta = (factor - 1) * 50;
    //                 _wheelNint = 0;
    //                 _wheelNum = _wheelNum > 0 ? _wheelNum * -1 : _wheelNum;
    //             }
    //             if (factor < 1 && x_y < -0.5) {
    //                 _zoomBoolen = true;
    //                 delta = -(1 - factor) * 50;
    //                 _wheelNint = 0;
    //                 _wheelNum = _wheelNum < 0 ? _wheelNum * -1 : _wheelNum;
    //             }
    //             if (_zoomBoolen) {
    //                 if (_wheelNint < 10) {
    //                     _wheelNum = delta * stalls * 2;
    //                 } else if (_wheelNint >= 10 && _wheelNint < 20) {
    //                     _wheelNum = delta * stalls;
    //                 }
    //                 camera.fov = Math.max(SWPanoView.minfov, Math.min(SWPanoView.maxfov, camera.fov - _wheelNum));
    //                 _wheelNint++;
    //                 if (_wheelNint >= 20) {
    //                     _wheelNum = 0;
    //                     _wheelNint = 0;
    //                     _zoomBoolen = false;
    //                 }
    //             }
    //         }
    //         camera.updateProjectionMatrix();
    //     }
    // }());

    // this.onDocumentMouseDown = function(evt) {
    //     evt.preventDefault();
    //     _this.isMousuDownBool = true;
    //     evt = evt || window.event;
    //     var x = 0,
    //         y = 0;
    //     //如果事件对象有pageX属性,对应firefox,opera,chrome,safari浏览器
    //     if (evt.pageX) {
    //         x = evt.pageX;
    //         y = evt.pageY;
    //     }
    //     //如果对象有clientX属性,对应IE浏览器
    //     else if (evt.clientX) {
    //         var offsetX = 0,
    //             offsetY = 0;
    //         //IE6及其以上版本
    //         if (document.documentElement.scrollLeft) {
    //             offsetX = document.documentElement.scrollLeft;
    //             offsetY = document.documentElement.scrollTop;
    //         }
    //         //IE较旧的版本
    //         else if (document.body) {
    //             offsetX = document.body.scrollLeft;
    //             offsetY = document.body.scrollTop;
    //         }
    //         x = evt.clientX + offsetX;
    //         y = evt.clientY + offsetY;
    //     }
    //     noRotate = true;
    //     _moveCurr.copy(new THREE.Vector2(x, y));
    //     _movePrev.copy(_moveCurr);
    //     _this.onMouseDownMouseX = x;
    //     _this.onMouseDownMouseY = y;
    //     _this.onMouseDownYaw = _this.yaw_Camera;
    //     _this.onMouseDownPitch = _this.picth_Camera;
    // };

    // this.onDocumentMouseMove = function(evt) {
    //     evt.preventDefault();
    //     if (!_this.isMousuDownBool) return;
    //     _movePrev.copy(_moveCurr);
    //     _moveCurr.copy(new THREE.Vector2(evt.clientX, evt.clientY));
    //     var wns = camera.fov * 0.00125 * (100000 - window.innerWidth) * 0.000012;
    //     var hns = camera.fov * 0.00125 * (100000 - window.innerHeight) * 0.000012;
    //     _this.setHousesViewAngle(-(_this.onMouseDownMouseX - evt.clientX) * wns + _this.onMouseDownYaw,
    //         (evt.clientY - _this.onMouseDownMouseY) * hns + _this.onMouseDownPitch);
    // };

    // this.onDocumentMouseUp = function(evt) {
    //     evt.preventDefault();
    //     _this.isMousuDownBool = false;
    //     noRotate = false;
    //     //_moveCurr.copy(new THREE.Vector2(evt.clientX, evt.clientY));
    //     _this.onMouseDownMouseX = 0;
    //     _this.onMouseDownMouseY = 0;
    // };

    // //设置相机视角
    // this.setHousesViewAngle = function(yy, pp, move) {
    //     if (move == null || move == false) {
    //         _this.picth_Camera = Math.max(this.minPitch, Math.min(this.maxPitch, pp));
    //         _this.yaw_Camera = SWPanoView.getNumberMax360(yy);
    //         _this.CameraLookAt();
    //     }
    // };

    // //相机查看
    // this.CameraLookAt = function(yaws, pitchs) {
    //     if (yaws) _this.yaw_Camera = yaws;
    //     if (pitchs) _this.picth_Camera = pitchs;

    //     if (SWPanoView.swMinMap) {
    //         SWPanoView.swMinMap.RadarPointAngle(_this.yaw_Camera);
    //     }

    //     //var phi = THREE.Math.degToRad(90 - _this.picth_Camera);//degToRad方法返回与参数degrees所表示的角度相等的弧度值.
    //     //var theta = THREE.Math.degToRad(_this.yaw_Camera);
    //     //_this.cameraTargets.x = 500 * Math.sin(phi) * Math.cos(theta);
    //     //_this.cameraTargets.y = 500 * Math.cos(phi);
    //     //_this.cameraTargets.z = 500 * Math.sin(phi) * Math.sin(theta);

    //     _this.cameraTargets.y = Math.sin(THREE.Math.degToRad(_this.picth_Camera)) * SWPanoView.faceDistance * 0.5;
    //     var m = Math.cos(THREE.Math.degToRad(_this.picth_Camera)) * SWPanoView.faceDistance * 0.5;
    //     _this.cameraTargets.x = Math.sin(THREE.Math.degToRad((_this.yaw_Camera - 90))) * m;
    //     _this.cameraTargets.z = Math.cos(THREE.Math.degToRad((_this.yaw_Camera - 90))) * m;
    //     camera.lookAt(_this.cameraTargets);
    // };

    // //鼠标控制相机的缩放
    // this.onDocumentMouseWheel = function(evt) {

    //     if (enabled === false) return;

    //     evt.preventDefault();
    //     evt.stopPropagation();

    //     if (evt.wheelDelta) {
    //         _wheelDelta = evt.wheelDelta;
    //         _detailBrowser = 1;
    //     } else if (evt.detail) {
    //         _wheelDelta = evt.detail;
    //         _detailBrowser = 2;
    //     }
    //     _state = STATE.ZOOM;
    //     _wheelNint = 0;
    //     _wheelNum = 0;
    // };


    // //鼠标点击面片墙的缩放
    // this.wallMoseWheel = function(type) {
    //     if (type == 1) {
    //         _wheelDelta = 120;
    //         _detailBrowser = 1;
    //         _state = STATE.ZOOM;
    //     } else {
    //         _wheelDelta = -120;
    //         _detailBrowser = 1;
    //         _state = STATE.WALL_ZOOM;
    //     }
    //     _wheelNint = 0;
    //     _wheelNum = 0;
    // };

    // this.onDocumentTouchStart = function(evt) {

    //     if (enabled === false) return;
    //     evt.preventDefault();
    //     evt.stopPropagation();

    //     switch (evt.touches.length) {
    //         case 1:
    //             _state = STATE.TOUCH_ROTATE;
    //             _moveCurr.copy(new THREE.Vector2(evt.touches[0].pageX, evt.touches[0].pageY));
    //             _movePrev.copy(_moveCurr);

    //             noRotate = true;
    //             _this.onMouseDownMouseX = evt.touches[0].pageX;
    //             _this.onMouseDownMouseY = evt.touches[0].pageY;
    //             _this.onMouseDownYaw = _this.yaw_Camera;
    //             _this.onMouseDownPitch = _this.picth_Camera;
    //             break;
    //         case 2:
    //             _state = STATE.TOUCH_ZOOM_PAN;
    //             var dx = evt.touches[0].pageX - evt.touches[1].pageX;
    //             var dy = evt.touches[0].pageY - evt.touches[1].pageY;

    //             _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);
    //             _zoomStart[0].set(evt.touches[0].pageX, evt.touches[0].pageY);
    //             _zoomStart[1].set(evt.touches[1].pageX, evt.touches[1].pageY);
    //             _zoomEnd[0].copy(_zoomStart[0]);
    //             _zoomEnd[1].copy(_zoomStart[1]);
    //             break;
    //     }
    // };

    // this.onDocumentTouchMove = function(evt) {

    //     if (enabled === false) return;

    //     evt.preventDefault();
    //     evt.stopPropagation();

    //     switch (evt.touches.length) {
    //         case 1:
    //             _movePrev.copy(_moveCurr);
    //             _moveCurr.copy(new THREE.Vector2(evt.touches[0].pageX, evt.touches[0].pageY));

    //             if (_state == STATE.TOUCH_ROTATE) {
    //                 var wns = camera.fov * 0.00125 * (100000 - window.innerWidth) * 0.000012;
    //                 var hns = camera.fov * 0.00125 * (100000 - window.innerHeight) * 0.000012;
    //                 _this.setHousesViewAngle(
    //                     (_this.onMouseDownMouseX - evt.touches[0].pageX) * wns + _this.onMouseDownYaw,
    //                     (evt.touches[0].pageY - _this.onMouseDownMouseY) * hns + _this.onMouseDownPitch);
    //             }
    //             break;
    //         case 2:
    //             var dx = evt.touches[0].pageX - evt.touches[1].pageX;
    //             var dy = evt.touches[0].pageY - evt.touches[1].pageY;

    //             _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
    //             _zoomEnd[0].copy(_zoomStart[0]);
    //             _zoomEnd[1].copy(_zoomStart[1]);
    //             _zoomStart[0].set(evt.touches[0].pageX, evt.touches[0].pageY);
    //             _zoomStart[1].set(evt.touches[1].pageX, evt.touches[1].pageY);
    //             break;
    //     }
    // };

    // this.onDocumentTouchEnd = function(evt) {

    //     if (enabled === false) return;
    //     switch (event.touches.length) {
    //         case 0:
    //             if (_state == STATE.TOUCH_ROTATE) {
    //                 noRotate = false;
    //                 _this.onMouseDownMouseX = 0;
    //                 _this.onMouseDownMouseY = 0;
    //             }
    //             _state = STATE.NONE;
    //             _wheelNint = 0;
    //             _wheelNum = 0;
    //             _zoomBoolen = false;
    //             break;
    //         case 1:
    //             _state = STATE.TOUCH_ROTATE;
    //             _moveCurr.copy(new THREE.Vector2(evt.touches[0].pageX, evt.touches[0].pageY));
    //             _movePrev.copy(_moveCurr);

    //             noRotate = true;
    //             _this.onMouseDownMouseX = evt.touches[0].pageX;
    //             _this.onMouseDownMouseY = evt.touches[0].pageY;
    //             _this.onMouseDownYaw = _this.yaw_Camera;
    //             _this.onMouseDownPitch = _this.picth_Camera;

    //             break;
    //     }
    // };
}