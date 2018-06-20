/* global THREE,$*/

import { disposeNode } from '../../tool/SWTool'
import SWTextureAnimator from '../../tool/SWTextureAnimator';

/**
 * 全景除了底层盒子、UI 都是标注
 * 这是所有标注的父类
 */
class SWMarkerModule {
    /**
     * 
     * @param {String} url 图片链接地址
     * @param {Number} type 1-静态 2-动态 
     * @param {Number} fpsNum GIF动画多少张
     */
    constructor(url, type, fpsNum) {

        this.markerType = type;

        this.texture = new THREE.ImageUtils.loadTexture(url);

        this.textureAnimator = new SWTextureAnimator(this.texture, fpsNum, 1, fpsNum, 100);

        this.geometry = new THREE.PlaneGeometry(144, 64, 1, 1);

        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            side: 2,
            transparent: true,
            opacity: 1
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    update(delta) {
        if (this.textureAnimator && this.markerType == 2) {

            this.textureAnimator.update(1000 * delta);

        }
    }

    clear() {
        this.textureAnimator = null;

        disposeNode(this.mesh);
    }
}

export default SWMarkerModule;