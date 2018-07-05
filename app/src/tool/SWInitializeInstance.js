/**
 * 初始化实例对象
 */

import * as constants from './SWConstants';
import SWMarkerArrowModule from '../module/marker/SWMarkerArrowModule';

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
}