/* global THREE*/

import SWMarkerModule from "./SWMarkerModule";
import SWViewGesture from "../../tool/SWViewGesture";
import {
    camera,
    scene
} from '../../tool/SWConstants';
import {
    VPToVector3
} from '../../tool/SWTool';
const external = require('../../tool/SWExternalConst');

/**
 * 单点标注显示
 */
class SWMarkerSingleModule extends SWMarkerModule {
    constructor(obj) {

        let picurl = "",
            type = 1,
            parameters = {};

        switch (obj.type) {
            case 999:
                picurl = external.marker_b_icon;
                parameters = {
                    fpsNum: 1,
                    wPlane: 128 * 0.8,
                    hPlane: 128 * 0.8
                };
                break;
            case 998:
                picurl = external.marker_helicopter_icon;
                parameters = {
                    fpsNum: 1,
                    wPlane: 128 * 0.8,
                    hPlane: 128 * 0.8
                };
                break;
            case 4:
                picurl = external.marker_video_icon;
                parameters = {
                    fpsNum: 1,
                    wPlane: 207,
                    hPlane: 157
                };
                break;
            case 2:
                picurl = external.marker_default_anim_icon;
                type = 2;
                parameters = {
                    fpsNum: 17,
                    wPlane: 100,
                    hPlane: 100
                };

                break;
            default:
                picurl = external.marker_default_icon;
                parameters = {
                    fpsNum: 1,
                    wPlane: 32,
                    hPlane: 32
                };
                break;
        }
        super(picurl, type, parameters);

        this.markerObj = obj;

        this.swvg = new SWViewGesture(this.markerObj.centerX, this.markerObj.centerY, 0);

        this.v3 = VPToVector3(this.swvg);

        this.mesh.position.copy(this.v3);

        this.mesh.lookAt(camera.position);

        this.mesh.name = this.markerObj.name;

        this.mesh.userData.depthlevel = 1;

        scene.add(this.mesh);

        this.addMouseEvent();
    }
}
export default SWMarkerSingleModule;