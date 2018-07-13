/* global THREE*/
import { scene } from '../../tool/SWConstants'
import { disposeNode } from '../../tool/SWTool'

/**
 * 绘制点
 */
class SWDrawPoint {
    constructor() {
        this.dotRadius = 0.3; //圆点半径
        this.dotFillColors = 0xff0000; // 圆点填充颜色
        this.allPointArr = [];
    }

    /**绘制点 */
    drawPoint(point) {
        let radius = (point.distanceTo(new THREE.Vector3(0, 0, 0)) / 30) * 0.3;
        this.dotRadius = radius > 30 ? 30 : radius;
        let sphereGeometry = new THREE.SphereGeometry(this.dotRadius, 32);
        let sphereMaterial = new THREE.MeshBasicMaterial({
            color: this.dotFillColors,
            shading: THREE.FlatShading
        });
        let dotMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        dotMesh.position.copy(point);
        scene.add(dotMesh);
        this.allPointArr.push(dotMesh);
    }

    /**
     * 清除点
     * @param {Number} num 0-全部清除 -1从尾部开始清除 1从头开始清除
     */
    clear(num = 0) {
        let dArr = num == 0 ? this.allPointArr.splice(0, this.allPointArr.length) : num < 0 ? this.allPointArr.splice(num, Math.abs(num)) : this.allPointArr.splice(0, num);
        dArr.map((item, idx) => {

            disposeNode(item);

        });
    }
}

export default SWDrawPoint;