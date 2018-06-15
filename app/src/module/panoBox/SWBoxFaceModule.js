/* global THREE*/

import { c_FaceDistance } from '../../tool/SWConstants'
import { disposeNode } from '../../tool/SWTool'
import SWBoxTilesModule from './SWBoxTilesModule'
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
     */
    constructor(no, faceGroup, texture, path) {

        this.faceNo = no;

        this.boxPath = path;

        this.levelplaneArr = []; //4等级面数组

        this.fourPoint = [];

        this.faceGroup = faceGroup;

        this.loadTexture();

        this.geometry = new THREE.PlaneGeometry(c_FaceDistance, c_FaceDistance, 1, 1);

        this.material = new THREE.MeshBasicMaterial({ map: texture });

        this.thumbnails = new THREE.Mesh(this.geometry, this.material);

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
     * 当前瓦片四个顶点世界坐标
     */
    faceFourVertices() {
        this.fourPoint.p1 = this.faceMatrix4(this.thumbnails.geometry.vertices[0]);

        this.fourPoint.p2 = this.faceMatrix4(this.thumbnails.geometry.vertices[1]);

        this.fourPoint.p3 = this.faceMatrix4(this.thumbnails.geometry.vertices[2]);

        this.fourPoint.p4 = this.faceMatrix4(this.thumbnails.geometry.vertices[3]);
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
        let dd = Date.now();

        let path = `${this.boxPath}/2/sw_${this.faceNo}.jpg`;

        // 实例化一个加载器
        let loader = new THREE.TextureLoader();

        // 加载资源
        loader.load(
            // 资源URL
            path,
            // 加载成功之后调用
            (texture) => {
                console.log(`清晰图加载耗时：${Date.now()-dd}ms`);

                console.log(texture);

                texture.mapping = THREE.UVMapping;

                texture.magFilter = THREE.LinearFilter;

                texture.minFilter = THREE.LinearFilter;

                texture.type = THREE.FloatType;

                texture.anisotropy = 1;

                this.thumbnails.material.map = texture;

                this.thumbnails.material.map.needsUpdate = true;
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
    createTiles() {
        for (let x = 0; x < 8; x++) {

            for (let y = 0; y < 8; y++) {

                let tiles = new SWBoxTilesModule(this.faceNo, x + 1, y + 1, this.thumbnails, this.boxPath);

                this.levelplaneArr.push(tiles);

            }
        }
    }

    /**
     * 显示隐藏瓦片
     * @param {Boolean} boo 
     */
    showHideTiles(boo) {

    }

    /**
     * 清除瓦片及自身
     */
    clearTiles() {
        this.levelplaneArr.forEach((tile) => {

            tile.clearTile();

        });

        disposeNode(this.thumbnails, true);
    }
}

export default SWBoxFaceModule;