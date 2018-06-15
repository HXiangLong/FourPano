/* global THREE */

import * as constants from "./tool/SWConstants";
import * as tool from './tool/SWTool';
import Stats from './libs/Stats';
import serverData from './server/SWServerData';
import SWCameraModule from './module/SWCameraModule'
import SWBoxJumpModule from './module/panoBox/SWBoxJumpModule'
import SWMouseModule from './module/SWMouseModule'
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
        if (constants.sw_cameraManage) constants.sw_cameraManage.update();
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

    initBox() {
        var box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff00ff }));
        constants.scene.add(box);

        var coords = { x: 0, y: 0, z: 0 };
        new TWEEN.Tween(coords)
            .to({ x: 0, y: 0, z: -100 }, 5000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                box.position.copy(new THREE.Vector3(coords.x, coords.y, coords.z));
            })
            .start();
    }


    /**
     * 设置相机视角
     * @param {Number} yaw 偏航角
     * @param {Number} pitch 俯仰角
     * @param {boolean} move 是否动画旋转
     */
    setCameraAngle(yaw, pitch, move) {
        if (move) {
            let r1, r2;
            r1 = constants.sw_cameraManage.yaw_Camera - yaw;
            if (r1 > 0) {
                r2 = 360 - constants.sw_cameraManage.yaw_Camera + yaw;
            } else {
                r2 = 360 + constants.sw_cameraManage.yaw_Camera - yaw;
            }

            let from = {
                x: constants.sw_cameraManage.yaw_Camera,
                y: constants.sw_cameraManage.picth_Camera,
                z: 0
            };
            let to = {
                x: (r1 > 0 ? (Math.abs(r1) > Math.abs(r2) ? (yaw + 360) : yaw) : (Math.abs(r1) > Math.abs(r2) ? (yaw - 360) : yaw)),
                y: pitch,
                z: 0
            };
            new TWEEN.Tween(from)
                .to(to, 1000)
                .easing(TWEEN.Easing.Exponential.Out)
                .onUpdate(function() {
                    constants.sw_cameraManage.setHousesViewAngle(from.x, from.y);
                })
                .onComplete(function() {
                    constants.sw_cameraManage.setHousesViewAngle(to.x, to.y);
                })
                .start();
        } else {
            constants.sw_cameraManage.cameraLookAt(yaw, pitch);
        }
    }
}


export default SWPano;