/* global THREE,$*/

import {
    disposeNode,
    TextDiv,
    getWorldToScene,
    delectTextDiv
} from '../../tool/SWTool'
import SWTextureAnimator from '../../tool/SWTextureAnimator';
import initStore from '../../../views/redux/store/store';
import {
    show_Iframe_fun,
    show_VideoBox_fun,
    show_MarkerInterface_fun,
    show_ViewPicture_fun
} from '../../../views/redux/action';
import {
    jumpSite
} from '../../tool/SWInitializeInstance';
import * as constants from '../../tool/SWConstants';

/**
 * 全景除了底层盒子、UI 都是标注
 * 这是所有标注的父类
 */
class SWMarkerModule {
    /**
     * 
     * @param {String} url 图片链接地址
     * @param {Number} type 1-静态 2-动态 
     * @param {Object} obj {fpsNum:帧数，wPlane:宽，hPlane：高}
     */
    constructor(url, type, obj) {

        this.markerType = type;

        this.mouseDownBoo = false;

        this.startPoint = new THREE.Vector2();

        if (url) {
            this.texture = new THREE.ImageUtils.loadTexture(url);
        }

        if (obj) {
            this.textureAnimator = new SWTextureAnimator(this.texture, obj.fpsNum, 1, obj.fpsNum, 100);

            this.geometry = new THREE.PlaneGeometry(obj.wPlane, obj.hPlane, 1, 1);

            this.material = new THREE.MeshBasicMaterial({
                map: this.texture,
                side: 2,
                transparent: true,
                opacity: 1
            });

        } else {

            this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

            this.material = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF
            });

        }

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.textDiv = new TextDiv(new THREE.Vector3(0, 0, 0));

        this.textDiv.id = "markerArrowMesh";

        this.textDiv.style.fontFamily = "Arial";

        this.textDiv.style.display = "none";

        this.textDiv.style.padding = "4px";

        this.textDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

        this.textDiv.style.letterSpacing = "2px";

        this.textDiv.style.border = "1px solid rgba(255, 255, 255, 0.5)";

        this.textDiv.style.borderRadius = "5px";
    }

    /**
     * 添加鼠标事件
     */
    addMouseEvent() {

        this.mesh.mouseDown = (e, obj) => {

            this.mouseDownBoo = true;

            this.startPoint.x = e.clientX;

            this.startPoint.y = e.clientY;
        }

        this.mesh.mouseUp = (e, obj) => {

            if (this.mouseDownBoo) {

                this.hideTextDiv();

                let v3 = new THREE.Vector2(e.clientX, e.clientY);

                let boo = v3.equals(this.startPoint);

                this.mouseDownBoo = false;

                if (boo) {
                    let store = initStore();
                    let url;
                    switch (this.markerObj.type) { //点击弹出的表现形式 1-图文 2-图片 3-三维 4-视频 44-手机版嵌入视频 5-书籍 6-音频 7-环拍 999-跳站点
                        case 1:
                        case 2:
                            if (constants.c_allExhibitsForMarkerTable.containsKey(obj.object.userData.markerID)) {

                                let item = constants.c_allExhibitsForMarkerTable.getValue(obj.object.userData.markerID);

                                if (!constants.c_multiDataByParentIDTable.containsKey(item.exhibitID)) {

                                    if (this.markerObj.type == 1) {

                                        this.showMarkerUI(item, []);

                                    }

                                    constants.sw_getService.getMultiDataByParentID(item.exhibitID, this.markerObj.type);

                                } else {

                                    let imageArr = constants.c_multiDataByParentIDTable.getValue(item.exhibitID);

                                    if (this.markerObj.type == 1) {

                                        this.showMarkerUI(item, imageArr);

                                    } else {

                                        let markerImgList = [],
                                            markerthumbs = [];

                                        imageArr.forEach((item) => {

                                            markerImgList.push(constants.c_currentState == constants.c_currentStateEnum.phoneStatus ? item.phoneMax : item.PCMax);

                                            markerthumbs.push(item.thumbnail);
                                        });
                                        store.dispatch(show_ViewPicture_fun({
                                            off: true,
                                            idx: 0,
                                            imageList: markerImgList,
                                            thumbs: markerthumbs
                                        }));
                                    }
                                }
                            }
                            break;
                        case 3:
                            url = `${constants.sw_getService.resourcesUrl}/BusinessData/ExhibitDetails/3DModel/${this.markerObj.markerID}.html`;
                            this.showIframeFun(store, url, this.markerObj.name);
                            break;
                        case 4:
                        case 44:
                            store.dispatch(show_VideoBox_fun({
                                off: true,
                                videoUrl: this.markerObj.name
                            }));
                            break;
                        case 5:
                            let item = constants.c_allExhibitsForMarkerTable.getValue(this.markerObj.markerID);
                            url = `${constants.sw_getService.resourcesUrl}/BusinessData/ExhibitDetails/Book/${this.markerObj.markerID}/index.html#page/${item.displayPriority}`;
                            this.showIframeFun(store, url, this.markerObj.name, 1);
                            break;
                        case 6:
                            break;
                        case 7:
                            url = `${constants.sw_getService.resourcesUrl}/BusinessData/ExhibitDetails/Ring/${this.markerObj.markerID}.html`;
                            this.showIframeFun(store, url, this.markerObj.name);
                            break;
                        case 999:
                            jumpSite(this.markerObj.name);
                            break;
                    }
                }
            }
        }

        //鼠标进入
        this.mesh.mouseOver = (e, obj) => {

            this.showTextDiv(obj, this.markerObj.name);

        }

        //出去
        this.mesh.mouseOut = (e, obj) => {

            this.hideTextDiv();

        }

    }

    /**弹出iframe框或者跳出网页 */
    showIframeFun(store, url, names, type) {

        if (constants.c_LowendMachine) {

            let docURL = document.URL.indexOf("?") != -1 ? document.URL.split('?')[0] : document.URL;
            let str = type ? '#' : '';
            let newUrl = `${url}${str}?Source=${docURL}&PanoID=${constants.c_StationInfo.panoID}&dYaw=${constants.sw_cameraManage.yaw_Camera}&dPitch=${constants.sw_cameraManage.picth_Camera}`;

            if (constants.c_weixinQQWeibo) {
                window.open(newUrl);
            } else {
                window.location.href = newUrl;
            }

        } else {

            store.dispatch(show_Iframe_fun({
                iframeOff: true,
                iframeUrl: url,
                iframeName: names
            }));
        }
    }

    /**显示标注UI界面 */
    showMarkerUI(item, imageArr) {
        let store = initStore();
        store.dispatch(show_MarkerInterface_fun({
            off: true,
            exhibitID: item.exhibitID,
            imglist: imageArr,
            title: item.name,
            content: item.description,
            d3: item.featuresList[0],
            video: item.featuresList[1],
            audio: item.featuresList[2],
            book: item.featuresList[3],
            links: item.featuresList[4],
            likeNum: item.likes
        }));
        constants.c_likeToExhibitID = item.exhibitID;
        constants.sw_getService.GetLikesForExhibitID(item.exhibitID); //获取点赞数
        constants.sw_getService.GetNewestComment(item.exhibitID); //获取最新20条评论
    }

    /**
     * 不停的更新动画
     * @param {Number} delta 补帧时间
     */
    update(delta) {
        if (this.textureAnimator && this.markerType == 2) {

            this.textureAnimator.update(1000 * delta);

        }
    }

    /**
     * 显示标注文本说明
     * @param {Object} obj 射线返回对象
     * @param {String} str 显示文本
     */
    showTextDiv(obj, str) {
        if (str && str != "") {

            this.textDiv.style.display = "block";

            var labelPos = getWorldToScene(obj.point);

            this.textDiv.style.left = labelPos.x + "px";

            this.textDiv.style.top = (labelPos.y - 40) + "px";

            this.textDiv.innerHTML = str;

        }
    }


    /**隐藏标注说明文本 */
    hideTextDiv() {

        this.textDiv.style.display = "none";

    }

    /**清空对象 */
    clear() {

        this.textureAnimator = null;

        delectTextDiv(this.textDiv);

        disposeNode(this.mesh);
    }
}

export default SWMarkerModule;