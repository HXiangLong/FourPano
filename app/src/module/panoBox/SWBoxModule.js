import { scene, c_StationInfo, c_FaceDistance, sw_getService } from '../../tool/SWConstants'
import { disposeNode } from '../../tool/SWTool'
import SWBoxFaceModule from './SWBoxFaceModule'

/**
 * 全景盒子
 */
class SWBoxModule {
    constructor() {
        this.box = new THREE.Group(); //全景内盒子
        this.faceArr = [];
        this.url = "";
    }

    loadThumbnail() {
        this.url = `${sw_getService.getmusServerURL().split('/S')[0]}/panoImages/${c_StationInfo.panoID}`;
        scene.add(this.box);
        let path = `${this.url}/0/sw_0.jpg`;
        let loader = new THREE.TextureLoader();
        loader.load(path,
            (texture) =>{
                for (let i = 0; i < 6; i++) {
                    let face = new SWBoxFaceModule(i, this.box, texture, this.url);
                    this.faceArr.push(face);
                }
            },
            (xhr)=> {},
            (xhr)=> {
                console.log(`图片加载失败：${path}`);
            }
        );
    }

}

export default SWBoxModule;