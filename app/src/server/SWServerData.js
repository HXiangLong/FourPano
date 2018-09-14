/* global $*/

import * as constants from '../tool/SWConstants';
import ArrowInfo from '../data/SWArrowInfo';
import FacadeByPanoIDInfo from '../data/SWFacadeByPanoIDInfo';
import FloorsInfo from '../data/SWFloorsInfo';
import SWMarkerInfo from '../data/SWMarkerInfo';
import MultiDataByParentID from '../data/SWMultiDataByParentIDInfo';
import ThumbnailsInfo from '../data/SWThumbnailsInfo';
import StationInfo from '../data/SWStationInfo';
import AllExhibitsForBuilding from '../data/SWAllExhibitsForBuilding';
import VideosData from '../data/SWVideosData';
import {
    AddNewArrow,
    AddOldArrow
} from '../tool/SWInitializeInstance';
import initStore from '../../views/PC/redux/store/store';
import {
    show_Thumbnails_fun,
    show_PanoMap_fun
} from '../../views/PC/redux/action';
const external = require('../tool/SWExternalConst.js');
const axios = require('axios');

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

        let urls = this.musServerURL + "?method=GetAllFloorsForBuilding&buildingID=" + this.displayID + "&random=" + Math.random() * 10;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                if (json.data.Floors) {

                    json.data.Floors.map((obj) => {

                        new FloorsInfo(obj);

                    });

                    //数据来之后可以弹出展厅列表
                    let store = initStore();

                    store.dispatch(show_PanoMap_fun(true));
                }

                this.getAllThumbnailsForMuseum();
                this.getAllExhibitsForBuilding();
            });
    }

    /**
     * 获得当前站点信息
     * @param {String} panoid 站点ID
     */
    getPanoByID(panoid) {

        let urls = this.serverURL + "/GetPanoByID?ImageID=" + panoid;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                if (json.data.GetPanoByIDResult) {

                    if (!constants.c_StationInfo || (constants.c_isPreviewImageLoadEnd && constants.c_StationInfo.panoID != json.data.GetPanoByIDResult.ImageID)) {

                        constants.c_isPreviewImageLoadEnd = false;

                        constants.c_StationInfo = new StationInfo(json.data.GetPanoByIDResult);

                        constants.sw_skyBox.addThumbnail();

                    }
                }
            });
    }

    /**
     * 激光点云面片数据
     * */
    getFacadeByPanoID() {

        let urls = this.serverURL + "/GetFacadeByPanoID/?Z=" + constants.c_StationInfo.nz + "&PanoID=" + constants.c_StationInfo.panoID + "&TolerateZ=" + 5;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.GetFacadeByPanoIDResult) {

                    constants.c_facadeByPanoIDInfoArr.length = 0;

                    json.data.GetFacadeByPanoIDResult.map((obj) => {

                        constants.c_facadeByPanoIDInfoArr.push(new FacadeByPanoIDInfo(obj));

                    });

                    constants.sw_wallMesh.createWallFace();
                }
            });
    }

    /**
     * 获取老箭头方法
     * */
    getOldArrow() {

        let urls = this.serverURL + "/GetAdjacentPano/?date=" + Math.random() * 100 + "&ImageID=" + constants.c_StationInfo.panoID;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                if (json.data.GetAdjacentPanoResult) {

                    constants.c_AdjacentPanoInfoArr.length = 0;

                    json.data.GetAdjacentPanoResult.map((obj) => {

                        constants.c_AdjacentPanoInfoArr.push(new ArrowInfo(obj, 1));

                    });

                    AddOldArrow();

                } else {

                    this.getNewArrow();

                }
            });
    }

    //获得新箭头
    getNewArrow() {

        let urls = this.musServerURL + "?method=getLinkByPanoID&panoID=" + constants.c_StationInfo.panoID;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                constants.c_ArrowPanoInfoArr.length = 0;

                if (json.data.Link) {

                    json.data.Link.map((obj) => {

                        constants.c_ArrowPanoInfoArr.push(new ArrowInfo(obj, 2));

                    });

                    AddNewArrow();

                }
            });
    }

    /**
     * 地面跳转
     * */
    getOtherPanoByPosition(x, y, z, panoid) {

        let urls = this.serverURL + "/GetOtherPanoByPosition1?TolerateZ=5&Tolerate=100&Z=" + z + "&Y=" + y + "&ImageID=" + panoid + "&X=" + x;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.GetOtherPanoByPositionResult) {

                    if (constants.c_isPreviewImageLoadEnd && constants.c_StationInfo.panoID != json.data.GetOtherPanoByPositionResult.ImageID) {

                        constants.c_isPreviewImageLoadEnd = false;

                        constants.c_StationInfo = new StationInfo(json.data.GetOtherPanoByPositionResult);

                        constants.sw_skyBox.addThumbnail();

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

        let urls = this.serverURL + "/GetOtherPanoByFacadeID?facadeID=" + facadeid + "&Z=" + z + "&Y=" + y + "&X=" + x;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.GetOtherPanoByFacadeIDResult) {

                    if (constants.c_isPreviewImageLoadEnd && constants.c_StationInfo.panoID != json.data.GetOtherPanoByFacadeIDResult.ImageID) {

                        constants.c_isPreviewImageLoadEnd = false;

                        constants.c_isWallClickRotateBoo = true;

                        constants.c_StationInfo = new StationInfo(json.data.GetOtherPanoByFacadeIDResult);

                        constants.sw_skyBox.addThumbnail();

                    }

                }
            });
    }

    /**
     * 获取标注
     * */
    getMarkerByPanoID() {

        constants.c_markerInfoArr.length = 0;

        let urls = this.musServerURL + "?method=getMarkerByPanoID&panoID=" + constants.c_StationInfo.panoID;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.MarkerInfo) {

                    json.data.MarkerInfo.map((obj) => {

                        constants.c_markerInfoArr.push(new SWMarkerInfo(obj));

                    });
                }
            });
    }

    /**
     * 获取推荐展厅数据
     * */
    getAllThumbnailsForMuseum() {
        if (constants.c_isEditorStatus || constants.c_thumbnailsForMuseum.length > 0) {
            return;
        }
        let urls = this.musServerURL + "?method=GetAllThumbnailsForBuilding&buildingID=" + this.displayID;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.thumbnails) {

                    json.data.thumbnails.map((obj) => {

                        constants.c_thumbnailsForMuseum.push(new ThumbnailsInfo(obj));

                    });

                    //数据来之后可以弹出展厅列表
                    // let store = initStore();

                    // store.dispatch(show_Thumbnails_fun(true));
                }
            });
    }

    /**
     * 获取所有文物信息列表
     * */
    getAllExhibitsForBuilding() {
        let urls = this.musServerURL + "?method=GetAllExhibitsForBuilding&buildingID=" + this.displayID;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.Exhibits) {

                    json.data.Exhibits.map((obj) => {

                        let allExhibits = new AllExhibitsForBuilding(obj);

                        let markerIDArr = allExhibits.markerID[0];

                        constants.c_allExhibitsForBuildingTable.add(markerIDArr, allExhibits);
                    });
                }
            });
    }

    /**
     * 获取单个文物信息
     * */
    getMultiDataByParentID(eid) {
        let urls = this.musServerURL + "?method=GetMultiDataByParentID&parentID=" + eid;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.MultiDatas) {

                    let arr = [];

                    json.data.MultiDatas.map((obj) => {

                        let multiData = new MultiDataByParentID(obj);

                        arr.push(multiData);
                    });

                    constants.c_multiDataByParentIDTable.add(eid, arr);
                }
            });
    }

    /**
     * 获取所有视频列表
     * */
    getAllVideos = function () {
        let urls = this.musServerURL + "?method=getAllVideos";

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.videoInfo) {

                    json.data.videoInfo.map((obj) => {

                        let vd = new VideosData(obj);

                        constants.c_allVideoTable.add(vd.videoName, vd);
                    });
                }
            });
    }


}
export default ServerData;