/* global THREE,$*/

import { disposeNode, TextDiv, getWorldToScene, delectTextDiv } from '../../tool/SWTool'
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
     * @param {Object} obj {fpsNum:帧数，wPlane:宽，hPlane：高}
     */
    constructor(url, type, obj) {

        this.markerType = type;

        if (url) {
            this.texture = new THREE.ImageUtils.loadTexture(url);
        }

        if (obj) {
            this.textureAnimator = new SWTextureAnimator(this.texture, obj.fpsNum, 1, obj.fpsNum, 100);

            this.geometry = new THREE.PlaneGeometry(obj.wPlane, obj.hPlane, 1, 1);

            this.material = new THREE.MeshBasicMaterial({
                map: this.texture,
                side: 2,
                transparent: true,
                opacity: 1
            });

        } else {

            this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

            this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

        }

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.textDiv = new TextDiv(new THREE.Vector3(0, 0, 0), 12, "");
        this.textDiv.id = "markerMesh";
        this.textDiv.style.display = "none";
        this.textDiv.style.color = "#FFF";
        this.textDiv.style.borderRadius = "3px";
        this.textDiv.style.backgroundColor = "rgba(16, 16, 16, 0.3)";
        this.textDiv.style.padding = "3px 10px";
        this.textDiv.style.letterSpacing = "2px";
    }

    /**
     * 不停的更新动画
     * @param {Number} delta 补帧时间
     */
    update(delta) {
        if (this.textureAnimator && this.markerType == 2) {

            this.textureAnimator.update(1000 * delta);

        }
    }

    /**
     * 显示标注文本说明
     * @param {Object} obj 射线返回对象
     * @param {String} str 显示文本
     */
    showTextDiv(obj, str) {
        if (str && str != "") {

            this.textDiv.style.display = "block";

            var labelPos = getWorldToScene(obj.point);

            this.textDiv.style.left = (labelPos.x - 30) + "px";

            this.textDiv.style.top = (labelPos.y - 40) + "px";

            this.textDiv.innerHTML = str;

        }
    }


    /**隐藏标注说明文本 */
    hideTextDiv() {

        this.textDiv.style.display = "none";

    }

    /**清空对象 */
    clear() {

        this.textureAnimator = null;

        delectTextDiv(this.textDiv);

        disposeNode(this.mesh);
    }
}

export default SWMarkerModule;