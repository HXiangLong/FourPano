/* global THREE*/

import { sw_groundMesh, c_WallDisplaySize } from '../../tool/SWConstants';
import SWDrawPoint from './SWDrawPoint';
import SWDrawLine from './SWDrawLine';

/**
 * 测量功能
 */
class SWMeasureModule {
    /**
     * 测量功能的构造函数
     */
    constructor() {

        this.swDrawPoint = new SWDrawPoint();

        this.swDrawLine = new SWDrawLine();
    }

    /**
     * 
     * @param {Object} obj 在墙上地上点击的点
     * @param {*} type 1-墙上点的  2-地面点的
     */
    addPoint(obj, type) {

        if (obj) {

            if (this.swDrawLine.lineTimeBoo) return; //绘制中请稍等

            let poi = new THREE.Vector3(obj.point.x, obj.point.y, obj.point.z);

            if (type === 2) {
                poi.copy(new THREE.Vector3((obj.point.x / -sw_groundMesh.groundDisplaySize) * c_WallDisplaySize,
                    (obj.point.y / -sw_groundMesh.groundDisplaySize) * c_WallDisplaySize,
                    (obj.point.z / -sw_groundMesh.groundDisplaySize) * c_WallDisplaySize));
            }

            this.swDrawPoint.drawPoint(poi);

            this.swDrawLine.addPoint(poi);
        }

    }
}
export default SWMeasureModule;