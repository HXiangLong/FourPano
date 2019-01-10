import SWMarkerModule from "./SWMarkerModule";
import * as constants from '../../tool/SWConstants';
import {
    VPToVector3,
    textSize,
    getWorldToScene
} from '../../tool/SWTool';
import {
    jumpSite
} from '../../tool/SWInitializeInstance';
import SWViewGesture from "../../tool/SWViewGesture";
const external = require('../../tool/SWExternalConst');

/**地面站点 */
class SWSiteLocationMoudle extends SWMarkerModule {
    constructor(date) {
        super(external.site_icon, 1, {
            fpsNum: 1,
            wPlane: 512,
            hPlane: 512
        });

        this.config = {
            max: 1,
            min: 0.6,
            openness: 1,
            weak: -0.002
        }

        this.arrowData = date;

        let sif = constants.c_StationInfo.point.clone(); //当前站点位置 - 3ds坐标系

        let points = new THREE.Vector3(parseFloat(this.arrowData.nX), parseFloat(this.arrowData.nY), parseFloat(this.arrowData.nZ));

        let swvg = new SWViewGesture(this.arrowData.angle, 0, 0);

        let v3 = VPToVector3(swvg);

        let opposite = points.clone().distanceTo(sif);

        let jl = v3.clone().distanceTo(new THREE.Vector3(0, 0, 0));

        this.mesh.position.copy(new THREE.Vector3((v3.x * (opposite / jl)), (v3.y - 1.75), (v3.z * (opposite / jl))));

        this.mesh.scale.copy(new THREE.Vector3(0.0005, 0.0005, 0.0005));

        this.mesh.rotation.x = THREE.Math.degToRad(-90);

        this.mesh.name = this.arrowData.dstPanoID;

        this.mesh.userData.depthlevel = 1;

        constants.scene.add(this.mesh);

        constants.c_arrowCurentArr.push(this.mesh);

        this.mesh.visible = false;

        this.mouseDownBoo = false;

        let text = (this.arrowData.dstPanoID == constants.c_LastStopPanoID ? "上一站" : "下一站") + (this.arrowData.dstPanoName == "" || !this.arrowData.dstPanoName ? this.arrowData.dstPanoName : "：") + this.arrowData.dstPanoName;

        this.textDiv.innerHTML = text;

        this.textWidth = textSize("18px", "Arial", text).width * 0.5;

        this.setMeshOpacity();

        setTimeout(() => {

            this.mesh.visible = true;

        }, 1000);

        this.mesh.mouseDown = (e, obj) => {

            this.mouseDownBoo = true;

        };

        this.mesh.mouseUp = (e, obj) => {

            if (!constants.c_isPreviewImageLoadEnd) {

                this.textDiv.style.display = "none";

                if (this.mouseDownBoo) jumpSite(obj.object.name);

            }
        };

        //鼠标进入
        this.mesh.mouseOver = (e, obj) => {

            if (this.textDiv) {

                this.textDiv.style.display = "block";

                let labelPos = getWorldToScene(this.mesh.position);

                this.textDiv.style.left = (labelPos.x - this.textWidth) + "px";

                this.textDiv.style.top = (labelPos.y - 60) + "px";
            }

        }

        //出去
        this.mesh.mouseOut = (e, obj) => {

            this.textDiv.style.display = "none";

        }
    }

    /**设置透明度 */
    setMeshOpacity(panoid) {
        if (this.arrowData.dstPanoID == panoid) {
            this.mesh.material.opacity = 1;
        } else {
            this.mesh.material.opacity = 0.5;
        }
    }

    update(delta) {
        if (this.textureAnimator && this.markerType == 2) {

            this.textureAnimator.update(1000 * delta);

        }

        if (constants.c_currentState == constants.c_currentStateEnum.phoneStatus) {

            // if (this.textDiv && this.mesh.visible) {

            //     let labelPos = getWorldToScene(this.mesh.position);

            //     if (labelPos.z < 1) {

            //         this.textDiv.style.display = "block";

            //         this.textDiv.style.left = (labelPos.x - this.textWidth) + "px";

            //         this.textDiv.style.top = (labelPos.y - 60) + "px";

            //         if ((labelPos.x - this.textWidth) > window.innerWidth || (labelPos.x - this.textWidth) < 0 || (labelPos.y - 60) > window.innerHeight || (labelPos.y - 60) < 0) {
            //             this.textDiv.style.display = "none";
            //         }

            //     } else {
            //         this.textDiv.style.display = "none";
            //     }
            // }
        }
    }

    /**清理箭头对象 */
    clearArrow() {

        this.textDiv.style.display = "none";

        this.clear();

        this.arrowData = null;

    }

}

export default SWSiteLocationMoudle;