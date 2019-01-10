/* global THREE */

import SWBox from './SWBoxModule';
import HashTable from '../../tool/SWHashTable';
import * as constants from '../../tool/SWConstants';
import {
    disposeNode
} from '../../tool/SWTool';
const TWEEN = require('@tweenjs/tween.js');
import SWBoxPreloadingImage from './SWBoxPreloadingImage';
// import SWLittlePlanetModel from './SWLittlePlanetModel';

/**
 * 全景盒子互相跳转动画
 */
class SWBoxJumpModule {
    constructor() {
        this.previousPano = ""; //上一个站点ID

        this.phoneType = true;

        this.panoBox = undefined;

        /**缩略图集合 */
        this.thumbnailsTable = new HashTable();

        /**图片路径 */
        this.imageUrl = "";
    }

    /**
     * 加载缩略图并跳转
     */
    addThumbnail() {

        if (this.imageUrl == "") { //由于加载数据需要时间，这个第一次加载缩略图时记录路径

            this.imageUrl = `${constants.sw_getService.resourcesUrl}/panoImages/`;
        }

        if (constants.c_StationInfo.panoID != this.previousPano.panoID) { //同站点跳转忽略

            let url = `${this.imageUrl}${constants.c_StationInfo.panoID}`;

            if (this.thumbnailsTable.containsKey(constants.c_StationInfo.panoID)) { //缩略图集合中是否有此站点的图

                let textures = this.thumbnailsTable.getValue(constants.c_StationInfo.panoID); //获取当前站点的缩略图对象

                this.createPanoBox(constants.c_StationInfo, url, textures);

            } else { //集合中没有

                this.loadThumbnail(constants.c_StationInfo.panoID, (texture) => {

                    this.createPanoBox(constants.c_StationInfo, url, texture);
                });
            }
        }

        //小行星
        // new SWLittlePlanetModel();
    }

    /**
     * 创建全景盒子并动画跳转
     * @param {String} pano 全景站点编号
     * @param {String} url 路径地址
     * @param {THREE.Texture} texture 缩略图对象
     */
    createPanoBox(pano, url, texture) {

        constants.sw_getService.getOldArrow();

        constants.sw_getService.getFacadeByPanoID();

        constants.sw_getService.getMarkerByPanoID();

        if (!this.panoBox) {

            this.panoBox = new SWBox(url, texture);

            //初始化10秒后开始在后台慢慢下载所有缩略图
            let time = setInterval(() => {

                clearInterval(time);

                this.preloadThumbnails();

            }, 10000);

        } else {
            this.createSphere(() => {

                this.panoBox = new SWBox(url, texture);
            });
        }
        this.previousPano = pano;
    }

    /**
     * 将全景盒子映射到球体上并且清除天空盒子产生新的全景天空盒子
     * @param {Function} callFun 回调函数
     */
    createSphere(callFun) {

        if (constants.c_LowendMachine) {//性能差的手机调用这里

            constants.c_jumpSphere = this.panoBox;

            this.phoneType = false;

        } else {

            this.phoneType = true;

            constants.cubeCamera.update(constants.renderer, constants.scene);

            let cubetexture = constants.cubeCamera.renderTarget.texture;

            let shader = THREE.ShaderLib['cube']; // 来自内置库的init立方体着色器
            shader.uniforms['tFlip'].value = 1; //默认值是-1 进行翻转
            shader.uniforms['tCube'].value = cubetexture; // 将纹理应用于着色器

            //创建着色器材质
            let skyBoxMaterial = new THREE.ShaderMaterial({
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: shader.uniforms,
                depthWrite: false,
                transparent: true,
                side: THREE.DoubleSide
            });

            let geometry = new THREE.SphereGeometry(2048, 32, 32);

            constants.c_jumpSphere = new THREE.Mesh(geometry, skyBoxMaterial);

            constants.scene.add(constants.c_jumpSphere);

            this.panoBox.clearBox();

            this.panoBox = null;

            constants.cubeCamera.children.length = 0;
        }
        this.jumpAnimations(callFun);
    }


    /**
     * 跳转拉伸动画
     * @param {Function} callFun 动画完成之后的回调函数
     */
    jumpAnimations(callFun) {
        let pt = this.phoneType;
        let pos1 = this.previousPano.point.clone().applyMatrix4(constants.c_DS3ToOpenGLMx4);
        let pos2 = constants.c_StationInfo.point.clone().applyMatrix4(constants.c_DS3ToOpenGLMx4);
        let pos3 = pos1.sub(pos2);
		let juli = 1000;

        let from = {
            x: 0,
            y: 0,
            z: 0,
            a: 1
        };
        let to = {
            x: (pos3.x * 80 > juli ? juli : (pos3.x * 80 < -juli ? -juli : pos3.x * 80)) * 1,
            y: 0,
            z: (pos3.z * 80 > juli ? juli : (pos3.z * 80 < -juli ? -juli : pos3.z * 80)) * 1,
            a: 0
        };
        new TWEEN.Tween(from)
            .to(to, 800)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function () {

                if(pt){
                    constants.c_jumpSphere.position.x = this._object.z;

                    constants.c_jumpSphere.position.z = this._object.x;
    
                    constants.c_jumpSphere.material.opacity = this._object.a;
                }else{
                    constants.c_jumpSphere.box.position.x = this._object.z;

                    constants.c_jumpSphere.box.position.z = this._object.x;
                }
            })
            .onComplete(() => {

                if(pt){

                    disposeNode(constants.c_jumpSphere);

                    constants.c_jumpSphere = null;

                }else{

                    this.panoBox.clearBox();

                    this.panoBox = null;
                }
                callFun();
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

        let itemArr = constants.c_panoIDTable.getKeys();

        // 生成一个Promise对象的数组
        const promises = itemArr.map((panoID) => {

            return this.loadThumbnail(panoID);

        });

        Promise.all(promises).then(result => console.log(result)).catch(e => console.log(e));
    }

    /**根据箭头关系加载全景 */
    AccordingArrowLoadPano() {

        constants.c_AdjacentPanoInfoArr.forEach((obj) => {

            for (let i = 0; i < 6; i++) {

                let imageName = `sw_${i}.jpg`;

                new SWBoxPreloadingImage(obj.dstPanoID, 2, imageName);

            }
        });
    }
}

export default SWBoxJumpModule;