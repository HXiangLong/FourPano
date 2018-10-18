import * as constants from './SWConstants';
import {
    setCameraAngle,
    Vector3ToVP
} from './SWTool';
import SWMarkerArrowModule from '../module/marker/SWMarkerArrowModule';
import SWMarkerSingleModule from '../module/marker/SWMarkerSingleModule';
import SWMarkerMoreModule from '../module/marker/SWMarkerMoreModule';
import SWMarkerVideoModule from '../module/marker/SWMarkerVideoModule';
import initStore from '../../views/redux/store/store';
import {
    background_music_fun,
    show_PanoMap_fun
} from '../../views/redux/action';
const swExternalConst = require('./SWExternalConst');

/**加载完成之后调用 */
export function LoadPreviewImage() {

    //站点跳转之后需要更新一下小地图
    let store = initStore();
    store.dispatch(show_PanoMap_fun({
        pID: constants.c_StationInfo.panoID
    }));

    AddMarkerMesh();

    let waitTime = setTimeout(() => {

        if (constants.c_isWallClickRotateBoo) {

            constants.c_isWallClickRotateBoo = false;

            rotateByWallClick();
        }

        InitialOrientation();

        AddSmallVideo();

        clearTimeout(waitTime);

        constants.c_JumpCompleted = true;

    }, 500);
}

/**跳转时需要清除所有的东西 */
export function deleteAll() {

    deleteMarker();

    //清除箭头
    constants.c_arrowArr.forEach((item) => {

        if (item) item.clearArrow();

    });
    constants.c_arrowArr.length = 0;

    //清除墙面片
    constants.sw_wallMesh.clear();

    //隐藏探面
    constants.sw_wallProbeSurface.wallProbeSurfaceVisible(0, 0);

    constants.sw_measure.clear();

    constants.c_smallVideoArr.forEach((item) => {

        if (item) item.clearSmallVideo();

    });
    constants.c_smallVideoArr.length = 0;

    deleteMeasuring();
}

export function deleteMarker(){
    //清理标注
    constants.c_markerMeshArr.forEach((item) => {

        item.clear();

    });
    constants.c_markerMeshArr.length = 0;
}

/**清除测量 */
export function deleteMeasuring(){

    constants.c_isMeasureStatus = false;
    
    constants.sw_measure.clear();
}

/**
 * 添加老箭头数据
 * */
export function AddOldArrow() {
    constants.c_AdjacentPanoInfoArr.forEach((obj) => {

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

    constants.c_ArrowPanoInfoArr.forEach((obj) => {

        if (boo) {

            constants.c_arrowArr.forEach((item) => {

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
 * 跳站点
 * @param {String} panoID 站点ID
 */
export function jumpSite(panoID) {

    constants.c_JumpCompleted = false;

    deleteAll();

    constants.sw_getService.getPanoByID(panoID);
}

/**
 * 添加标注
 * */
export function AddMarkerMesh() {

    constants.c_markerInfoArr.forEach((obj) => {

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
 * 添加视频
 * */
export function AddSmallVideo() {

    let tableValue = constants.c_allVideoTable.getValues();

    let vboo = false;

    constants.c_isDisplayFace = true;

    tableValue.forEach((obj) => {

        if (obj.panoID == constants.c_StationInfo.panoID) {

            vboo = true;

            let details = JSON.parse(obj.details);

            constants.c_smallVideoArr.push(new SWMarkerVideoModule(details, obj.panoID));

            var yp = Vector3ToVP(new THREE.Vector3(details.posX, details.posY, details.posZ));

            setCameraAngle(yp.Yaw, yp.Pitch, true);

            constants.c_isDisplayFace = details.openBox || false;

        }
    });

    if (vboo) {

        let store = initStore();

        store.dispatch(background_music_fun({
            bgMusicOff: false
        }));
    }
};

/**初始朝向 */
export function InitialOrientation() {

    //如果传入站点和配置点冲突了，以传入站点为主
    if(swExternalConst.server_json.firstAnimation && swExternalConst.server_json.firstPanoID == constants.c_StationInfo.panoID){

        swExternalConst.server_json.firstAnimation = false;
        
        setCameraAngle(swExternalConst.server_json.firstYaw, swExternalConst.server_json.firstPitch, true);

    }else{

        swExternalConst.server_json.data.InitialOrientation.forEach((obj, idx) => {

            if (obj.panoid == constants.c_StationInfo.panoID) {
    
                setCameraAngle(obj.yaw, obj.pitch, true);
    
            }
        });

    }
}

/**
 * 跳转之后看向某一个点
 * */
export function rotateByWallClick() {

    let aa = constants.c_wallClickRotateV3.clone().sub(constants.c_StationInfo.point.clone());

    let bb = aa.clone().applyMatrix4(constants.c_DS3ToOpenGLMx4);

    let swvg = Vector3ToVP(new THREE.Vector3(bb.z, -bb.y, bb.x));

    setCameraAngle(swvg.Yaw, swvg.Pitch, true);
};

/**
 * 跳转之后看向标注的中心点
 * @param {SWMarkerInfo} obj 标注点对象
 */
export function JumpLookMarker(obj) {

    if (obj.centerX != 0 && obj.centerY != 0 && obj.centerZ != 0) {

        setCameraAngle(obj.centerX, obj.centerY, true);

    } else {

        let yaw = [],
            pitch = [];

        obj.points.forEach((objs) => {

            yaw.push(parseFloat(objs.yaw));

            pitch.push(parseFloat(objs.pitch));

        });

        let yawArr = yaw.sort(function (a, b) {
            if (a > b) {
                return 1;
            } else {
                return -1;
            }
        });

        let pitchArr = pitch.sort(function (a, b) {
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

        setCameraAngle(yy, pp, true);
    }
}