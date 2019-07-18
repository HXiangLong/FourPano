/* global THREE,$ */

import * as constants from "./tool/SWConstants";
import Stats from './libs/Stats';
import serverData from './server/SWServerData';
import SWGetSQLData from './server/SWGetSQLData';
import SWCameraModule from './module/SWCameraModule'
import SWBoxJumpModule from './module/panoBox/SWBoxJumpModule'
import SWMouseModule from './module/SWMouseModule'
import SWWallModule from "./module/laser/SWWallModule";
import SWGroundModule from "./module/laser/SWGroundModule";
import SWWallSurfaceModule from "./module/laser/SWWallSurfaceModule";
import SWWallSiteSurfaceModule from './module/laser/SWWallSiteSurfaceModule';
import SWMeasureModule from './module/draw/SWMeasureModule';
import SWMarkerTakePictureModule from "./module/marker/SWMarkerTakePictureModule";
import SWRoamingModule from "./module/roaming/SWRoamingModule";
import SWReticle from './tool/SWReticle';
import SWModel from './module/model/SWModel';
import initStore from '../views/redux/store/store';
import {
    background_music_fun,
    show_VideoBox_fun
} from '../views/redux/action';
const TWEEN = require('@tweenjs/tween.js');
require('./libs/controls/DeviceOrientationControls');
require('./libs/controls/OrbitControls');
require('./libs/controls/CardboardEffect');
require('./libs/controls/StereoEffect');

class SWPano {
    constructor() {
        //监听界面是否失去焦点，停止所有声音
        document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this), false);
        //监听屏幕是否变化
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    /**页面失去焦点之后做出了相应改变 */
    handleVisibilityChange() {

        let store = initStore();

        if (document.hidden) { // 用户按home，或者锁屏
            store.dispatch(background_music_fun({
                bgMusicOff: false
            }));

            store.dispatch(show_VideoBox_fun({
                videoOff: false
            }));

            constants.c_smallVideoArr.forEach((obj) => {
                if (obj.panoID == constants.c_StationInfo.panoID) {
                    obj.stopVideo();
                }
            });

        } else {
            let vboo = false;
            let storeObj = store.getState();

            if (storeObj.OpenVideoBox.off) { //视频弹出框优先等级最高
                store.dispatch(show_VideoBox_fun({
                    videoOff: true
                }));
            } else {
                constants.c_smallVideoArr.forEach((obj) => { //嵌入视频其次
                    if (obj.panoID == constants.c_StationInfo.panoID) {
                        obj.playVideo();
                        vboo = true;
                    }
                });
            }

            if (!vboo) {
                store.dispatch(background_music_fun({ //背景音乐最次
                    bgMusicOff: true
                }));
            }
        }
    }

    /**检测浏览器是否支持webgl */
    webglAvailable() {
        try {
            let canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (
                canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    /**屏幕分辨率变化 */
    onWindowResize() {
        constants.c_clientWidth = window.innerWidth;
        constants.c_clientHeight = window.innerHeight;
        constants.camera.aspect = constants.c_clientWidth / constants.c_clientHeight;
        constants.camera.updateProjectionMatrix();
        if (constants.c_currentState != constants.c_currentStateEnum.phoneStatus) constants.renderer.setPixelRatio(window.devicePixelRatio);
        constants.renderer.setSize(constants.c_clientWidth, constants.c_clientHeight);
    }

    /**性能监测*/
    initStats() {
        constants.stats = new Stats();
        constants.stats.setMode(0); // 0: fps, 1: ms
        constants.stats.domElement.style.position = 'absolute';
        constants.stats.domElement.style.left = '0px';
        constants.stats.domElement.style.top = '0px';
        document.getElementById("Stats-output").appendChild(constants.stats.domElement);
    }

    /**初始化相机*/
    initCamera() {
        constants.c_clientWidth = window.innerWidth;
        constants.c_clientHeight = window.innerHeight;
        constants.camera = new THREE.PerspectiveCamera(constants.c_Maxfov, constants.c_clientWidth / constants.c_clientHeight, 0.1, 10000);

        //创建6个渲染到WebGLRenderTargetCube的相机。
        //near - 近裁剪距离。 far - 裁剪距离远。 cubeResolution - 设置立方体边缘的长度
        constants.cubeCamera = new THREE.CubeCamera(1, 10000, constants.c_FaceDistance * 0.5);
        constants.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        constants.scene.add(constants.cubeCamera);
    }

    /**初始化灯光*/
    initLight() {
        constants.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        constants.scene.add(constants.ambientLight);
    }

    /**初始化场景*/
    initScene() {
        constants.scene = new THREE.Scene();
    }

    /**初始化渲染*/
    initRenderer() {
        // if (this.webglAvailable()) {
        constants.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        // } else {
        // constants.renderer = new THREE.CanvasRenderer();
        // }
        if (constants.c_currentState == constants.c_currentStateEnum.phoneStatus) {
            constants.renderer.setPixelRatio(constants.c_devicePixelRatio);
        }
        constants.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas3d').appendChild(constants.renderer.domElement);
        constants.renderer.domElement.style.position = "absolute";
        constants.renderer.domElement.style.display = "block";
        //设置canvas背景色(clearColor)
        constants.renderer.setClearColor(0xffffff, 1.0);
        constants.renderer.shadowMapEnabled = true;
    }

    /**初始化CSS渲染 */
    initCSSRenderer() {
        let container = document.getElementById('canvas3d');
        constants.renderer = new THREE.CSS3DRenderer();
        constants.renderer.setSize(window.innerWidth, window.innerHeight);
        constants.renderer.domElement.style.position = 'absolute';
        constants.renderer.domElement.style.top = 0;
        container.appendChild(constants.renderer.domElement);
    }

    /**每帧调用*/
    Animate() {
        if (constants.stats) constants.stats.update();

        TWEEN.update();

        this.Update();

        if (constants.c_mode == constants.c_modes.NORMAL) {

            constants.renderer.render(constants.scene, constants.camera);

            constants.renderer.setSize(window.innerWidth, window.innerHeight);

        } else {

            constants.c_effect.render(constants.scene, constants.camera);

        }
    }

    /**其他需要更新的都在这里*/
    Update() {

        //计时器
        let delta = constants.c_clock.getDelta();

        //漫游
        if (constants.sw_roamingModule) constants.sw_roamingModule.update();

        //相机旋转
        if (constants.sw_cameraManage) constants.sw_cameraManage.update();

        //箭头动画
        constants.c_arrowArr.forEach((item) => {
            item.update(delta);
        });

        //标注
        constants.c_markerMeshArr.forEach((item) => {
            item.update(delta);
        })

        //讲解视频、电视视频
        constants.c_smallVideoArr.forEach((markerVideo) => {
            markerVideo.updataSmallVideo();
        });

        /**陀螺仪控制器 */
        if (constants.c_control) constants.c_control.update();

        /**鼠标控制器 */
        if (constants.sw_mouseControl) constants.sw_mouseControl.update();

    }

    /**初始化读取数据对象*/
    initService() {
        constants.sw_GetSQLData = new SWGetSQLData();
        constants.sw_getService = new serverData();
    }

    /**初始化相机控制对象*/
    initCameraManage() {
        constants.sw_cameraManage = new SWCameraModule();
    }

    /**初始化天空盒子*/
    initSkyBox() {
        constants.sw_skyBox = new SWBoxJumpModule();
    }

    /**初始化鼠标操作控件*/
    initMouseModule() {
        let canvas = document.getElementById('canvas3d');
        constants.sw_mouseControl = new SWMouseModule(canvas);
    }

    /**墙片初始化 */
    initWallModule() {
        constants.sw_wallMesh = new SWWallModule();
        constants.sw_groundMesh = new SWGroundModule();
        constants.sw_wallProbeSurface = constants.c_siteRepresentation ? new SWWallSurfaceModule() : new SWWallSiteSurfaceModule();
        constants.sw_measure = new SWMeasureModule();
    }

    /**漫游程序初始化 */
    initRoaming() {
        constants.sw_roamingModule = new SWRoamingModule();
    }

    /**初始化编辑版需要的内容 */
    initEditor() {
        constants.sw_markPoint = new SWMarkerTakePictureModule();

    }

    /**初始化VR */
    initVR() {
        constants.c_effect = new THREE.StereoEffect(constants.renderer);
        constants.c_effect.setSize(window.innerWidth, window.innerHeight);
    }

    /**初始化十字 */
    initReticle() {
        constants.sw_SWReticle = new SWReticle();
        constants.sw_SWReticle.position.z = -10;
        constants.camera.add(constants.sw_SWReticle);
        constants.scene.add(constants.camera);
    }

    /**初始化控制 */
    initControls() {
        let container = document.getElementById('canvas3d');
        constants.c_control = new THREE.DeviceOrientationControls(constants.camera, container);
        constants.c_control.name = 'device-orientation';
        constants.c_control.enabled = false;
    }

    /**初始化模型 */
    initModel(){
        constants.sw_SWModel = new SWModel();
    }
}


export default SWPano;