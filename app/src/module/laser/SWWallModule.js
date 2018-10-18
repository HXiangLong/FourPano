import SWWallFaceModule from './SWWallFaceModule';
import { c_facadeByPanoIDInfoArr, c_StationInfo, sw_groundMesh } from '../../tool/SWConstants';

/**
 * 激光点云墙面片集合对象
 */
class SWWallModule {
    constructor() {
        /**当前站点墙面显示集合 */
        this.wallMeshArr = [];
    }

    /**
     * 生成墙面片集合
     */
    createWallFace() {

        c_facadeByPanoIDInfoArr.forEach((item) => {

            if (c_StationInfo.point.clone().distanceTo(item.points.p1) < 100) { //100 限制不在眼前的面片不显示

                this.wallMeshArr.push(new SWWallFaceModule(item));

            }

        });

        sw_groundMesh.drawGroundFace();

    }

    /**
     * 清理墙面片
     */
    clear() {

        this.wallMeshArr.forEach((item) => {

            item.clearWallMesh();

        });

        this.wallMeshArr.length = 0;
    }

}

export default SWWallModule;