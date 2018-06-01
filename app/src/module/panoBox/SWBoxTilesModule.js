import { c_StationInfo, c_FaceDistance } from '../../tool/SWConstants'
import { disposeNode } from '../../tool/SWTool'
/**
 * 全景盒子瓦片对象
 */
class SWBoxTilesModule {
    /**
     * @param {Number} no 所属面编号
     * @param {Number} x 行
     * @param {Number} y 列
     * @param {Object} meshparent 父类对象
     * @param {THREE.Group} path 图片链接的前半截地址
     */
    constructor(no, x, y, meshparent, path) {
        this.loadImageType = 0; //0-未加载图片 1-正在加载 2-加载成功 3-加载失败
        this.faceNo = no;
        this.row = x;
        this.line = y;
        this.meshParent = meshparent;
        this.boxPath = path;
        this.lineNum = 8;
        this.planeW = c_FaceDistance / this.lineNum;
        this.geometry = new THREE.PlaneGeometry(this.planeW, this.planeW, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ map: null, depthTest: true });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = `编号:${this.faceNo}_${this.row}_${this.line}`;
        this.mesh.position.x = -c_FaceDistance * 0.5 + this.planeW * 0.5 + (this.line - 1) * this.planeW;
        this.mesh.position.y = c_FaceDistance * 0.5 - this.planeW * 0.5 - (this.row - 1) * this.planeW;
        this.mesh.userData.depthlevel = 100;
        this.loadTilesTexture();
    }

    /**
     * 加载瓦片贴图
     */
    loadTilesTexture() {
        let ss = (((this.row - 1) * this.lineNum + this.line > 9) ? ((this.row - 1) * this.lineNum + this.line) : '0' + ((this.row - 1) * this.lineNum + this.line));
        let path = `${this.boxPath}/3/sw_${(this.faceNo)}_${ss}.jpg`;
        // 实例化一个加载器
        let loader = new THREE.TextureLoader();
        // 加载资源
        loader.load(
            // 资源URL
            path,
            // 加载成功之后调用
            (texture) => {
                this.geometry.visible = true;
                texture.mapping = THREE.UVMapping;
                //texture.wrapS = THREE.RepeatWrapping;
                //texture.wrapT = THREE.RepeatWrapping;
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearFilter;
                texture.type = THREE.FloatType;
                texture.anisotropy = 1;
                this.mesh.material.map = texture;
                this.mesh.material.map.needsUpdate = true;
                this.loadImageType = 2;
                this.meshParent.add(this.mesh);
            },
            // 加载中
            (xhr) => {
                this.loadImageType = 1;
            },
            // 加载失败
            (xhr) => {
                console.log(`图片加载失败：${path}`);
                this.loadImageType = 3;
            }
        );
    }

    clearTile() {
        disposeNode(this.mesh);
    }
}

export default SWBoxTilesModule;