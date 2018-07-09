/* global THREE,$ */

import * as constants from "./tool/SWConstants";
import Stats from './libs/Stats';
import serverData from './server/SWServerData';
import SWCameraModule from './module/SWCameraModule'
import SWBoxJumpModule from './module/panoBox/SWBoxJumpModule'
import SWMouseModule from './module/SWMouseModule'
import SWWallModule from "./module/laser/SWWallModule";
import SWGroundModule from "./module/laser/SWGroundModule";
import SWWallSurfaceModule from "./module/laser/SWWallSurfaceModule";

const TWEEN = require('@tweenjs/tween.js');

class SWPano {
    constructor() {}

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
        constants.camera = new THREE.PerspectiveCamera(constants.c_Maxfov, window.innerWidth / window.innerHeight, 0.1, 10000);

        //创建6个渲染到WebGLRenderTargetCube的相机。
        //near - 近裁剪距离。 far - 裁剪距离远。 cubeResolution - 设置立方体边缘的长度
        constants.cubeCamera = new THREE.CubeCamera(1, 10000, constants.c_FaceDistance * 0.5);
        constants.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        constants.scene.add(constants.cubeCamera);
    }

    /**初始化灯光*/
    initLight() {
        var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
        constants.scene.add(ambientLight);
    }

    /**初始化场景*/
    initScene() {
        constants.scene = new THREE.Scene();
    }

    /**初始化渲染*/
    initRenderer() {
        constants.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, alpha: true });
        constants.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas3d').appendChild(constants.renderer.domElement);
        constants.renderer.domElement.style.position = "absolute";
        constants.renderer.domElement.style.display = "block";
        //设置canvas背景色(clearColor)
        constants.renderer.setClearColor(0xffffff, 1.0);
        constants.renderer.shadowMapEnabled = true;
    }

    /**每帧调用*/
    Animate() {
        if (constants.stats) constants.stats.update();

        TWEEN.update();

        this.Update();

        constants.camera.aspect = window.innerWidth / window.innerHeight;
        constants.camera.updateProjectionMatrix();
        constants.renderer.setPixelRatio(window.devicePixelRatio);
        constants.renderer.setSize(window.innerWidth, window.innerHeight);
        constants.renderer.render(constants.scene, constants.camera);

    }

    /**其他需要更新的都在这里*/
    Update() {

        //计时器
        let delta = constants.c_clock.getDelta();

        //相机旋转
        if (constants.sw_cameraManage) constants.sw_cameraManage.update();

        //箭头动画
        if (constants.c_arrowArr.length > 0) {

            constants.c_arrowArr.map((item) => {

                item.update(delta);

            });
        }
    }

    /**初始化读取数据对象*/
    initService() {
        constants.sw_getService = new serverData();
        constants.sw_getService.getConfig();
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
        constants.sw_wallProbeSurface = new SWWallSurfaceModule();
    }
}


export default SWPano;