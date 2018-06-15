/* global THREE */

import {
    scene,
    c_StationInfo,
    c_ThumbnailSize,
    c_isPreviewImageLoadEnd
} from '../../tool/SWConstants';
import SWBoxFaceModule from './SWBoxFaceModule';
import { disposeNode } from '../../tool/SWTool';

/**
 * 全景盒子
 */
class SWBoxModule {
    constructor(url, textures) {
        this.box = new THREE.Group(); //全景内盒子

        this.faceArr = []; //面集合

        this.url = url; //贴图路径

        this.textures = textures; //缩略贴图对象

        this.box.rotation.y = THREE.Math.degToRad(90 - c_StationInfo.yaw); //每个站点都有一个校正值

        scene.add(this.box);

        this.addFace();
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

        // c_isPreviewImageLoadEnd = false;

        console.log(`缩略图贴面上耗时：${Date.now()-dd}ms`);
    }

    clearBox() {

        this.faceArr.forEach((itme) => {
            itme.clearTiles();
        });

        disposeNode(this.box);

    }
}

export default SWBoxModule;