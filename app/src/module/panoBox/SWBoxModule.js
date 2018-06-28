/* global THREE */

import { scene, camera, c_StationInfo, c_ThumbnailSize } from '../../tool/SWConstants';
import SWBoxFaceModule from './SWBoxFaceModule';
import { disposeNode, Vector3ToVP } from '../../tool/SWTool';

/**
 * 全景盒子
 */
class SWBoxModule {
    constructor(url, textures) {
        this.box = new THREE.Group(); //全景内盒子

        this.faceArr = []; //面集合

        this.url = url; //贴图路径

        this.textures = textures; //缩略贴图对象

        /**鼠标坐标 */
        this.mouseV2 = new THREE.Vector2();

        /**射线 */
        this.raycaster = new THREE.Raycaster();

        this.box.rotation.y = THREE.Math.degToRad(90 - c_StationInfo.yaw); //每个站点都有一个校正值

        scene.add(this.box);

        this.addFace();

        this.worldFourPoint = [];
    }

    addFace() {
        let dd = Date.now();

        for (let i = 0; i < 6; i++) {

            let canvas = document.createElement("canvas");

            canvas.width = canvas.height = c_ThumbnailSize;

            let context = canvas.getContext("2d");

            //计算图片位置
            let nint = Math.floor(i / 3);
            let mint = i % 3;

            context.drawImage(this.textures.image,

                mint * c_ThumbnailSize,

                nint * c_ThumbnailSize,

                c_ThumbnailSize,

                c_ThumbnailSize,

                0,

                0,
                c_ThumbnailSize,

                c_ThumbnailSize);

            let texture1 = new THREE.Texture(canvas);

            texture1.needsUpdate = true;

            let face = new SWBoxFaceModule(i, this.box, texture1, this.url);

            this.faceArr.push(face);

        }

        console.log(`缩略图贴面上耗时：${Date.now()-dd}ms`);
    }

    /**相机放大的情况下，有变化时调用此方法 */
    addFaceTiles() {

        this.getWorldFourPoint();

        let yaw = this.worldFourPoint.sort((a, b) => {
            if (a.Yaw > b.Yaw) {
                return 1;
            } else {
                return -1;
            }
        });

        let minYaw = yaw[0].Yaw;
        let maxYaw = yaw[yaw.length - 1].Yaw;

        let pitch = this.worldFourPoint.sort((a, b) => {
            if (a.Pitch > b.Pitch) {
                return 1;
            } else {
                return -1;
            }
        });

        let minPitch = pitch[0].Pitch;
        let maxPitch = pitch[pitch.length - 1].Pitch;

        if (isNaN(minYaw) || isNaN(maxYaw) || isNaN(minPitch) || isNaN(maxPitch)) { //上保险，计算错误时不影响程序运行
            return;
        }

        // console.log(minYaw, maxYaw, minPitch, maxPitch);

        this.faceArr.forEach((itme) => {

            itme.createTiles(minYaw, maxYaw, minPitch, maxPitch);

        });
    }

    /**
     * 获得当前屏幕四个顶点所在世界的坐标
     */
    getWorldFourPoint() {

        this.worldFourPoint.length = 0;

        this.worldFourPoint.push(Vector3ToVP(this.getSceneToWorldRay(0, 0)));

        this.worldFourPoint.push(Vector3ToVP(this.getSceneToWorldRay(window.innerWidth, 0)));

        this.worldFourPoint.push(Vector3ToVP(this.getSceneToWorldRay(0, window.innerHeight)));

        this.worldFourPoint.push(Vector3ToVP(this.getSceneToWorldRay(window.innerWidth, window.innerWidth)));

    }

    /**
     * 鼠标屏幕位置 转换到三维（-1 ~ +1）中的
     * @param {Number} ex 鼠标/触摸点X坐标
     * @param {Number} ey 鼠标/触摸点Y坐标
     */
    getSceneToWorldRay(ex, ey) {

        this.mouseV2.x = (ex / window.innerWidth) * 2 - 1;

        this.mouseV2.y = -(ey / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouseV2, camera);

        let intersects = this.raycaster.intersectObjects([this.box], true);

        return intersects[0].point;
    }

    /**相机缩小的情况下，调用此方法 */
    clearFaceTiles() {

        this.faceArr.forEach((itme) => {

            itme.clearTiles(false);

        });

    }

    /**清楚全景盒子所有面片对象 */
    clearBox() {

        this.faceArr.forEach((itme) => {

            itme.clearTiles(true);

        });

        disposeNode(this.box);

    }
}

export default SWBoxModule;