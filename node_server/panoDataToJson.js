const axios = require("axios");
const ffs = require("fs-extra");
const path = require("path");
const winston = require("winston");

const api = "http://192.168.10.63:8090/GZXHGM/DigitalMusService/";
const api2 = "http://192.168.10.63:8090/GZXHGM/DigitalMusBaseServices/";

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: "info",
            filename: path.resolve(__dirname, "./log.log"),
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: true
        })
    ]
});

function GetAllFloorsForBuilding() {
    return axios.get(
        `${api}Services.aspx?method=GetAllFloorsForBuilding&buildingID=5101-0010-0001&random=4.51736333816128`
    );
}
function GetPanoByID(panoID) {
    return axios.get(`${api2}GetPanoByID?ImageID=${panoID}`);
}
function GetFacadeByPanoID(panoID) {
    return axios.get(
        `${api2}GetFacadeByPanoID/?Z=-6.463313&PanoID=${panoID}&TolerateZ=5`
    );
}
function GetAdjacentPano(panoID) {
    return axios.get(
        `${api2}GetAdjacentPano/?date=24.739729530596666&ImageID=${panoID}`
    );
}
function GetLinkByByPano(panoID) {
    return axios.get(
        `${api}Services.aspx?method=getLinkByPanoID&panoID=${panoID}`
    );
}
function GetMarkerByPanoID(panoID) {
    return axios.get(
        `${api}Services.aspx?method=getMarkerByPanoID&panoID=${panoID}`
    );
}
function GetAllThumbnailsForBuilding() {
    return axios.get(
        `${api}Services.aspx?method=GetAllThumbnailsForBuilding&buildingID=5101-0010-0001 `
    );
}

function GetAllExhibitsForBuilding() {
    return axios.get(`
    ${api}Services.aspx?method=GetAllExhibitsForBuilding&buildingID=5101-0010-0001 `);
}
function GetMultiDataByParentID(parentID) {
    return axios.get(`
    ${api}Services.aspx?method=GetMultiDataByParentID&parentID=${parentID}
    `);
}
function getAllVideo() {
    return axios.get(`${api}Services.aspx?method=getAllVideos `);
}
/**
 * 入口函数
 */
async function main() {
    const res = await GetAllFloorsForBuilding();
    writeToJSON(
        "../app/commons/json",
        "GetAllFloorsForBuilding.json",
        res.data
    );
    getAllPanoDataFromFloors(res.data.Floors);
}
/**
 *
 * @param {string} 要写入的文件路径
 * @param {string} 要写入的文件名
 * @param {string} 要写入的JSON数据
 */
async function writeToJSON(filePath, fileName, json) {
    await ffs.ensureDir(path.resolve(__dirname, filePath));
    await ffs.writeJSON(path.resolve(__dirname, filePath, fileName), json, {
        replacer: null,
        spaces: 4
    });
}

/**
 * 根据楼层数据获取其他数据
 * @param {Array} 楼层数据
 */
async function getAllPanoDataFromFloors(Floors) {
    const GetPanoByID = {};
    const GetFacadeByPanoID = {};
    const GetAdjacentPano = {};
    const getLinkByPanoID = {};
    const getMarkByPanoID = {};
    for (const value of Floors) {
        const panosData = await buildPanosFromPanoID(
            value.RasterMapMarkers,
            value.Description
        );
        console.log(`${value.Description}的站点数据获取完毕`);
        const facadeData = await buildFacadeFromPanoID(
            value.RasterMapMarkers,
            value.Description
        );
        console.log(`${value.Description}的面片数据获取完毕`);
        const adjacentData = await buildAdjacentFromPanoID(
            value.RasterMapMarkers,
            value.Description
        );
        console.log(`${value.Description}的箭头数据获取完毕`);
        const linkData = await buildLinkFromPanoID(
            value.RasterMapMarkers,
            value.Description
        );
        console.log(`${value.Description}的调整后箭头数据获取完毕`);
        const markData = await buildMarkFromPanoID(
            value.RasterMapMarkers,
            value.Description
        );
        console.log(`${value.Description}的调标注数据获取完毕`);

        GetPanoByID[value.FloorID] = panosData;
        GetFacadeByPanoID[value.FloorID] = facadeData;
        GetAdjacentPano[value.FloorID] = adjacentData;
        getLinkByPanoID[value.FloorID] = linkData;
        getMarkByPanoID[value.FloorID] = markData;
    }

    const thumbnailsData = await buildAllThumbnails();
    console.log("展厅数据获取完毕");

    const exhibitsData = await buildAllExhibits();
    console.log("文物墙数据获取完毕");

    const multiData = await buildMultiDataFromParentID(exhibitsData);
    console.log("图片列表数据获取完毕 ");

    const allVideoData = await buildAllVideo();
    console.log("视频列表获取完毕");

    writeToJSON("../app/commons/json", "GetPanoByID.json", GetPanoByID);
    writeToJSON("../app/commons/json", "GetFacadeByPanoID.json", GetFacadeByPanoID);
    writeToJSON("../app/commons/json", "GetAdjacentPano.json", GetAdjacentPano);
    writeToJSON("../app/commons/json", "getLinkByPanoID.json", getLinkByPanoID);
    writeToJSON("../app/commons/json", "getMarkByPanoID.json", getMarkByPanoID);
    writeToJSON("../app/commons/json", "GetAllThumbnailsForBuilding.json", thumbnailsData);
    writeToJSON("../app/commons/json", "GetAllExhibitsForBuilding.json", exhibitsData);
    writeToJSON("../app/commons/json", "GetMultiDataByParentID.json", multiData);
    writeToJSON("../app/commons/json", "getAllVideo.json", allVideoData);
}

/**
 * 获取站点数据
 * @param {array} panoIDS
 */
async function buildPanosFromPanoID(panoIDS, Description) {
    console.log(`正在获取${Description}pano数据`);
    const promiseList = panoIDS.map(panoID => GetPanoByID(panoID.PanoID));
    let panosData = [];
    try {
        panosData = await Promise.all(promiseList);
    } catch (error) {
        logger.info(error.response);
    }
    const data = {};
    panosData.forEach(res => {
        data[res.data.GetPanoByIDResult.ImageID] = res.data.GetPanoByIDResult;
    });
    return data;
}
/**
 * 根据站点ID获取面片数据
 * @param {array} panoIDS
 */
async function buildFacadeFromPanoID(panoIDS, Description) {
    console.log(`正在获取${Description}墙面片数据`);
    const data = {};
    for (const panoID of panoIDS) {
        let Facade;
        try {
            Facade = await GetFacadeByPanoID(panoID.PanoID);
        } catch (error) {
            logger.info(error.response);
        }

        data[panoID.PanoID] = Facade.data.GetFacadeByPanoIDResult
            ? Facade.data.GetFacadeByPanoIDResult
            : null;
    }
    return data;
}
/**
 * 根据站点ID获取箭头数据
 * @param {array} panoIDS
 */
async function buildAdjacentFromPanoID(panoIDS, Description) {
    console.log(`正在获取${Description}箭头数据`);
    const data = {};
    for (const panoID of panoIDS) {
        let Adjacent;
        try {
            Adjacent = await GetAdjacentPano(panoID.PanoID);
        } catch (error) {
            logger.info(error.response);
        }

        data[panoID.PanoID] = Adjacent.data.GetAdjacentPanoResult
            ? Adjacent.data.GetAdjacentPanoResult
            : null;
    }
    return data;
}
/**
 * 根据站点ID获取调整后的箭头数据
 * @param {array} panoIDS
 */
async function buildLinkFromPanoID(panoIDS, Description) {
    console.log(`正在获取${Description}调整箭头的数据`);
    const data = {};
    for (const panoID of panoIDS) {
        let Link;
        try {
            Link = await GetLinkByByPano(panoID.PanoID);
        } catch (error) {
            logger.info(error.response);
        }

        data[panoID.PanoID] = Link.data.Link ? Link.data.Link : null;
    }
    return data;
}
async function buildMarkFromPanoID(panoIDS, Description) {
    console.log(`正在获取${Description}标注的数据`);
    const data = {};
    for (const panoID of panoIDS) {
        let Mark;
        try {
            Mark = await GetMarkerByPanoID(panoID.PanoID);
        } catch (error) {
            logger.info(error.response);
        }

        data[panoID.PanoID] = Mark.data.MarkerInfo;
    }
    return data;
}

async function buildAllThumbnails() {
    console.log(`正在获取展厅数据`);
    let Thumbnails;
    try {
        Thumbnails = await GetAllThumbnailsForBuilding();
    } catch (error) {
        logger.info(error.response);
    }

    return Thumbnails.data.thumbnails;
}

async function buildAllExhibits() {
    console.log("正在获取文物墙的数据");
    let data;
    try {
        data = await GetAllExhibitsForBuilding();
    } catch (error) {
        logger.info(error.response);
    }
    return data.data.Exhibits;
}

async function buildMultiDataFromParentID(Exhibits) {
    console.log("正在获取图片列表");
    const data = {};
    for (const exhibit of Exhibits) {
        let Multi;
        try {
            Multi = await GetMultiDataByParentID(exhibit.ExhibitID);
        } catch (error) {
            logger.info(error.response);
        }

        data[exhibit.ExhibitID] = Multi.data.MultiDatas;
    }
    return data;
}

async function buildAllVideo() {
    console.log("正在获取视频列表");
    let videoInfo;
    try {
        videoInfo = await getAllVideo();
    } catch (error) {
        logger.info(error.response);
    }

    return videoInfo.data.videoInfo;
}
main();
