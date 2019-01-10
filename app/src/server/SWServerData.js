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
import initStore from '../../views/redux/store/store';
import {
    show_Thumbnails_fun,
    show_PanoMap_fun,
    show_MarkerInterface_fun,
    show_ViewPicture_fun
} from '../../views/redux/action';
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
        /**只加载一次 */
        this.floorsForBuilding = true;
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
        
        constants.sw_SWModel.init();
    }

    /**
     * 获得所有楼层站点信息
     */
    getAllFloorsForBuilding() {

        if (constants.c_currentState != constants.c_currentStateEnum.editorStatus) {
            let data = constants.sw_GetSQLData.GetAllFloorsForBuildingFun();
            this.ReadFloorsForBuildingData(data);
            return;
        }

        let urls = `${this.musServerURL}?method=GetAllFloorsForBuilding&buildingID=${this.displayID }&random=${Math.random() * 10}`;
        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                this.ReadFloorsForBuildingData(json.data);
            });
    }

    /**读取楼层数据 */
    ReadFloorsForBuildingData(data) {
        if (data) {
            if (data.Floors) {
                data.Floors.forEach((obj) => {
                    new FloorsInfo(obj);
                });
                //数据来之后可以显示小地图
                if (constants.c_mapShow) {
                    let store = initStore();
                    store.dispatch(show_PanoMap_fun({
                        off: true,
                        phoneOff: true
                    }));
                }
            }
        }
        this.getAllThumbnailsForMuseum();
        this.getAllExhibitsForBuilding();
        this.getAllVideos();
    }

    /**
     * 获得当前站点信息
     * @param {String} panoid 站点ID
     */
    getPanoByID(panoid) {

        if (constants.c_currentState != constants.c_currentStateEnum.editorStatus) {
            let data = constants.sw_GetSQLData.GetPanoByIDFun(panoid);
            this.ReadPanoByIDData(data);
            return;
        }

        let urls = `${this.serverURL}/GetPanoByID?ImageID=${panoid}`;
        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                this.ReadPanoByIDData(json.data.GetPanoByIDResult);
            });
    }

    /**
     * 读取所有拍摄站点数据
     * @param {Object} data 
     */
    ReadPanoByIDData(data) {
        if (data) {
            if (!constants.c_StationInfo || (!constants.c_isPreviewImageLoadEnd && constants.c_StationInfo.panoID != data.ImageID)) {
                constants.c_isPreviewImageLoadEnd = true;
                constants.c_StationInfo && (constants.c_LastStopPanoID = constants.c_StationInfo.panoID); //记录上一站ID
                constants.c_StationInfo = new StationInfo(data);
                constants.sw_skyBox && constants.sw_skyBox.addThumbnail();
                if (this.floorsForBuilding) {
                    this.floorsForBuilding = false;
                    this.getAllFloorsForBuilding();
                }
                return true;
            }
        }
        return false;
    }

    /**
     * 激光点云面片数据
     * */
    getFacadeByPanoID() {

        if (constants.c_currentState != constants.c_currentStateEnum.editorStatus) { //读取本地文件
            let data = constants.sw_GetSQLData.GetFacadeByPanoIDFun(constants.c_StationInfo.panoID);
            this.ReadFacadeByPanoIDData(data);
            return;
        }

        let urls = `${this.serverURL}/GetFacadeByPanoID/?Z=${constants.c_StationInfo.nz}&PanoID=${constants.c_StationInfo.panoID}&TolerateZ=5`;
        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                this.ReadFacadeByPanoIDData(json.data.GetFacadeByPanoIDResult);
            });
    }

    /**读取墙面片数据 */
    ReadFacadeByPanoIDData(data) {

        if (data) {
            constants.c_facadeByPanoIDInfoArr.length = 0;
            data.forEach((obj) => {
                constants.c_facadeByPanoIDInfoArr.push(new FacadeByPanoIDInfo(obj));
            });
            constants.sw_wallMesh.createWallFace();
        }
    }


    /**
     * 获取老箭头方法
     * */
    getOldArrow() {

        if (constants.c_currentState != constants.c_currentStateEnum.editorStatus) { //读取本地文件

            let arrowArr;
            if (constants.c_siteRepresentation) {
                arrowArr = constants.sw_GetSQLData.GetAdjacentPanoFun(constants.c_StationInfo.panoID);
                this.ReadOldArrowData(arrowArr, 1);
            } else {
                arrowArr = constants.sw_GetSQLData.GetStreetViewLinkFun(constants.c_StationInfo.panoID);
                this.ReadOldArrowData(arrowArr, 3);
            }
            return;
        }

        let urls = `${this.serverURL}/GetAdjacentPano/?date=${Math.random() * 100}&ImageID=${constants.c_StationInfo.panoID}`;
        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                this.ReadOldArrowData(json.data.GetAdjacentPanoResult);
            });
    }

    /**读取旧箭头数据 */
    ReadOldArrowData(data, type) {
        if (data && data.length != 0) {
            constants.c_AdjacentPanoInfoArr.length = 0;
            data.forEach((obj) => {
                constants.c_AdjacentPanoInfoArr.push(new ArrowInfo(obj, type));
            });
            AddOldArrow();
        } else {
            this.getNewArrow();
        }
    }

    //获得新箭头
    getNewArrow() {

        if (constants.c_currentState != constants.c_currentStateEnum.editorStatus && constants.c_siteRepresentation) { //读取本地文件
            let arrowArr = constants.sw_GetSQLData.getLinkByPanoIDFun(constants.c_StationInfo.panoID);
            this.ReadNewArrowData(arrowArr);
            return;
        }

        let urls = `${this.musServerURL}?method=getLinkByPanoID&panoID=${constants.c_StationInfo.panoID}`;
        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                this.ReadNewArrowData(json.data.Link);
            });
    }

    /**读取新箭头数据 */
    ReadNewArrowData(data) {

        constants.c_ArrowPanoInfoArr.length = 0;
        if (data && data.length != 0) {
            data.forEach((obj) => {
                constants.c_ArrowPanoInfoArr.push(new ArrowInfo(obj, 2));
            });
            AddNewArrow();
        }
    }

    /**
     * 地面跳转
     * @param {Object} obj 传入参数 obj.type = 1 单机版 =2网络版 {obj.panoID 单机版参数 ,obj.x 3DS坐标X, obj.y 3DS坐标Y, obj.z 3DS坐标Z, obj.panoid 面片ID}
     * */
    getOtherPanoByPosition(obj) {

        if (obj.type == 1) {
            let data = constants.sw_GetSQLData.GetPanoByIDFun(obj.panoID);
            this.ReadPanoByIDData(data);
        } else {
            let urls = `${this.serverURL}/GetOtherPanoByPosition1?TolerateZ=5&Tolerate=100&Z=${obj.z}&Y=${obj.y}&ImageID=${obj.panoid}&X=${obj.x}`;
            axios.get(urls, {
                    responseType: "json"
                })
                .then(json => {
                    this.ReadPanoByIDData(json.data.GetOtherPanoByPositionResult);
                });
        }
    }

    /**
     * 墙面跳转
     * @param {Object} obj 传入参数 obj.type = 1 单机版 =2网络版 {obj.panoID 单机版参数 ,obj.x 3DS坐标X, obj.y 3DS坐标Y, obj.z 3DS坐标Z, obj.facadeid 面片ID}
     */
    getOtherPanoByFacadeID(obj) {

        if (obj.type == 1) {
            let data = constants.sw_GetSQLData.GetPanoByIDFun(obj.panoID);
            if (this.ReadPanoByIDData(data)) {
                constants.c_isWallClickRotateBoo = true;
            }

        } else {
            let urls = `${this.serverURL}/GetOtherPanoByFacadeID?facadeID=${obj.facadeid}&Z=${obj.z}&Y=${obj.y}&X=${obj.x}`;
            axios.get(urls, {
                    responseType: "json"
                })
                .then(json => {
                    if (this.ReadPanoByIDData(json.data.GetOtherPanoByFacadeIDResult)) {
                        constants.c_isWallClickRotateBoo = true;
                    }
                });
        }
    }


    /**
     * 获取标注
     * */
    getMarkerByPanoID() {

        constants.c_markerInfoArr.length = 0;
        if (constants.c_currentState != constants.c_currentStateEnum.editorStatus) { //读取本地文件
            let data = constants.sw_GetSQLData.getMarkByPanoIDFun(constants.c_StationInfo.panoID);
            this.ReadAllMarkerData(data);
            return;
        }

        let urls = `${this.musServerURL}?method=getMarkerByPanoID&panoID=${constants.c_StationInfo.panoID}`;
        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                this.ReadAllMarkerData(json.data.MarkerInfo);
            });
    }

    /**
     * 读取标注信息
     * @param {Object} data 
     */
    ReadAllMarkerData(data) {
        if (data) {
            data.forEach((obj) => {
                constants.c_markerInfoArr.push(new SWMarkerInfo(obj));
            });
        }
    }

    /**
     * 获取推荐展厅数据
     * */
    getAllThumbnailsForMuseum() {

        if (constants.c_isEditorStatus || constants.c_thumbnailsForMuseum.length > 0) {
            return;
        }

        if (constants.c_currentState != constants.c_currentStateEnum.editorStatus) { //读取本地文件
            let data = constants.sw_GetSQLData.GetAllThumbnailsForBuildingFun();
            this.ReadAllThumbnailsData(data);
            return;
        }

        let urls = `${this.musServerURL}?method=GetAllThumbnailsForBuilding&buildingID=${this.displayID}`;
        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                this.ReadAllThumbnailsData(json.data.thumbnails);
            });
    }

    /**
     * 读取所有推荐展厅
     * @param {Object} data 
     */
    ReadAllThumbnailsData(data) {
        if (data) {
            data.forEach((obj) => {
                constants.c_thumbnailsForMuseum.push(new ThumbnailsInfo(obj));
            });
        }
    }

    /**
     * 获取所有文物信息列表
     * */
    getAllExhibitsForBuilding() {

        if (constants.c_currentState != constants.c_currentStateEnum.editorStatus) { //读取本地文件

            let data = constants.sw_GetSQLData.GetAllExhibitsForBuildingFun();

            this.ReadAllExhibitsData(data);

            return;
        }

        let urls = `${this.musServerURL}?method=GetAllExhibitsForBuilding&buildingID=${this.displayID}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                this.ReadAllExhibitsData(json.data.Exhibits);

            });
    }

    /**
     * 读取所有文物信息
     * @param {Object} data 
     */
    ReadAllExhibitsData(data) {
        if (data) {

            data.forEach((obj) => {

                let allExhibits = new AllExhibitsForBuilding(obj);

                allExhibits.markerID.forEach((markerid) => { //所有标注对应说明表

                    constants.c_allExhibitsForMarkerTable.add(markerid, allExhibits);

                });

                let markerIDArr = allExhibits.markerID[0]; //显示照片墙用
                constants.c_allExhibitsForBuildingTable.add(markerIDArr, allExhibits);
            });
        }
    }

    /**
     * 获取单个文物信息
     * */
    getMultiDataByParentID(eid, type) {

        let muType = type;
        if (constants.c_currentState != constants.c_currentStateEnum.editorStatus) { //读取本地文件

            let data = constants.sw_GetSQLData.GetMultiDataByParentIDFun(eid);

            this.ReadMultiData(data, eid, muType);

            return;
        }

        let urls = `${this.musServerURL}?method=GetMultiDataByParentID&parentID=${eid}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                this.ReadMultiData(json.data.MultiDatas, eid, muType);

            });
    }

    /**读取单个热点图片 */
    ReadMultiData(data, eid, muType) {
        if (data) {
            let arr = [];

            data.forEach((obj) => {

                let multiData = new MultiDataByParentID(obj);

                let arr1 = multiData.filePath.split('/');

                multiData.PCMax = `${constants.sw_getService.resourcesUrl}/${multiData.filePath}`; //电脑版大图

                multiData.phoneMax = `${constants.sw_getService.resourcesUrl}/${arr1[0]}/${arr1[1]}/${arr1[2]}/phoneMax/${arr1[3]}`; //手机版大图

                multiData.thumbnail = `${constants.sw_getService.resourcesUrl}/${arr1[0]}/${arr1[1]}/${arr1[2]}/phone/${arr1[3]}`;

                arr.push(multiData);
            });

            constants.c_multiDataByParentIDTable.add(eid, arr);

            if (muType == 1) { //图文

                let store = initStore();

                store.dispatch(show_MarkerInterface_fun({
                    imglist: arr
                }));

            } else { //图片
                let markerImgList = [],
                    markerthumbs = [];

                arr.forEach((item) => {

                    markerImgList.push(constants.c_currentState == constants.c_currentStateEnum.phoneStatus ? item.phoneMax : item.PCMax);

                    markerthumbs.push(item.thumbnail);
                });

                let store = initStore();

                store.dispatch(show_ViewPicture_fun({
                    off: true,
                    idx: 0,
                    imageList: markerImgList,
                    thumbs: markerthumbs
                }));

            }
        }
    }

    /**
     * 获取所有视频列表
     * */
    getAllVideos() {

        if (constants.c_currentState != constants.c_currentStateEnum.editorStatus) { //读取本地文件

            let data = constants.sw_GetSQLData.getAllVideoFun();

            this.ReadAllVideosData(data);

            return;
        }

        let urls = `${this.musServerURL}?method=getAllVideos`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                this.ReadAllVideosData(json.data.videoInfo);

            });
    }

    /**
     * 读取视频文件
     * @param {Object} data 
     */
    ReadAllVideosData(data) {
        if (data) {

            data.forEach((obj) => {

                let vd = new VideosData(obj);

                let arr = [];

                if (constants.c_allVideoTable.containsKey(vd.panoID)) {

                    arr = constants.c_allVideoTable.getValue(vd.panoID);
                }

                arr.push(vd);

                constants.c_allVideoTable.add(vd.panoID, arr);
            });
        }
    }

    /**获取喜欢数 */
    GetLikesForExhibitID(exhibitid) {
        let urls = `${this.musServerURL}?method=GetLikesForExhibitID&exhibitid=${exhibitid}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.Likes) {

                    let allExhibits = constants.c_allExhibitsForBuildingTable.getValues();

                    allExhibits.forEach((item) => {

                        if (item.exhibitID == constants.c_likeToExhibitID) {

                            item.Likes = json.data.Likes;

                        }
                    });

                    let store = initStore();

                    store.dispatch(show_MarkerInterface_fun({
                        likeNum: json.data.Likes
                    }));
                }
            });
    }

    /**新增喜欢数 */
    SetLikesForExhibitID(exhibitid) {
        let urls = `${this.musServerURL}?method=SetLikesForExhibitID&exhibitid=${exhibitid}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.Likes) {

                    let allExhibits = constants.c_allExhibitsForBuildingTable.getValues();

                    allExhibits.forEach((item) => {

                        if (item.exhibitID == constants.c_likeToExhibitID) {

                            item.likes = json.data.Likes;

                        }
                    });

                    let store = initStore();

                    store.dispatch(show_MarkerInterface_fun({
                        likeNum: json.data.Likes
                    }));
                }
            });
    }

    /**新增评论 按照文物列表exhibitid*/
    AddComment(exhibitid, contents) {

        let urls = `${this.musServerURL}?method=AddComment&panoid=&uid=&exhibitid=${exhibitid}&contents=${contents}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.Message) {

                    let allExhibits = constants.c_allExhibitsForBuildingTable.getValues();

                    allExhibits.forEach((item) => {

                        if (item.exhibitID == constants.c_likeToExhibitID) {

                            item.commentNum = parseInt(json.data.Message);

                        }
                    });
                }
            });
    }

    /**查询总数 */
    SelectCommentNum(exhibitid) {
        let urls = `${this.musServerURL}?method=SelectCommentNum&panoid=&exhibitid=${exhibitid}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.Message) {

                    let allExhibits = constants.c_allExhibitsForBuildingTable.getValues();

                    allExhibits.forEach((item) => {

                        if (item.exhibitID == constants.c_likeToExhibitID) {

                            item.commentNum = parseInt(json.data.Message);

                        }
                    });
                }
            });
    }

    /**查询最新评论20条 */
    GetNewestComment(exhibitid) {
        let urls = `${this.musServerURL}?method=GetNewestComment&panoid=&exhibitid=${exhibitid}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.Message) {

                    // let commentTable = new HashTable();

                    // let exhibitID = "";

                    // json.data.Message.forEach((obj, idx) => {

                    //     let swComment = new SWExhibitComment(obj);

                    //     exhibitID = swComment.exhibitID;

                    //     commentTable.add(swComment.gUID, swComment);
                    // });

                    // let allExhibits = constants.c_allExhibitsForBuildingTable.getValues();

                    // allExhibits.forEach((item) => {

                    //     if (item.exhibitID == exhibitID) {

                    //         item.commentTable = commentTable;
                    //     }
                    // });

                    let store = initStore();

                    store.dispatch(show_MarkerInterface_fun({
                        commentList: json.data.Message
                    }));
                }
            });
    }

    /**分页查询，每次50条 */
    GetAllComment() {

    }

}
export default ServerData;