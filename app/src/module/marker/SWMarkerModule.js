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

        this.textDiv = new TextDiv(new THREE.Vector3(0, 0, 0), 12, "");
        this.textDiv.id = "markerMesh";
        this.textDiv.style.display = "none";
        this.textDiv.style.color = "#FFF";
        this.textDiv.style.borderRadius = "3px";
        this.textDiv.style.backgroundColor = "rgba(16, 16, 16, 0.3)";
        this.textDiv.style.padding = "3px 10px";
        this.textDiv.style.letterSpacing = "2px";
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

                let v3 = new THREE.Vector2(e.clientX, e.clientY);

                let boo = v3.equals(this.startPoint);

                this.mouseDownBoo = false;

                if (boo) {
                    let store = initStore();
                    let url;
                    switch (this.markerObj.type) { //点击弹出的表现形式 1-图文 2-图片 3-三维 4-视频 5-书籍 6-音频 7-环拍 999-跳站点
                        case 1:
                        case 2:
                            let allExhibits = constants.c_allExhibitsForBuildingTable.getValues();

                            allExhibits.forEach((item) => {

                                if (item.markerID.indexOf(obj.object.userData.markerID) != -1) {

                                    if (!constants.c_multiDataByParentIDTable.containsKey(item.exhibitID)) {

                                        if (this.markerObj.type == 1) {
                                            store.dispatch(show_MarkerInterface_fun({
                                                off: true,
                                                exhibitID:item.exhibitID,
                                                title: item.name,
                                                content: item.description,
                                                d3: item.sceneID[0],
                                                video: item.sceneID[1],
                                                audio: item.sceneID[2],
                                                book: item.sceneID[3]
                                            }));
                                        }

                                        constants.sw_getService.getMultiDataByParentID(item.exhibitID, this.markerObj.type);

                                    } else {

                                        let imageArr = constants.c_multiDataByParentIDTable.getValue(item.exhibitID);

                                        if (this.markerObj.type == 1) {
                                            store.dispatch(show_MarkerInterface_fun({
                                                off: true,
                                                exhibitID:item.exhibitID,
                                                imglist: imageArr,
                                                title: item.name,
                                                content: item.description,
                                                links: "https://www.baidu.com",
                                                d3: item.sceneID[0],
                                                video: item.sceneID[1],
                                                audio: item.sceneID[2],
                                                book: item.sceneID[3]
                                            }));

                                        } else {

                                            let markerImgList = [],
                                                markerthumbs = [];

                                            imageArr.forEach((item) => {
                                                let imgUrl = `${constants.sw_getService.resourcesUrl}/${item.filePath}`;

                                                let arr1 = item.filePath.split('/');

                                                let pp = `${constants.sw_getService.resourcesUrl}/${arr1[0]}/${arr1[1]}/${arr1[2]}/phone/${arr1[3]}`;

                                                markerImgList.push(imgUrl);

                                                markerthumbs.push(pp);
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
                            });
                            break;
                        case 3:
                            url = constants.sw_getService.resourcesUrl + "/BusinessData/ExhibitDetails/3DModel/" + this.markerObj.markerID + ".html";

                            store.dispatch(show_Iframe_fun({
                                iframeOff: true,
                                iframeUrl: url
                            }));
                            break;
                        case 4:
                            store.dispatch(show_VideoBox_fun({
                                off: true,
                                videoUrl: this.markerObj.name
                            }));
                            break;
                        case 5:
                            url = constants.sw_getService.resourcesUrl + "/BusinessData/ExhibitDetails/Book/" + this.markerObj.markerID + "/index.html";

                            store.dispatch(show_Iframe_fun({
                                iframeOff: true,
                                iframeUrl: url
                            }));
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

            this.textDiv.style.left = (labelPos.x - 30) + "px";

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