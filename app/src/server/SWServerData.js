/* global $*/

import * as constants from '../tool/SWConstants';
import ArrowInfo from '../data/SWArrowInfo';
import ExhibitsInfo from '../data/SWExhibitsInfo';
import FacadeByPanoIDInfo from '../data/SWFacadeByPanoIDInfo';
import FloorsInfo from '../data/SWFloorsInfo';
import MarkerInfo from '../data/SWMarkerInfo';
import MultiDataByParentIDInfo from '../data/SWMultiDataByParentIDInfo';
import ThumbnailsInfo from '../data/SWThumbnailsInfo';
import StationInfo from '../data/SWStationInfo';
import { AddNewArrow, AddOldArrow } from '../tool/SWInitializeInstance';
const external = require('../tool/SWExternalConst.js');

/**
 * 获取服务器数据
 */
class ServerData {
    constructor() {
        /**博物馆ID*/
        this.museumID = "";
        /**建筑ID*/
        this.displayID = "";
        /**底层数据库链接*/
        this.serverURL = "";
        /**业务数据库链接*/
        this.musServerURL = "";
        /**默认第一站全景ID*/
        this.firstPanoID = "";
        /**数据存放处*/
        this.resourcesUrl = "";
        /**功能对象*/
        this.featuresObj = {};
    }

    getmusServerURL() {
        return this.musServerURL;
    }

    /**
     * 获取配置文件数据
     */
    getConfig() {
        console.info(external.server_json);
        this.museumID = external.server_json.museumID;
        this.displayID = external.server_json.displayID;
        this.serverURL = external.server_json.serverUrl;
        this.musServerURL = external.server_json.musServerUrl;
        this.firstPanoID = external.server_json.firstPanoID;
        this.resourcesUrl = external.server_json.resourcesUrl;
        this.featuresObj = external.server_json.data;
        this.getPanoByID(this.firstPanoID);
        this.getAllFloorsForBuilding();
    }

    /**
     * 获得所有楼层站点信息
     */
    getAllFloorsForBuilding() {
        let urls = "?method=GetAllFloorsForBuilding&buildingID=" + this.displayID + "&random=" + Math.random() * 10;
        $.ajax({
            url: this.musServerURL + urls,
            type: 'GET',
            cache: true,
            dataType: 'json',
            error: (data) => {
                console.log("网络连接错误，请刷新重试！");
            },
            success: (data) => {
                if (data.Floors) {
                    data.Floors.map((obj) => {
                        new FloorsInfo(obj);
                    });
                    // console.log(constants.c_FloorsMapTable);
                    // if (SWPanoView.swMinMap) {
                    //     SWPanoView.swMinMap.init();
                    // }
                }
            }
        })
    }

    /**
     * 获得当前站点信息
     * @param {String} panoid 站点ID
     */
    getPanoByID(panoid) {
        let url = "/GetPanoByID?ImageID=" + panoid;
        $.ajax({
            url: this.serverURL + url,
            type: 'GET',
            cache: true,
            dataType: 'json',
            error: (data) => {
                console.log("网络连接错误，请刷新重试！");
            },
            success: (data) => {
                if (data.GetPanoByIDResult) {
                    if (!constants.c_StationInfo || (constants.c_isPreviewImageLoadEnd && constants.c_StationInfo.panoID != data.GetPanoByIDResult.ImageID)) {
                        constants.c_isPreviewImageLoadEnd = false;
                        constants.c_StationInfo = new StationInfo(data.GetPanoByIDResult);
                        constants.sw_skyBox.addThumbnail();
                        this.getOldArrow();
                        this.getFacadeByPanoID();
                    }
                }
            }
        });
    }

    /**
     * 激光点云面片数据
     * */
    getFacadeByPanoID() {
        let url = "/GetFacadeByPanoID/?Z=" + constants.c_StationInfo.nz + "&PanoID=" + constants.c_StationInfo.panoID + "&TolerateZ=" + 5;
        $.ajax({
            url: this.serverURL + url,
            type: 'GET',
            cache: true,
            dataType: 'json',
            error: (data) => {
                console.log("网络连接错误，请刷新重试！");
            },
            success: (data) => {

                if (data.GetFacadeByPanoIDResult) {

                    constants.c_facadeByPanoIDInfoArr.length = 0;

                    data.GetFacadeByPanoIDResult.map((obj) => {

                        constants.c_facadeByPanoIDInfoArr.push(new FacadeByPanoIDInfo(obj));

                    });

                    constants.sw_wallMesh.createWallFace();
                    constants.sw_groundMesh.drawGroundFace();
                    // //绘制墙面片
                    // SWPanoView.swWallMesh.init();
                    // SWPanoView.swGroundMesh.groundMeshShow(true);
                    // if (SWPanoView.isWallClickRotateBoo) {
                    //     SWPanoView.isWallClickRotateBoo = false;
                    //     SWPanoView.rotateByWallClick();
                    // }
                }
                // else {
                //     SWPanoView.swGroundMesh.groundMeshShow(false);
                // }
            }
        });
    }

    /**
     * 获取老箭头方法
     * */
    getOldArrow() {
        let url = "/GetAdjacentPano/?date=" + Math.random() * 100 + "&ImageID=" + constants.c_StationInfo.panoID;
        $.ajax({
            url: this.serverURL + url,
            type: 'GET',
            cache: true,
            dataType: 'json',
            error: (data) => {
                console.log("网络连接错误，请刷新重试！");
            },
            success: (data) => {
                if (data.GetAdjacentPanoResult) {
                    constants.c_AdjacentPanoInfoArr.length = 0;
                    data.GetAdjacentPanoResult.map((obj) => {
                        constants.c_AdjacentPanoInfoArr.push(new ArrowInfo(obj, 1));
                    });
                    AddOldArrow();
                } else {
                    this.getNewArrow();
                }
            }
        });
    }

    //获得新箭头
    getNewArrow() {
        let urls = "?method=getLinkByPanoID&panoID=" + constants.c_StationInfo.panoID;
        $.ajax({
            url: this.musServerURL + urls,
            type: 'GET',
            cache: true,
            dataType: 'json',
            error: (data) => {
                console.log("网络连接错误，请刷新重试！");
            },
            success: (data) => {
                constants.c_ArrowPanoInfoArr.length = 0;
                if (data.Link) {
                    data.Link.map((obj) => {
                        constants.c_ArrowPanoInfoArr.push(new ArrowInfo(obj, 2));
                    });
                    AddNewArrow();
                }
            }
        });
    }

    /**
     * 地面跳转
     * */
    getOtherPanoByPosition(x, y, z, panoid) {
        let urls = "/GetOtherPanoByPosition1?TolerateZ=5&Tolerate=100&Z=" + z + "&Y=" + y + "&ImageID=" + panoid + "&X=" + x;
        $.ajax({
            url: this.serverURL + urls,
            type: 'GET',
            cache: true,
            dataType: 'json',
            error: (data) => {
                console.log("网络连接错误，请刷新重试！");
            },
            success: (data) => {
                if (constants.c_isPreviewImageLoadEnd && constants.c_stationInfo.panoid != data.GetOtherPanoByPositionResult.ImageID) {
                    constants.c_isPreviewImageLoadEnd = false;
                    constants.c_stationInfo = new StationInfo(data.GetOtherPanoByPositionResult);
                    // SWPanoView.swMinMap.init();
                    // if (SWPanoView.swSkySphere) {
                    //     SWPanoView.swSkySphere.initSkySphere();
                    // } else if (SWPanoView.swSkyBox) {
                    //     SWPanoView.swSkyBox.initBox(SWPanoView.stationInfo);
                    // }
                }
            }
        });
    }

    /**
     * 墙面跳转
     * @param {Number} x 3DS坐标X
     * @param {Number} y 3DS坐标Y
     * @param {Number} z 3DS坐标Z
     * @param {Number} facadeid 点击跳转的墙面片ID
     */
    getOtherPanoByFacadeID(x, y, z, facadeid) {
        let urls = "/GetOtherPanoByFacadeID?facadeID=" + facadeid + "&Z=" + z + "&Y=" + y + "&X=" + x;
        $.ajax({
            url: this.serverURL + urls,
            type: 'GET',
            cache: true,
            dataType: 'json',
            error: (data) => {
                console.log("网络链接错误，请刷新重试！");
            },
            success: (data) => {
                // if (SWPanoView.isPreviewImageLoadEnd && SWPanoView.stationInfo.imageID != data.GetOtherPanoByFacadeIDResult.ImageID) {
                //     SWPanoView.isPreviewImageLoadEnd = false;
                //     var newPanoInfo = new StationInfo(data.GetOtherPanoByFacadeIDResult);
                //     SWPanoView.stationInfo = newPanoInfo;
                //     SWPanoView.isWallClickRotateBoo = true;
                //     if (SWPanoView.swSkySphere) {
                //         SWPanoView.swSkySphere.initSkySphere();
                //     } else if (SWPanoView.swSkyBox) {
                //         SWPanoView.swSkyBox.initBox(SWPanoView.stationInfo);
                //     }
                // } else {
                //     SWPanoView.addmouseEvent.mouseEvent.ifJump = false;
                //     SWPanoView.wallProbeSurface.wallProbeSurfaceVisible(true);
                // }
            }
        });
    };

}
export default ServerData;