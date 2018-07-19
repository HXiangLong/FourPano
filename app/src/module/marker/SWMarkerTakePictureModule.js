/* global THREE,$*/
import SWMarkerMoreModule from './SWMarkerMoreModule';
import SWDrawPoint from '../draw/SWDrawPoint';
import SWDrawLine from '../draw/SWDrawLine';
import { Vector3ToVP, getSceneToWorld, VPToVector3 } from '../../tool/SWTool';
/**
 * 绘制面标注
 */
class SWMarkerTakePictureModule {
    constructor() {

        this.swDrawPoint = new SWDrawPoint();

        this.swMarkerMoreModule = new SWMarkerMoreModule();

        this.swDrawLine = new SWDrawLine();

        this.downPoint = new THREE.Vector2();

        this.upPoint = new THREE.Vector2();

        this.vpArr = [];
    }

    addPoint(nx, ny, type) {

        if (type === 1) { //鼠标按下

            this.downPoint.x = nx;

            this.downPoint.y = ny;

        } else if (type === 2) { //鼠标弹起

            this.upPoint.x = nx;

            this.upPoint.y = ny;

        }

        if (this.upPoint.equals(this.downPoint)) {

            let vp = Vector3ToVP(getSceneToWorld(nx, ny));

            this.vpArr.push({ yaw: vp._yaw, pitch: vp._pitch });

            let poi = VPToVector3(vp);

            this.swDrawPoint.drawPoint(poi);

            this.swDrawLine.addPoint(poi, false);

            if (this.vpArr.length > 3) {
                this.swMarkerMoreModule.clear();
                this.swMarkerMoreModule.createPolygon(this.vpArr);

            }
        }
    }
}
export default SWMarkerTakePictureModule;