/* global THREE*/
import { scene, camera, sw_getService } from '../../tool/SWConstants';
import { disposeNode, getFont } from '../../tool/SWTool';
// const external = require('../../tool/SWExternalConst');
/**
 * 绘制字符串
 */
class SWDrawString {
    constructor() {

        this.font = undefined;

        this.textArr = [];

        getFont(sw_getService.resourcesUrl + '/BusinessData/ExhibitDetails/Font/optimer_regular.typeface.json').then((response) => {
            this.font = response;
        });
    }

    drawString(labelPos, text, dotRadius) {

        let fontSize = dotRadius * 3;

        let options = {
            size: fontSize,
            height: 0,
            weight: 'normal',
            font: this.font,
            style: 'normal',
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 1,
            curveSegments: 50,
            steps: 1
        };

        let meshText = new THREE.Mesh(new THREE.TextGeometry(text, options), new THREE.MeshBasicMaterial({ color: 0xffffff }));

        meshText.position.copy(labelPos);

        meshText.lookAt(camera.position);

        meshText.scale.set(0.3, 0.3, 0.3);

        scene.add(meshText);

        this.textArr.push(meshText);
    }

    /**
     * 清除点
     * @param {Number} num 0-全部清除 -1从尾部开始清除 1从头开始清除
     */
    clear(num = 0) {

        let dArr = num == 0 ? this.textArr.splice(0, this.textArr.length) : num < 0 ? this.textArr.splice(num, Math.abs(num)) : this.textArr.splice(0, num);

        for (let item in dArr) {

            disposeNode(item);

        }
    }
}

export default SWDrawString;