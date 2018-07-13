/**
 * 初始化实例对象
 */

import * as constants from './SWConstants';
import { setCameraAngle } from './SWTool';
import SWMarkerArrowModule from '../module/marker/SWMarkerArrowModule';
import SWMarkerSingleModule from '../module/marker/SWMarkerSingleModule';
import SWMarkerMoreModule from '../module/marker/SWMarkerMoreModule';

/**
 * 添加老箭头数据
 * */
export function AddOldArrow() {
    constants.c_AdjacentPanoInfoArr.map((obj) => {

        constants.c_arrowArr.push(new SWMarkerArrowModule(obj));

    });

    constants.sw_getService.getNewArrow();
}

/**
 * 添加新箭头数据
 * */
export function AddNewArrow() {

    let boo = true;

    if (constants.c_arrowArr.length == 0) {

        boo = false;
    }

    constants.c_ArrowPanoInfoArr.map((obj) => {

        if (boo) {

            constants.c_arrowArr.map((item) => {

                if (item.arrowData.srcPanoID === obj.srcPanoID && item.arrowData.dstPanoID === obj.dstPanoID) {

                    item.updateLocation(obj);

                }

            });

        } else {

            constants.c_arrowArr.push(new SWMarkerArrowModule(obj));

        }
    });
}

/**
 * 清除所有箭头
 * */
export function deleteAllArrow() {

    constants.c_arrowArr.map((item) => {

        if (item) item.clearArrow();

    });
    constants.c_arrowArr.length = 0;
}

/**
 * 跳站点
 * @param {String} panoID 站点ID
 */
export function jumpSite(panoID) {

    deleteAll();

    constants.sw_getService.getPanoByID(panoID);
}

/**跳转时需要清除所有的东西 */
export function deleteAll() {

    deleteAllArrow();

    constants.sw_wallMesh.clear();

    constants.sw_wallProbeSurface.wallProbeSurfaceVisible(0, 0);

    constants.c_markerMeshArr.map((item) => {

        item.clear();

    });

    constants.sw_measure.clear();
}

/**
 * 添加标注
 * */
export function AddMarkerMesh() {

    constants.c_markerInfoArr.map((obj) => {

        if (obj.centerX != 0 && obj.centerY != 0) {

            constants.c_markerMeshArr.push(new SWMarkerSingleModule(obj));

        } else {

            constants.c_markerMeshArr.push(new SWMarkerMoreModule(obj));

        }

        if (constants.c_JumpMarkerID != "" && constants.c_JumpMarkerID == obj.markerID) {

            constants.c_JumpMarkerID = "";

            JumpLookMarker(obj);

        }
    });
}

/**
 * 跳转之后看向标注的中心点
 * @param {SWMarkerInfo} obj 标注点对象
 */
export function JumpLookMarker(obj) {

    if (obj.centerX != 0 && obj.centerY != 0 && obj.centerZ != 0) {

        setCameraAngle(obj.centerX, obj.centerY);

    } else {

        let yaw = [],
            pitch = [];

        obj.points.map((objs) => {

            yaw.push(parseFloat(objs.yaw));

            pitch.push(parseFloat(objs.pitch));

        });

        let yawArr = yaw.sort(function(a, b) {
            if (a > b) {
                return 1;
            } else {
                return -1;
            }
        });

        let pitchArr = pitch.sort(function(a, b) {
            if (a > b) {
                return 1;
            } else {
                return -1;
            }
        });

        let num = yawArr[yawArr.length - 1];

        if (yawArr[0] < 100 && yawArr[yawArr.length - 1] > 300) {

            num = 360 - yawArr[yawArr.length - 1];

        }

        let yy = yawArr[0] + (num - yawArr[0]) * 0.5;

        let pp = pitchArr[0] + (pitchArr[pitchArr.length - 1] - pitchArr[0]) * 0.5;

        setCameraAngle(yy, pp);
    }
}