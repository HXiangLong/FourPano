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
import SWExhibitComment from '../data/SWExhibitComment';
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
import HashTable from '../tool/SWHashTable';
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
    }

    /**
     * 获得所有楼层站点信息
     */
    getAllFloorsForBuilding() {

        let urls = `${this.musServerURL}?method=GetAllFloorsForBuilding&buildingID=${this.displayID }&random=${Math.random() * 10}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                if (json.data.Floors) {

                    json.data.Floors.forEach((obj) => {

                        new FloorsInfo(obj);

                    });

                    //数据来之后可以显示小地图
                    let store = initStore();

                    store.dispatch(show_PanoMap_fun({
                        off: true
                    }));
                }

                this.getAllThumbnailsForMuseum();
                this.getAllExhibitsForBuilding();
                this.getAllVideos();
            });
    }

    /**
     * 获得当前站点信息
     * @param {String} panoid 站点ID
     */
    getPanoByID(panoid) {

        let urls = `${this.serverURL}/GetPanoByID?ImageID=${panoid}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                if (json.data.GetPanoByIDResult) {

                    if (!constants.c_StationInfo || (constants.c_isPreviewImageLoadEnd && constants.c_StationInfo.panoID != json.data.GetPanoByIDResult.ImageID)) {

                        constants.c_isPreviewImageLoadEnd = false;

                        constants.c_StationInfo && (constants.c_LastStopPanoID = constants.c_StationInfo.panoID); //记录上一站ID

                        constants.c_StationInfo = new StationInfo(json.data.GetPanoByIDResult);

                        constants.sw_skyBox.addThumbnail();

                        if (this.floorsForBuilding) {

                            this.floorsForBuilding = false;

                            this.getAllFloorsForBuilding();
                        }
                    }
                }
            });
    }

    /**
     * 激光点云面片数据
     * */
    getFacadeByPanoID() {

        let urls = `${this.serverURL}/GetFacadeByPanoID/?Z=${constants.c_StationInfo.nz}&PanoID=${constants.c_StationInfo.panoID}&TolerateZ=5`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.GetFacadeByPanoIDResult) {

                    constants.c_facadeByPanoIDInfoArr.length = 0;

                    json.data.GetFacadeByPanoIDResult.forEach((obj) => {

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

        let urls = `${this.serverURL}/GetAdjacentPano/?date=${Math.random() * 100}&ImageID=${constants.c_StationInfo.panoID}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {
                if (json.data.GetAdjacentPanoResult) {

                    constants.c_AdjacentPanoInfoArr.length = 0;

                    json.data.GetAdjacentPanoResult.forEach((obj) => {

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

        let urls = `${this.musServerURL}?method=getLinkByPanoID&panoID=${constants.c_StationInfo.panoID}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                constants.c_ArrowPanoInfoArr.length = 0;

                if (json.data.Link) {

                    json.data.Link.forEach((obj) => {

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

        let urls = `${this.serverURL}/GetOtherPanoByPosition1?TolerateZ=5&Tolerate=100&Z=${z}&Y=${y}&ImageID=${panoid}&X=${x}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.GetOtherPanoByPositionResult) {

                    if (constants.c_isPreviewImageLoadEnd && constants.c_StationInfo.panoID != json.data.GetOtherPanoByPositionResult.ImageID) {

                        constants.c_isPreviewImageLoadEnd = false;

                        constants.c_StationInfo && (constants.c_LastStopPanoID = constants.c_StationInfo.panoID); //记录上一站ID

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

        let urls = `${this.serverURL}/GetOtherPanoByFacadeID?facadeID=${facadeid}&Z=${z}&Y=${y}&X=${x}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.GetOtherPanoByFacadeIDResult) {

                    if (constants.c_isPreviewImageLoadEnd && constants.c_StationInfo.panoID != json.data.GetOtherPanoByFacadeIDResult.ImageID) {

                        constants.c_isPreviewImageLoadEnd = false;

                        constants.c_isWallClickRotateBoo = true;

                        constants.c_StationInfo && (constants.c_LastStopPanoID = constants.c_StationInfo.panoID); //记录上一站ID

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

        let urls = `${this.musServerURL}?method=getMarkerByPanoID&panoID=${constants.c_StationInfo.panoID}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.MarkerInfo) {

                    json.data.MarkerInfo.forEach((obj) => {

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
        let urls = `${this.musServerURL}?method=GetAllThumbnailsForBuilding&buildingID=${this.displayID}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.thumbnails) {

                    json.data.thumbnails.forEach((obj) => {

                        constants.c_thumbnailsForMuseum.push(new ThumbnailsInfo(obj));

                    });

                    if (constants.c_thumbnailsShow) {
                        //数据来之后可以弹出展厅列表
                        let store = initStore();

                        store.dispatch(show_Thumbnails_fun(true));
                    }
                }
            });
    }

    /**
     * 获取所有文物信息列表
     * */
    getAllExhibitsForBuilding() {
        let urls = `${this.musServerURL}?method=GetAllExhibitsForBuilding&buildingID=${this.displayID}`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.Exhibits) {

                    json.data.Exhibits.forEach((obj) => {

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
    getMultiDataByParentID(eid, type) {
        let urls = `${this.musServerURL}?method=GetMultiDataByParentID&parentID=${eid}`;
        let muType = type;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.MultiDatas) {

                    let arr = [];

                    json.data.MultiDatas.forEach((obj) => {

                        let multiData = new MultiDataByParentID(obj);

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
                            let imgUrl = `${this.resourcesUrl}/${item.filePath}`;

                            let arr1 = item.filePath.split('/');

                            let pp = `${this.resourcesUrl}/${arr1[0]}/${arr1[1]}/${arr1[2]}/phone/${arr1[3]}`;

                            markerImgList.push(imgUrl);

                            markerthumbs.push(pp);
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
            });
    }

    /**
     * 获取所有视频列表
     * */
    getAllVideos() {
        let urls = `${this.musServerURL}?method=getAllVideos`;

        axios.get(urls, {
                responseType: "json"
            })
            .then(json => {

                if (json.data.videoInfo) {

                    json.data.videoInfo.forEach((obj) => {

                        let vd = new VideosData(obj);

                        constants.c_allVideoTable.add(vd.videoName, vd);
                    });
                }
            });
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