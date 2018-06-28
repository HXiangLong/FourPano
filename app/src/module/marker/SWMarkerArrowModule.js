/* global THREE,$*/

import SWMarkerModule from "./SWMarkerModule";
import SWViewGesture from "../../tool/SWViewGesture";
import { camera, scene } from '../../tool/SWConstants';
import { VPToVector3, jumpSite } from '../../tool/SWTool';
const external = require('../../tool/SWExternalConst');

/**
 * 箭头标注
 */
class SWMarkerArrowModule extends SWMarkerModule {
    /**
     * 
     * @param {SWArrowInfo} date 箭头数据
     */
    constructor(date) {

        super(external.arrow_icon, 2, 27);

        this.arrowData = date;

        this.swvg = this.arrowData.angle ? new SWViewGesture(this.arrowData.angle, -35, 0) : new SWViewGesture(this.arrowData.yaw, this.arrowData.pitch, 0);

        this.v3 = VPToVector3(this.swvg);

        this.mesh.position.copy(new THREE.Vector3((this.v3.x * 0.65), (this.v3.y * 0.45), (this.v3.z * 0.65)));

        this.mesh.lookAt(camera.position);

        this.mesh.name = this.arrowData.dstPanoID;

        this.mesh.userData.depthlevel = 1;

        scene.add(this.mesh);

        this.mesh.visible = false;

        this.mouseDownBoo = false;

        setTimeout(() => {

            this.mesh.visible = true;

        }, 1000);

        this.mesh.mouseDown = (e, obj) => {

            this.mouseDownBoo = true;

        };

        this.mesh.mouseUp = (e, obj) => {

            if (this.mouseDownBoo) jumpSite(obj.object.name);

        };
    }

    /**
     * 老箭头已经在的情况下，新箭头校正坐标
     * @param {SWArrowInfo} date 新箭头数据
     */
    updateLocation(date) {
        this.arrowData = date;

        this.swvg = new SWViewGesture(this.arrowData.yaw, this.arrowData.pitch, 0);

        this.v3 = VPToVector3(this.swvg);

        this.mesh.position.copy(new THREE.Vector3((this.v3.x * 0.65), (this.v3.y * 0.45), (this.v3.z * 0.65)));

        this.mesh.lookAt(camera.position);
    }

    /**清理箭头对象 */
    clearArrow() {

        this.clear();

        this.arrowData = null;

    }
}

export default SWMarkerArrowModule;