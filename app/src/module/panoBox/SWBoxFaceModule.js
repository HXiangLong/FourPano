import { c_StationInfo, c_FaceDistance } from '../../tool/SWConstants'
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
        // this.uvPosition = [
        //     new THREE.Vector2(parseInt(no % 3) * (1 / 3), 1 - parseInt(no / 3) * 0.5),
        //     new THREE.Vector2((parseInt(no % 3) + 1) * (1 / 3), 1 - parseInt(no / 3) * 0.5),
        //     new THREE.Vector2((parseInt(no % 3) + 1) * (1 / 3), 1 - (parseInt(no / 3) + 1) * 0.5),
        //     new THREE.Vector2(parseInt(no % 3) * (1 / 3), 1 - (parseInt(no / 3) + 1) * 0.5)
        // ];

        // this.uvPosition1 = [
        //     new THREE.Vector2(0, 1),
        //     new THREE.Vector2(1, 1),
        //     new THREE.Vector2(1, 0),
        //     new THREE.Vector2(0, 0)
        // ];
        this.geometry = new THREE.PlaneGeometry(c_FaceDistance, c_FaceDistance, 1, 1);
        // this.geometry.faceVertexUvs[0][0] = [this.uvPosition[3], this.uvPosition[2], this.uvPosition[0]];
        // this.geometry.faceVertexUvs[0][1] = [this.uvPosition[2], this.uvPosition[1], this.uvPosition[0]];
        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.thumbnails = new THREE.Mesh(this.geometry, this.material);
        this.thumbnails.userData.depthlevel = 100;
        faceGroup.add(this.thumbnails);
        this.facePosition();
        this.loadTexture();
    }

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

    loadTexture() {
        let path = `${this.boxPath}/2/sw_${this.faceNo}.jpg`;
        // 实例化一个加载器
        let loader = new THREE.TextureLoader();
        // 加载资源
        loader.load(
            // 资源URL
            path,
            // 加载成功之后调用
            (texture) => {
                // this.geometry.faceVertexUvs[0][0] = [this.uvPosition1[3], this.uvPosition1[2], this.uvPosition1[0]];
                // this.geometry.faceVertexUvs[0][1] = [this.uvPosition1[2], this.uvPosition1[1], this.uvPosition1[0]];
                texture.mapping = THREE.UVMapping;
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearFilter;
                texture.type = THREE.FloatType;
                texture.anisotropy = 1;
                this.thumbnails.material.map = texture;
                this.thumbnails.material.map.needsUpdate = true;
                // this.thumbnails.geometry = this.geometry;
            },
            // 加载中
            (xhr) => {},
            // 加载失败
            (xhr) => {
                console.log(`图片加载失败：${path}`);
            }
        );
    }

    createTiles() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let tiles = new SWBoxTilesModule(this.faceNo, 3, x + 1, y + 1, this.thumbnails, this.boxPath);
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

    clearTiles() {

    }
}

export default SWBoxFaceModule;