/* global THREE,$*/

/**所有共用方法 */

import * as constants from './SWConstants';
import SWViewGesture from './SWViewGesture';
import SWMarkerArrowModule from '../module/marker/SWMarkerArrowModule';

/**
 * 屏幕坐标转世界坐标
 * @param {number} dx 鼠标X坐标
 * @param {number} dy 鼠标Y坐标
 */
export function getSceneToWorld(dx, dy) {

    let mouse3D = new THREE.Vector3(dx / window.innerWidth * 2 - 1, -dy / window.innerHeight * 2 + 1, 0.5);

    mouse3D.project(constants.camera);

    return mouse3D;

};

/**
 * 世界坐标转屏幕坐标
 * @param {THREE.Vector3} v3 世界坐标
 */
export function getWorldToScene(v3) {

    let vector = v3.clone();

    let windowWidth = window.innerWidth;

    let minWidth = 1280;

    if (windowWidth < minWidth) {

        windowWidth = minWidth;

    }

    let widthHalf = (windowWidth / 2);

    let heightHalf = (window.innerHeight / 2);

    vector.project(constants.camera);

    vector.x = (vector.x * widthHalf) + widthHalf;

    vector.y = -(vector.y * heightHalf) + heightHalf;

    return vector;
};

/**
 * 三维坐标转视点坐标
 * @param {THREE.Vector3} v3 
 */
export function Vector3ToVP(v3) {
    let yaw = Math.atan2(v3.x, v3.z);

    let pitch = Math.atan2(v3.y, (v3.x / Math.sin(yaw)));

    yaw = THREE.Math.radToDeg(yaw);

    if (yaw < 0) {

        yaw = 360 + yaw;

    }
    yaw = (yaw + 90) % 360;

    let swvg = new SWViewGesture(yaw, THREE.Math.radToDeg(pitch), 0);

    return swvg;
};

/**
 * 视点转三维坐标,P是从球面和Z轴的交点绕Y轴旋转theta，
 * 然后在Y轴和其本身组成的平面上绕其过原点的法向量旋转phi得到，那么点P的坐标如下:
 * x = r*cos(phi)*sin(theta);
 * y = r*sin(phi);
 * z = r*cos(phi)*cos(theta);
 * @param {SWViewGesture} vp 球面坐标 yaw,pitch
 */
export function VPToVector3(vp) {
    let vec = new THREE.Vector3(0, 0, 0);

    vec.y = Math.sin(THREE.Math.degToRad(vp.Pitch)) * constants.c_FaceDistance * 0.5;

    let m = Math.cos(THREE.Math.degToRad(vp.Pitch)) * constants.c_FaceDistance * 0.5;

    vec.x = Math.sin(THREE.Math.degToRad(vp.Yaw - 90)) * m;

    vec.z = Math.cos(THREE.Math.degToRad(vp.Yaw - 90)) * m;

    return vec;
};

/**
 * 相机看向球面坐标转三维坐标
 * @param {Number} yaw 经度
 * @param {Number} pitch 纬度
 */
export function YPRToVector3(yaw, pitch) {

    let vec = new THREE.Vector3(0, 0, 0);

    vec.y = Math.sin(THREE.Math.degToRad(pitch)) * constants.c_FaceDistance * 0.5;

    let m = Math.cos(THREE.Math.degToRad(pitch)) * constants.c_FaceDistance * 0.5;

    vec.x = Math.sin(THREE.Math.degToRad((yaw - 90))) * m;

    vec.z = Math.cos(THREE.Math.degToRad((yaw - 90))) * m;

    return vec;
}

/**
 * 让数值在0~360之间
 * @param {number} n 
 */
export function getNumberMax360(n) {

    n = n % 360;

    if (n < 0) {

        n = 360 + n;

    }
    return n;
};

/**
 * 两点距离
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 */
export function getDistance(x1, y1, x2, y2) {

    let xx = x2 - x1;

    let yy = y2 - y1;

    return Math.pow((xx * xx + yy * yy), 0.5);
};

/**
 * 通过水平fov获得垂直fov
 * @param {number} wfov 
 * @param {number} aspect 
 */
export function getHfov(wfov, aspect) {

    return THREE.Math.radToDeg(Math.atan(Math.tan(THREE.Math.degToRad(wfov) / 2) / aspect) * 2);

};

/**
 * 通过垂直fov获得水平fov
 * @param {number} hfov 
 * @param {number} aspect 
 */
export function getWfov(hfov, aspect) {

    return THREE.Math.radToDeg(2 * Math.atan(Math.tan(THREE.Math.degToRad(hfov) / 2) * aspect));

};

/**
 * 获取当前面当前放大值瓦片WH数
 * @param {number} lzoom 
 */
export function getFaceTileMatrixWH(lzoom) {

    let wh = new THREE.Vector3();

    wh.x = wh.y = Math.pow(2, lzoom);

    return wh;
};

/**
 * 获取点是否在屏幕上
 * @param {THREE.Vector3} sceneXY 
 */
export function getPintIFScene(sceneXY) {
    let boo = false;
    if ((Math.abs(sceneXY.x) != Infinity && sceneXY.x != NaN && (sceneXY.x >= -100 && sceneXY.x <= window.innerWidth + 100)) &&
        (Math.abs(sceneXY.y) != Infinity && sceneXY.y != NaN && ((window.innerHeight - sceneXY.y) >= -100 && (window.innerHeight - sceneXY.y) <= window.innerHeight + 100)) &&
        (Math.abs(sceneXY.z) != Infinity && sceneXY.z != NaN && sceneXY.z < 1)) {
        boo = true;
    }
    return boo;
};

/**
 * 获取随机颜色值
 * */
export function getRandomColor() {

    return '#' + (Math.random() * 0xffffff << 0).toString(16);

};

/**
 * 墙面探面角度值
 * @param {THREE.Object} obj 
 */
export function getWallProbeSurfaceAngle(obj) {

    let normal = obj.face.normal.clone();

    let vv = new THREE.Vector3(0, 0, 1);

    let angle = THREE.Math.radToDeg(vv.angleTo(normal));

    let tan = vv.clone().cross(normal).dot(new THREE.Vector3(0, 1, 0));

    if (tan > 0) {

        angle = 360 - angle;

    }

    return angle;
};

/**
 * 获取显示的距离
 * @param {THREE.Object} obj 
 */
export function getProbeSurfaceDistance(obj) {

    return Math.abs(1.5 * obj.distance / obj.point.y);

};

/**
 * 获取现实中的坐标
 * @param {THREE.Object} obj 
 * @param {number} rph 
 */
export function getPanoRealPoint(obj, rph) {

    let v = Math.asin(obj.point.y / obj.distance); //垂直角度

    let h = Math.atan2(obj.point.z, obj.point.x) - THREE.Math.degToRad(90); //水平角度

    let rp = Math.abs(rph / Math.tan(v));

    let x = rp * Math.cos(h);

    let z = -rp * Math.sin(h);

    let y = rph;

    let v3 = new THREE.Vector3(x, y, z).applyMatrix4(constants.c_OpenGLToDS3Mx4);

    let realPoint = constants.c_StationInfo.point.clone().add(v3);

    return realPoint;
};

/**
 * 获得墙面点击的真实坐标
 * @param {THREE.Object} obj 
 */
export function getWallRealPoint(obj) {

    let drc = obj.point.clone().applyMatrix4(obj.object.matrix).applyMatrix4(constants.c_OpenGLToDS3Mx4);

    let dx = drc.x / constants.c_WallDisplaySize * 2;

    let dy = drc.y / constants.c_WallDisplaySize * 2;

    let dz = drc.z / constants.c_WallDisplaySize * 2;

    let realPoint = constants.c_StationInfo.point.clone().add(new THREE.Vector3(dx, dy, dz));

    return realPoint;
};

/**
 * 获取是否跳转还是放大
 * @param {THREE.Object} obj 
 * @param {int} type 
 */
export function getJudgeOrZoom(obj, type) {

    let distances;

    let dis = 0;

    if (type == 1) {

        distances = getPanoRealPoint(obj, 2.5);

        dis = -1;
    } else {
        distances = getWallRealPoint(obj);
    }
    let dis0 = Math.sqrt(Math.pow((distances.x - constants.c_StationInfo.nx), 2) + Math.pow((distances.y - constants.c_StationInfo.ny), 2)) + dis;
    for (let i = 0; i < constants.c_AdjacentPanoInfoArr.length; i++) {
        let dis1 = Math.sqrt(Math.pow((distances.x - constants.c_AdjacentPanoInfoArr[i].nX), 2) +
            Math.pow((distances.y - constants.c_AdjacentPanoInfoArr[i].nY), 2));
        if (dis1 <= dis0) {
            return false;
        }
    }
    return true;
};

/**
 * 获取两个站点坐标点的夹角
 * @param v1 当前站点
 * @param v2 下一站点
 * */
export function getArrowsAngle(v1, v2) {
    let p2 = new THREE.Vector3(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z).applyMatrix4(constants.c_DS3ToOpenGLMx4);
    let v4 = new THREE.Vector3(-1, 0, 0);
    let angle = p2.angleTo(v4);
    angle = THREE.Math.radToDeg(angle); //转换为角度
    let tan = p2.clone().cross(v4).dot(new THREE.Vector3(0, 1, 0));
    if (tan > 0) {
        angle = 360 - angle;
    }
    return angle;
};

/**
 * 清空对象缓存
 * @param node 对象
 * @param ifParent 是否用父类删除自己
 * */
export function disposeNode(node, ifParent = true) {
    if (node instanceof THREE.Mesh || node instanceof THREE.Sprite || node instanceof THREE.Line || node instanceof THREE.BoxHelper) {
        if (node.geometry) {
            node.geometry.dispose();
        }
        if (node.material) {
            if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) {
                $.each(node.material.materials, function(idx, mtrl) {
                    if (mtrl.map) mtrl.map.dispose();
                    if (mtrl.lightMap) mtrl.lightMap.dispose();
                    if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                    if (mtrl.normalMap) mtrl.normalMap.dispose();
                    if (mtrl.specularMap) mtrl.specularMap.dispose();
                    if (mtrl.envMap) mtrl.envMap.dispose();

                    mtrl.dispose(); // disposes any programs associated with the material
                });
            } else {
                if (node.material.map) node.material.map.dispose();
                if (node.material.lightMap) node.material.lightMap.dispose();
                if (node.material.bumpMap) node.material.bumpMap.dispose();
                if (node.material.normalMap) node.material.normalMap.dispose();
                if (node.material.specularMap) node.material.specularMap.dispose();
                if (node.material.envMap) node.material.envMap.dispose();

                node.material.dispose(); // disposes any programs associated with the material
            }
        }
        if (ifParent) {
            if (node.parent) {
                node.parent.remove(node);
            }
            node = null;
        }
    }
};

/**
 * 清楚新增文本div层
 * @param {*} textdiv 
 */
export function delectTextDiv(textdiv) {
    if (textdiv && document.body.children.indexOf(textdiv) != -1) {
        document.body.removeChild(textdiv);
    }
};


/**
 * 全屏
 * */
export function getFullScreen() {
    if (!document.fullscreenElement // alternative standard method
        &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) { //IE11
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
};

/**
 * DIV文本显示
 * @param {*} labelPos 
 * @param {*} fontSize 
 * @param {*} text 
 */
export function TextDiv(labelPos, fontSize, text) {
    labelPos.copy(getWorldToScene(labelPos));
    this.textDiv = document.createElement("div");
    let fs = fontSize || 14;
    this.textDiv.style.fontSize = fs + "px";
    this.textDiv.style.color = "#fff";
    this.textDiv.style.position = "absolute";
    this.textDiv.id = "" + text;
    this.textDiv.style.pointerEvents = "none";
    if (!text) {
        this.textDiv.style.left = "-100px";
        this.textDiv.style.top = "-100px";
    } else {
        this.textDiv.style.left = labelPos.x + "px";
        this.textDiv.style.top = labelPos.y + "px";
    }
    this.textDiv.innerHTML = text;
    document.body.appendChild(this.textDiv);
    return this.textDiv;
}

/**
 * 获取字体
 * @param {string} fontUrl 字体地址 '../../../commons/font/optimer_regular.typeface.json'
 * @param {Function} callFun 回调函数
 */
export function getFont(fontUrl) {
    return new Promise((resolve, reject) => {
        let loader = new THREE.FontLoader();
        loader.load(fontUrl, (response) => {
            resolve(response);
        });
    });
}

/**
 * 添加老箭头数据
 * */
export function AddOldArrow() {
    constants.c_AdjacentPanoInfoArr.map((obj) => {

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

    constants.c_ArrowPanoInfoArr.map((obj) => {

        if (boo) {

            constants.c_arrowArr.map((item) => {

                if (item.arrowData.srcPanoID === obj.srcPanoID && item.arrowData.dstPanoName === obj.dstPanoName) {

                    item.updateLocation(obj);

                }

            });

        } else {

            constants.c_arrowArr.push(new SWMarkerArrowModule(obj));

        }
    });
}

/**
 * 清除所有箭头
 * */
export function deleteAllArrow() {

    constants.c_arrowArr.map((item) => {

        if (item) item.clearArrow();

    });
    constants.c_arrowArr.length = 0;
}

/**
 * 跳站点
 * @param {String} panoID 站点ID
 */
export function jumpSite(panoID) {

    deleteAllArrow();

    constants.sw_getService.getPanoByID(panoID);
}