import * as constants from '../tool/SWConstants';
import HashTable from '../tool/SWHashTable';
const external = require('../tool/SWExternalConst.js');
const axios = require('axios');

class SWGetSQLData {
    constructor() {
        /**所有文物列表 */
        this.GetAllExhibitsForBuilding;
        /**所有楼层列表 */
        this.GetAllFloorsForBuilding;
        /**推荐展厅列表 */
        this.GetAllThumbnailsForBuilding;
        /**视频列表 */
        this.getAllVideo;
        /**站点对应墙面片集合 */
        this.GetFacadeByPanoIDTable = new HashTable();
        /**所有面片集合 */
        this.facadeIDTable = new HashTable();
        /**标注集合 */
        this.getMarkByPanoIDTable = new HashTable();
        /**标注对应图片集合 */
        this.GetMultiDataByParentIDTable = new HashTable();
        /**所有采集站点位置集合 */
        this.GetPanoByIDTable = new HashTable();
        /**新调整箭头集合 */
        this.getLinkByPanoIDTable = new HashTable();
        /**老箭头数据集合 */
        this.GetAdjacentPanoTable = new HashTable();
        /**连接点位关系 */
        this.GetStreetViewLinkTable = new HashTable();

        axios.all(this.getInfo())
            .then(axios.spread(function (GetPanoByID,
                GetAllFloorsForBuilding,
                HD_STREETVIEW_LINK,
                GetAdjacentPano,
                GetAllExhibitsForBuilding,
                GetAllThumbnailsForBuilding,
                getAllVideo,
                GetFacadeByPanoID,
                getLinkByPanoID,
                getMarkByPanoID,
                GetMultiDataByParentID) {
                // 请求现在都执行完成

                if (GetPanoByID.data) {
                    for (let obj in GetPanoByID.data) {
                        let panoObj = GetPanoByID.data[obj];
                        for (let panoid in panoObj) {
                            constants.sw_GetSQLData.GetPanoByIDTable.add(panoid, panoObj[panoid]);
                        }
                    }
                }

                if (GetAllFloorsForBuilding.data) {
                    constants.sw_GetSQLData.GetAllFloorsForBuilding = GetAllFloorsForBuilding.data;
                }

                if (HD_STREETVIEW_LINK.data) {
                    let floorArrowObj = HD_STREETVIEW_LINK.data["RECORDS"];
                    floorArrowObj.forEach((obj, idx) => {
                        var arrSLINK = [];
                        if (constants.sw_GetSQLData.GetStreetViewLinkTable.containsKey(obj.SrcImageName)) {
                            arrSLINK = constants.sw_GetSQLData.GetStreetViewLinkTable.getValue(obj.SrcImageName);
                            arrSLINK.push(obj);
                        } else {
                            arrSLINK.push(obj);
                        }
                        constants.sw_GetSQLData.GetStreetViewLinkTable.add(obj.SrcImageName, arrSLINK);
                    });
                }

                if (GetAdjacentPano.data) {
                    for (let obj in GetAdjacentPano.data) {
                        let floorArrowObj = GetAdjacentPano.data[obj];
                        for (let panoid in floorArrowObj) {
                            constants.sw_GetSQLData.GetAdjacentPanoTable.add(panoid, floorArrowObj[panoid]);
                        }
                    }
                }

                if (GetAllExhibitsForBuilding.data) {
                    constants.sw_GetSQLData.GetAllExhibitsForBuilding = GetAllExhibitsForBuilding.data;
                }

                if (GetAllThumbnailsForBuilding.data) {
                    constants.sw_GetSQLData.GetAllThumbnailsForBuilding = GetAllThumbnailsForBuilding.data;
                }

                if (getAllVideo.data) {
                    constants.sw_GetSQLData.getAllVideo = getAllVideo.data;
                }

                if (GetFacadeByPanoID.data) {
                    for (let obj in GetFacadeByPanoID.data) {
                        let facadeObj = GetFacadeByPanoID.data[obj];
                        for (let panoid in facadeObj) {
                            let arr = facadeObj[panoid];
                            constants.sw_GetSQLData.GetFacadeByPanoIDTable.add(panoid, arr);
                            if (arr) {
                                arr.forEach((face, idx) => {
                                    let panoArr = [];
                                    if (constants.sw_GetSQLData.facadeIDTable.containsKey(face.FacadeID)) {
                                        panoArr = constants.sw_GetSQLData.facadeIDTable.getValue(face.FacadeID);
                                    }
                                    panoArr.push(panoid);
                                    constants.sw_GetSQLData.facadeIDTable.add(face.FacadeID, panoArr);
                                });
                            }
                        }
                    }
                }

                if (getLinkByPanoID.data) {
                    for (let obj in getLinkByPanoID.data) {
                        let floorArrowObj = getLinkByPanoID.data[obj];
                        for (let panoid in floorArrowObj) {
                            constants.sw_GetSQLData.getLinkByPanoIDTable.add(panoid, floorArrowObj[panoid]);
                        }
                    }
                }

                if (getMarkByPanoID.data) {
                    for (let obj in getMarkByPanoID.data) {
                        let markerObj = getMarkByPanoID.data[obj];
                        for (let panoid in markerObj) {
                            constants.sw_GetSQLData.getMarkByPanoIDTable.add(panoid, markerObj[panoid]);
                        }
                    }
                }

                if (GetMultiDataByParentID.data) {
                    for (let obj in GetMultiDataByParentID.data) {
                        constants.sw_GetSQLData.GetMultiDataByParentIDTable.add(obj, GetMultiDataByParentID.data[obj]);
                    }
                }
                console.log('====================================');
                console.log("加载完毕啦~~~~~~~~~~~~~");
                console.log('====================================');
                constants.sw_getService.getConfig();
            }));
    }

    getInfo() {
        return [axios.get(`${external.server_json.dataUrl}GetPanoByID.json`), //所有采集站点位置集合
            axios.get(`${external.server_json.dataUrl}GetAllFloorsForBuilding.json`), //所有楼层列表
            axios.get(`${external.server_json.dataUrl}HD_STREETVIEW_LINK.json`), //连接点位关系
            axios.get(`${external.server_json.dataUrl}GetAdjacentPano.json`), //老箭头数据集合
            axios.get(`${external.server_json.dataUrl}GetAllExhibitsForBuilding.json`), //所有文物列表
            axios.get(`${external.server_json.dataUrl}GetAllThumbnailsForBuilding.json`), //推荐展厅列表
            axios.get(`${external.server_json.dataUrl}getAllVideo.json`), //视频列表
            axios.get(`${external.server_json.dataUrl}GetFacadeByPanoID.json`), //站点对应墙面片集合
            axios.get(`${external.server_json.dataUrl}getLinkByPanoID.json`), //新调整箭头集合
            axios.get(`${external.server_json.dataUrl}getMarkByPanoID.json`), //标注集合 
            axios.get(`${external.server_json.dataUrl}GetMultiDataByParentID.json`) //标注对应图片集合
        ];
    }

    GetStreetViewLinkFun(panoID) {
        if (this.GetStreetViewLinkTable.containsKey(panoID)) {
            return this.GetStreetViewLinkTable.getValue(panoID);
        }
        return [];
    }

    /**老箭头数据集合 */
    GetAdjacentPanoFun(panoID) {
        if (this.GetAdjacentPanoTable.containsKey(panoID)) {
            return this.GetAdjacentPanoTable.getValue(panoID);
        }
        return [];
    }

    /**所有文物集合 */
    GetAllExhibitsForBuildingFun() {
        return this.GetAllExhibitsForBuilding;
    }

    /**所有楼层集合 */
    GetAllFloorsForBuildingFun() {
        return this.GetAllFloorsForBuilding;
    }

    /**推荐展厅集合 */
    GetAllThumbnailsForBuildingFun() {
        return this.GetAllThumbnailsForBuilding;
    }

    /**嵌入视频集合 */
    getAllVideoFun() {
        return this.getAllVideo;
    }

    /**站点对应墙面片集合 */
    GetFacadeByPanoIDFun(panoID) {

        if (this.GetFacadeByPanoIDTable.containsKey(panoID)) {
            return this.GetFacadeByPanoIDTable.getValue(panoID);
        }
        return [];
    }

    /**新调整箭头集合 */
    getLinkByPanoIDFun(panoID) {
        if (this.getLinkByPanoIDTable.containsKey(panoID)) {
            return this.getLinkByPanoIDTable.getValue(panoID);
        }
        return [];
    }

    /**标注集合 */
    getMarkByPanoIDFun(panoID) {
        if (this.getMarkByPanoIDTable.containsKey(panoID)) {
            return this.getMarkByPanoIDTable.getValue(panoID);
        }
        return [];
    }

    /**标注对应图片集合 */
    GetMultiDataByParentIDFun(eid) {
        if (this.GetMultiDataByParentIDTable.containsKey(eid)) {
            return this.GetMultiDataByParentIDTable.getValue(eid);
        }
        return [];
    }

    /**所有采集站点位置集合 */
    GetPanoByIDFun(panoID) {
        if (this.GetPanoByIDTable.containsKey(panoID)) {
            return this.GetPanoByIDTable.getValue(panoID);
        }
        return [];
    }



}
export default SWGetSQLData;