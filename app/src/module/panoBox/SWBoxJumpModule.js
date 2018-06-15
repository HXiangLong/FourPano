/* global THREE */

import SWBox from './SWBoxModule';
import HashTable from '../../tool/SWHashTable';
import {
    scene,
    renderer,
    cubeCamera,
    c_StationInfo,
    sw_getService,
    c_FloorsMapTable,
    c_isPreviewImageLoadEnd,
    c_FaceDistance,
    c_DS3ToOpenGLMx4
} from '../../tool/SWConstants';
const TWEEN = require('@tweenjs/tween.js');

/**
 * 全景盒子互相跳转动画
 */
class SWBoxJumpModule {
    constructor() {
        this.previousPano = ""; //上一个站点ID

        this.panoBox = undefined;

        this.sphere = undefined;

        /**缩略图集合 */
        this.thumbnailsTable = new HashTable();

        /**图片路径 */
        this.imageUrl = "";

        //初始化10秒后开始在后台慢慢下载所有缩略图
        let time = setInterval(() => {

            clearInterval(time);

            this.preloadThumbnails();

            this.createSphere();

        }, 10000);

    }

    /**
     * 加载缩略图并跳转
     */
    addThumbnail() {

        if (this.imageUrl == "") { //由于加载数据需要时间，这个第一次加载缩略图时记录路径

            this.imageUrl = `${sw_getService.getmusServerURL().split('/S')[0]}/panoImages/`;
        }

        if (c_StationInfo.panoID != this.previousPano) { //同站点跳转忽略

            // c_isPreviewImageLoadEnd = true;

            let url = `${this.imageUrl}${c_StationInfo.panoID}`;

            if (this.thumbnailsTable.containsKey(c_StationInfo.panoID)) { //缩略图集合中是否有此站点的图

                let textures = this.thumbnailsTable.getValue(c_StationInfo.panoID); //获取当前站点的缩略图对象

                this.createPanoBox(c_StationInfo, url, textures);

            } else { //集合中没有

                this.loadThumbnail(c_StationInfo.panoID, (texture) => {

                    this.createPanoBox(c_StationInfo, url, texture);

                });
            }
        }
    }

    /**
     * 创建全景盒子并动画跳转
     * @param {String} pano 全景站点编号
     * @param {String} url 路径地址
     * @param {THREE.Texture} texture 缩略图对象
     */
    createPanoBox(pano, url, texture) {
        this.previousPano = pano;

        if (!this.panoBox) {

            this.panoBox = new SWBox(url, texture);

        } else {
            this.createSphere();
        }
    }

    /**
     * 将全景盒子映射到球体上并且清除天空盒子产生新的全景天空盒子
     */
    createSphere() {

        cubeCamera.update(renderer, scene);

        let cubetexture = cubeCamera.renderTarget.texture;

        let material = new THREE.MeshBasicMaterial({
            envMap: cubetexture,
            side: THREE.BackSide
        });

        material.envMap.mapping = THREE.CubeRefractionMapping;

        this.sphere = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(c_FaceDistance * 0.5, 3), material);

        scene.add(this.sphere);

        this.panoBox.clearBox();

        // this.jumpAnimations();
    }

    /**
     * 跳转拉伸动画
     */
    jumpAnimations() {
        let pos1 = this.previousPano.point.clone().applyMatrix4(c_DS3ToOpenGLMx4);
        let pos2 = c_StationInfo.point.clone().applyMatrix4(c_DS3ToOpenGLMx4);
        let pos3 = pos1.sub(pos2);

        let from = { x: 0, y: 0, z: 0, a: 1 };
        let to = {
            x: (pos3.x * 100 > 1000 ? 1000 : (pos3.x * 100 < -1000 ? -1000 : pos3.x * 100)),
            y: 0,
            z: (pos3.z * 100 > 1000 ? 1000 : (pos3.z * 100 < -1000 ? -1000 : pos3.z * 100)),
            a: 0
        };
        new TWEEN.Tween(from)
            .to(to, 800)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                this.sphere.position.copy(new THREE.Vector3(this.z, this.y, this.x));
            })
            .onComplete(function() {

            })
            .start();
    }

    /**
     * 加载缩略图
     * @param {String} panoID 站点ID
     * @param {Function} callfun 回调函数
     */
    loadThumbnail(panoID, callfun) {

        let path = `${this.imageUrl}${panoID}/0/sw_0.jpg`;

        let loader = new THREE.TextureLoader();

        loader.load(path,
            (texture) => {
                this.thumbnailsTable.add(panoID, texture);

                if (callfun) {

                    callfun(texture);

                }
            },
            (xhr) => {},
            (xhr) => {
                console.log(`图片加载失败：${path}`);
            }
        );
    }

    /**
     * 预加载所有站点的缩略图
     */
    preloadThumbnails() {

        let itemArr = [];

        let fmt = c_FloorsMapTable.getValues();

        fmt.forEach(element => {

            let fmi = element.rasterMapMarkers.getValues();

            fmi.forEach(item => {

                itemArr.push(item.panoID);

            });

        });

        // 生成一个Promise对象的数组
        const promises = itemArr.map((panoID) => {

            return this.loadThumbnail(panoID);

        });

        Promise.all(promises).then(result => console.log(result)).catch(e => console.log(e));
    }

}

export default SWBoxJumpModule;