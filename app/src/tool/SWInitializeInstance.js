import * as constants from './SWConstants';
import {
    setCameraAngle,
    Vector3ToVP
} from './SWTool';
import SWMarkerArrowModule from '../module/marker/SWMarkerArrowModule';
import SWMarkerSingleModule from '../module/marker/SWMarkerSingleModule';
import SWMarkerMoreModule from '../module/marker/SWMarkerMoreModule';
import SWMarkerVideoModule from '../module/marker/SWMarkerVideoModule';
import SWSiteLocationMoudle from '../module/marker/SWSiteLocationMoudle';
import initStore from '../../views/redux/store/store';
import {
    background_music_fun,
    show_PanoMap_fun,
    pano_prompt_fun,
    show_Thumbnails_fun,
    show_Introduction_fun
} from '../../views/redux/action';
const swExternalConst = require('./SWExternalConst');
const external = require('../tool/SWExternalConst.js');

const TWEEN = require('@tweenjs/tween.js');

/**加载完成之后调用 */
export function LoadPreviewImage() {

    storeDispatch();

    let waitTime = setTimeout(() => {

        //墙面跳转朝向 优先级最低
        if (constants.c_isWallClickRotateBoo) { 

            constants.c_isWallClickRotateBoo = false;

            rotateByWallClick();
        }

        //初始朝向 优先级中等
        InitialOrientation(); 

        //嵌入视频朝向 优先级最高
        AddSmallVideo();

        //标注 主要是为了点击热点墙时能看向热点
        AddMarkerMesh();

        //跳转之后，第一眼要加载
        constants.sw_skyBox.panoBox.addFaceTiles();

        //目录树点击之后朝向 优先级最高
        if (constants.c_treeShapeJumpPano) { 

            constants.c_treeShapeJumpPano = false;

            let arr = constants.c_treeShapeJumpPanoStr.split("#");

            setCameraAngle(parseFloat(arr[0]), parseFloat(arr[1]), true);
        }

        clearTimeout(waitTime);

        constants.c_isPreviewImageLoadEnd = false;

    }, 500);
}

/**加载完之后，界面有些需要更新 */
export function storeDispatch() {

    let store = initStore();

    if (constants.c_initUIData) {

        constants.c_initUIData = false;
        //简介
        store.dispatch(show_Introduction_fun({
            imgurl: external.server_json.data.resourcePath + external.server_json.data.Introduction.imgUrl,
            title: external.server_json.data.Introduction.title,
            content: external.server_json.data.Introduction.content
        }));

        //背景音乐
        store.dispatch(background_music_fun({
            audioUrl: external.server_json.data.resourcePath + external.server_json.data.bgMusic
        }));
    }

    if (constants.c_StationInfo) {

        let mapmarker = constants.c_panoIDTable.getValue(constants.c_StationInfo.panoID);
        let floorsMapData = null;
        let imgurl = "";
        let floorsMapArr = constants.c_FloorsMapTable.getValues();

        for (let i = 0; i < floorsMapArr.length; i++) {
            let obj = floorsMapArr[i];
            if (mapmarker.rasterMapID == obj.floorID) {
                floorsMapData = obj;
                imgurl = `${constants.sw_getService.resourcesUrl}/${obj.rasterMapPath}`;
                break;
            }
        }

        //站点跳转之后需要更新一下小地图
        store.dispatch(show_PanoMap_fun({
            pID: constants.c_StationInfo.panoID,
            imgUrl: imgurl,
            floorsMapData: floorsMapData
        }));

        //当前位置名称更新
        store.dispatch(pano_prompt_fun({
            panoNames: mapmarker.markerContent
        }));

        //分站点、楼层音频文件
        external.server_json.data.AudioList.forEach((item) => {
            if (item.panoArr.indexOf(floorsMapData.floorID) != -1 || item.panoArr.indexOf(constants.c_StationInfo.panoID) != -1) {
                store.dispatch(background_music_fun({
                    audioUrl: `${constants.sw_getService.resourcesUrl}/BusinessData/ExhibitDetails/Audio/${item.audioName}`
                }));
            }
        });

        //限制上下俯仰角
        for (let i = 0; i < external.server_json.data.AngleLimit.length; i++) {
            let item = external.server_json.data.AngleLimit[i];
            if (item.panoArr.indexOf(floorsMapData.floorID) != -1 || item.panoArr.indexOf(constants.c_StationInfo.panoID) != -1) {
                constants.c_maxPitch = item.UpperAngle;
                constants.c_minPitch = item.LowerAngle;
                break;
            } else {
                constants.c_maxPitch = item.UpperAngle;
                constants.c_minPitch = item.LowerAngle;
            }
        }
    }

    if (constants.c_thumbnailsShow) {
        constants.c_thumbnailsShow = false;
        //数据来之后可以弹出展厅列表
        store.dispatch(show_Thumbnails_fun(true));
    }
}

/**跳转时需要清除所有的东西 */
export function deleteAll() {

    deleteMarker();

    //清除箭头
    constants.c_arrowArr.forEach((item) => {

        if (item) item.clearArrow();

    });
    constants.c_arrowArr.length = 0;

    constants.c_arrowCurentArr.length = 0;

    //清除墙面片
    constants.sw_wallMesh.clear();

    //隐藏探面
    constants.sw_wallProbeSurface.wallProbeSurfaceVisible(0, 0);

    constants.c_smallVideoArr.forEach((item) => {

        if (item) item.clearSmallVideo();

    });

    constants.c_smallVideoArr.length = 0;

    deleteMeasuring();
}

export function deleteMarker() {
    //清理标注
    constants.c_markerMeshArr.forEach((item) => {

        item.clear();

    });
    constants.c_markerMeshArr.length = 0;
}

/**清除测量 */
export function deleteMeasuring() {

    constants.c_isMeasureStatus = false;

    constants.sw_measure.clear();
}

/**
 * 添加老箭头数据
 * */
export function AddOldArrow() {

    if (constants.c_siteRepresentation) {

        constants.c_AdjacentPanoInfoArr.forEach((obj) => {

            constants.c_arrowArr.push(new SWMarkerArrowModule(obj));

        });

        constants.sw_getService.getNewArrow();

    } else {

        constants.c_AdjacentPanoInfoArr.forEach((obj) => {

            constants.c_arrowArr.push(new SWSiteLocationMoudle(obj));

        });
    }

    //偷偷加载思路是对的，还未想清楚怎么优先加载本站全景图
    //constants.sw_skyBox.AccordingArrowLoadPano();
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

    if (!constants.c_isPreviewImageLoadEnd) {

        deleteAll();

        constants.sw_getService.getPanoByID(panoID);
    }
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

    constants.c_isDisplayFace = true;

    let vboo = false;

    if (constants.c_allVideoTable.containsKey(constants.c_StationInfo.panoID)) {

        let tableValue = constants.c_allVideoTable.getValue(constants.c_StationInfo.panoID);

        tableValue.forEach((obj) => {

            let details = JSON.parse(obj.details);

            if (constants.c_currentState != constants.c_currentStateEnum.phoneStatus) {

                vboo = true;

                constants.c_smallVideoArr.push(new SWMarkerVideoModule(details, obj.panoID));

                var yp = Vector3ToVP(new THREE.Vector3(details.posX, details.posY, details.posZ));

                //解决同一站点有视频和热点时，查看热点转向问题
                if (constants.c_JumpMarkerID == "") setCameraAngle(yp.Yaw, yp.Pitch, true);

                constants.c_isDisplayFace = details.openBox || false;

            } else if (details.openBox) { //可彈出視頻才會形成标注

                let videoObj = {
                    centerX: parseFloat(details.posX),
                    centerY: parseFloat(details.posY),
                    centerZ: parseFloat(details.posZ),
                    markerID: "sp",
                    name: details.url,
                    panoID: constants.c_StationInfo.panoID,
                    points: "",
                    type: 44
                }

                constants.c_markerMeshArr.push(new SWMarkerSingleModule(videoObj));
            }
        });
    }

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
    if (swExternalConst.server_json.firstAnimation && swExternalConst.server_json.firstPanoID == constants.c_StationInfo.panoID) {

        swExternalConst.server_json.firstAnimation = false;

        setCameraAngle(swExternalConst.server_json.firstYaw, swExternalConst.server_json.firstPitch, true);

    } else {

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

/**摇一摇
 * 判定规则：1.当前站点是否有热点存在
 * 2.箭头能跳转到的点是否有热点存在
 * 3.以上两种都没有则在热点墙上随机挑选
 * 4.以上三种都没有则没有此功能
 */
export function ShakeAmbient() {

    if (constants.c_markerInfoArr.length > 0) { //判定当前站点是否有热点
        //在当前站点的文物随机看向一个
        let objs = constants.c_markerInfoArr[Math.floor((Math.random() * 10 * constants.c_markerInfoArr.length) / 10)];
        JumpLookMarker(objs);
        return true;
    } else {
        let nowArrow;
        if (swExternalConst.server_json.features.arrowType) { //不同的箭头类型，数据表不一样
            nowArrow = constants.sw_GetSQLData.GetAdjacentPanoFun(constants.c_StationInfo.panoID);
        } else {
            nowArrow = constants.sw_GetSQLData.GetStreetViewLinkFun(constants.c_StationInfo.panoID);
        }

        let nowArrowMarkerArr = [];
        for (let i = 0; i < nowArrow.length; i++) { //查找所有箭头站点是否有热点
            let arrowObj = nowArrow[i];
            let nowMarkerArr = constants.sw_GetSQLData.getMarkByPanoIDFun(swExternalConst.server_json.features.arrowType ? arrowObj.DstImageID : arrowObj.DstImageName);
            if (nowMarkerArr && nowMarkerArr.length > 0) {
                nowArrowMarkerArr.push(nowMarkerArr);
            }
        }

        if (nowArrowMarkerArr.length > 0) { //有
            let nowAMArr = nowArrowMarkerArr[0];
            let nowMarker = nowAMArr[Math.floor((Math.random() * 10 * nowAMArr.length) / 10)];
            jumpSite(nowMarker.PanoID);
            constants.c_JumpMarkerID = nowMarker.MarkerID;
            return true;
        } else { //没有
            let buildingArr = constants.c_allExhibitsForBuildingTable.getValues();
            if (buildingArr.length > 0) {
                let aefb = buildingArr[Math.floor((Math.random() * 10 * buildingArr.length) / 10)];
                jumpSite(aefb.panoID);
                constants.c_JumpMarkerID = aefb.markerID[0];
                return true;
            }
            return false;
        }
    }
}

/**开启VR */
export function VRShow() {
    constants.c_mode = constants.c_modes.STEREO;
    constants.sw_SWReticle.show();
    gyroStatus(true);
    let fov = constants.camera.fov;
    // 强制效果立体相机通过刷新fov更新
    constants.camera.fov = fov + 10e-3;
    constants.c_effect.setSize(window.innerWidth, window.innerHeight);
    constants.c_effect.render(constants.scene, constants.camera);
    constants.camera.fov = fov;
}

/**关闭VR */
export function VRHide() {
    constants.c_mode = constants.c_modes.NORMAL;
    constants.sw_SWReticle.hide();
    gyroStatus(false);
}

/**陀螺仪状态 */
export function gyroStatus(boo) {
    constants.c_control.enabled = boo;
}