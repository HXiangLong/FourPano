/* global THREE*/

import {
    c_FaceDistance,
    scene,
    vs_hdr,
    fs_hdr
} from '../../tool/SWConstants'
import {
    disposeNode,
    Vector3ToVP,
    getNumberMax360
} from '../../tool/SWTool'
import SWBoxTilesModule from './SWBoxTilesModule'
import HashTable from '../../tool/SWHashTable';
/**
 * 全景盒子面对象
 */
class SWBoxFaceModule {
    /**
     * 构造函数
     * @param {Number} no 面编号
     * @param {THREE.Group} faceGroup 全景盒子对象
     * @param {THREE.Group} texture 全景贴图
     * @param {THREE.Group} path 图片链接的前半截地址
     * @param {Function} callfun 加载完毕回调
     */
    constructor(no, faceGroup, texture, path, callfun) {

        this.faceNo = no; //面编号

        this.boxPath = path; //总路径

        this.levelplaneTable = new HashTable(); //4等级面数组

        this.fourPoint = []; //面的四个顶点坐标

        this.tilesPointArr = []; //所有瓦片四个顶点坐标

        this.faceGroup = faceGroup; //全部盒子对象

        this.callFun = callfun;

        this.loadTexture();

        this.geometry = new THREE.PlaneGeometry(c_FaceDistance, c_FaceDistance, 1, 1);

        this.material = new THREE.MeshBasicMaterial({ map: texture ,depthTest: true});

        this.thumbnails = new THREE.Mesh(this.geometry, this.material);

        this.thumbnails.name = "" + this.faceNo;

        this.thumbnails.userData.depthlevel = 100;

        this.facePosition();

        this.faceGroup.add(this.thumbnails);

        this.faceFourVertices();

    }

    /**
     * 面位置及旋转
     */
    facePosition() {
        switch (this.faceNo) {
            case 0:
                this.thumbnails.position.x = c_FaceDistance / 2;
                this.thumbnails.rotation.y = THREE.Math.degToRad(-90);
                break;
            case 1:
                this.thumbnails.position.z = c_FaceDistance / 2;
                this.thumbnails.rotation.y = THREE.Math.degToRad(180);
                break;
            case 2:
                this.thumbnails.position.x = -c_FaceDistance / 2;
                this.thumbnails.rotation.y = THREE.Math.degToRad(90);
                break;
            case 3:
                this.thumbnails.position.z = -c_FaceDistance / 2;
                break;
            case 4:
                this.thumbnails.position.y = c_FaceDistance / 2;
                this.thumbnails.rotation.x = THREE.Math.degToRad(90);
                this.thumbnails.rotation.z = THREE.Math.degToRad(180);
                break;
            case 5:
                this.thumbnails.position.y = -c_FaceDistance / 2;
                this.thumbnails.rotation.x = THREE.Math.degToRad(-90);
                this.thumbnails.rotation.z = THREE.Math.degToRad(180);
                break;
            default:
                break;
        }
    }

    /**
     * 当前瓦片四个顶点世界坐标及所有小瓦片世界坐标
     */
    faceFourVertices() {
        let fourPointV3 = [];

        fourPointV3.push(this.faceMatrix4(this.thumbnails.geometry.vertices[0]));

        fourPointV3.push(this.faceMatrix4(this.thumbnails.geometry.vertices[1]));

        fourPointV3.push(this.faceMatrix4(this.thumbnails.geometry.vertices[2]));

        fourPointV3.push(this.faceMatrix4(this.thumbnails.geometry.vertices[3]));

        this.fourPoint = [Vector3ToVP(fourPointV3[0]),
            Vector3ToVP(fourPointV3[1]),
            Vector3ToVP(fourPointV3[2]),
            Vector3ToVP(fourPointV3[3])
        ];

        let yawDis = -90 / 8;
        let minYaw = this.fourPoint[0].Yaw;

        let minPitch = this.fourPoint[0].Pitch;
        let pitchDis = -(this.fourPoint[0].Pitch - this.fourPoint[this.fourPoint.length - 1].Pitch) / 8;

        for (let y = 0; y < 8; y++) {

            for (let x = 0; x < 8; x++) {

                let y1 = getNumberMax360(minYaw + yawDis * x);
                let p1 = minPitch + pitchDis * y;

                let y2 = getNumberMax360(minYaw + yawDis * (x + 1));
                let p2 = minPitch + pitchDis * y;

                let y3 = getNumberMax360(minYaw + yawDis * x);
                let p3 = minPitch + pitchDis * (y + 1);

                let y4 = getNumberMax360(minYaw + yawDis * (x + 1));
                let p4 = minPitch + pitchDis * (y + 1);

                this.tilesPointArr.push([
                    [y1, p1],
                    [y2, p2],
                    [y3, p3],
                    [y4, p4]
                ]);
            }
        }
    }

    /**矩阵计算世界坐标 */
    faceMatrix4(v3) {
        let aa = v3.clone().applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(this.thumbnails.rotation));

        let v0 = aa.clone().add(this.thumbnails.position);

        let d = v0.clone().applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(this.faceGroup.rotation));

        let b = d.clone().applyMatrix4(this.faceGroup.matrixWorld);

        return b;
    }

    /**
     * 加载高清图
     */
    loadTexture() {

        let path = `${this.boxPath}/3/sw_${this.faceNo}.jpg`;

        // 实例化一个加载器
        let loader = new THREE.TextureLoader();

        // 加载资源
        loader.load(
            // 资源URL
            path,
            // 加载成功之后调用
            (texture) => {

                texture.mapping = THREE.UVMapping;

                texture.magFilter = THREE.LinearFilter;

                texture.minFilter = THREE.LinearFilter;

                texture.type = THREE.FloatType;

                texture.anisotropy = 1;

                this.thumbnails.material.map = texture;

                this.thumbnails.material.map.needsUpdate = true;

                this.callFun();
            },
            // 加载中
            (xhr) => {},
            // 加载失败
            (xhr) => {
                console.log(`图片加载失败：${path}`);
            }
        );
    }

    /**生成瓦片 */
    createTiles(minYaw, maxYaw, minPitch, maxPitch) {

        for (let y = 0; y < 8; y++) {

            for (let x = 0; x < 8; x++) {

                let pointArr = this.tilesPointArr[y * 8 + x];

                pointArr.forEach((item) => {

                    let boo = false;

                    if ((maxYaw - minYaw) > 120) { //圆的0和360是同一个点

                        if (((0 < item[0] && item[0] < minYaw) || (maxYaw < item[0] && item[0] < 360)) && (minPitch < item[1] && item[1] < maxPitch)) {
                            boo = true;
                        }

                    } else {

                        if (minYaw < item[0] && item[0] < maxYaw && minPitch < item[1] && item[1] < maxPitch) {
                            boo = true;
                        }

                    }

                    if (boo) {
                        let key = y + "_" + x;

                        if (!this.levelplaneTable.containsKey(key)) {

                            let tiles = new SWBoxTilesModule(this.faceNo, y + 1, x + 1, this.thumbnails, this.boxPath);

                            this.levelplaneTable.add(key, tiles);
                        }
                    }
                });
            }
        }
    }

    /**
     * 清除瓦片及自身
     */
    clearTiles(boo = true) {

        let tilesArr = this.levelplaneTable.getValues();

        tilesArr.forEach((tile) => {

            tile.clearTile();

        });

        this.levelplaneTable.clear();

        if (boo) {
            disposeNode(this.thumbnails, true);
        }
    }
}

export default SWBoxFaceModule;