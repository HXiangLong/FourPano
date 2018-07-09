/* global THREE,$*/

import SWMarkerModule from "./SWMarkerModule";
const external = require('../../tool/SWExternalConst');

/**
 * 标注显示
 */
class SWMarkerDynamicModule extends SWMarkerModule {
    constructor(obj) {

        if (obj.centerX != 0 && obj.centerY != 0) {
            if (obj.type === 999) {
                super(external.marker_b_icon, 1, { fpsNum: 1, wPlane: 128 * 0.8, hPlane: 128 * 0.8 });
            } else if (obj.type === 998) {
                super(external.marker_helicopter_icon, 1, { fpsNum: 1, wPlane: 128 * 0.8, hPlane: 128 * 0.8 });
            } else if (obj.type === 4) {
                super(external.marker_video_icon, 1, { fpsNum: 1, wPlane: 207, hPlane: 157 });
            }

        }

        this.startPoint = new THREE.Vector2();
        this.markerObj = obj;
    }


}
export default SWMarkerDynamicModule;