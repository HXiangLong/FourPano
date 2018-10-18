/* global THREE */

import {
    scene,
    camera,
    c_StationInfo,
    c_ThumbnailSize,
    sw_cameraManage
} from '../../tool/SWConstants';
import SWBoxFaceModule from './SWBoxFaceModule';
import {
    disposeNode,
    Vector3ToVP,
    getNumberMax360
} from '../../tool/SWTool';
import {
    LoadPreviewImage
} from '../../tool/SWInitializeInstance';

/**
 * 全景盒子
 */
class SWBoxModule {
    constructor(url, textures) {
        this.box = new THREE.Group(); //全景内盒子

        this.faceArr = []; //面集合

        this.worldFourPoint = []; //當前屏幕四個顶点在世界的位置

        this.url = url; //贴图路径

        this.textures = textures; //缩略贴图对象

        this.faceNum = 0;

        /**鼠标坐标 */
        this.mouseV2 = new THREE.Vector2();

        /**射线 */
        this.raycaster = new THREE.Raycaster();

        this.box.rotation.y = THREE.Math.degToRad(90 - c_StationInfo.yaw); //每个站点都有一个校正值

        this.regulateYaw = THREE.Math.radToDeg(this.box.rotation.y);

        scene.add(this.box);

        this.addFace();
    }

    addFace() {

        let angle = getNumberMax360(Math.abs(this.regulateYaw) + sw_cameraManage.yaw_Camera) / 90; //计算现在先看到的是那个面

        let originalOrderArr = [0, 1, 2, 3, 4, 5];

        let arr1 = originalOrderArr.slice(0, angle - 1);

        let arr2 = originalOrderArr.slice(angle - 1);

        let newOrderArr = [...arr2, ...arr1];

        newOrderArr.forEach((item) => {

            let canvas = document.createElement("canvas");

            canvas.width = canvas.height = c_ThumbnailSize;

            let context = canvas.getContext("2d");

            //计算图片位置
            let nint = Math.floor(item / 3);
            let mint = item % 3;

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


            let face = new SWBoxFaceModule(item, this.box, texture1, this.url, () => {

                this.faceNum += 1;

                if (this.faceNum >= 6) {

                    LoadPreviewImage();
                }
            });

            this.faceArr.push(face);

        })
    }

    /**相机放大的情况下，有变化时调用此方法 */
    addFaceTiles() {

        let yp = this.getWorldFourPoint();

        if (yp) {

            this.faceArr.forEach((itme) => {

                itme.createTiles(yp[0], yp[1], yp[2], yp[3]);

            });

        }
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

        if (isNaN(minYaw) || isNaN(maxYaw) || isNaN(minPitch) || isNaN(maxPitch)) return; //上保险，计算错误时不影响程序运行

        return [minYaw, maxYaw, minPitch, maxPitch];
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

        return intersects.length > 0 ? intersects[0].point : new THREE.Vector3(0, 0, 0);
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