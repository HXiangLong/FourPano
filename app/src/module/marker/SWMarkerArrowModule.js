/* global THREE,$*/

import SWMarkerModule from "./SWMarkerModule";
import SWViewGesture from "../../tool/SWViewGesture";
import {
    camera,
    scene,
    c_LastStopPanoID,
    c_currentState,
    c_currentStateEnum,
    c_isPreviewImageLoadEnd,
    c_arrowCurentArr,
    c_clientWidth,
    c_clientHeight
} from '../../tool/SWConstants';
import {
    VPToVector3,
    textSize,
    getWorldToScene
} from '../../tool/SWTool';
import {
    jumpSite
} from '../../tool/SWInitializeInstance';
const external = require('../../tool/SWExternalConst');

/**
 * 箭头标注
 */
class SWMarkerArrowModule extends SWMarkerModule {
    /**
     * 
     * @param {SWArrowInfo} date 箭头数据
     */
    constructor(date) {

        super(external.arrow_icon, 2, {
            fpsNum: 27,
            wPlane: 144,
            hPlane: 64
        });


        this.arrowData = date;

        this.swvg = this.arrowData.angle ? new SWViewGesture(this.arrowData.angle, -35, 0) : new SWViewGesture(this.arrowData.yaw, this.arrowData.pitch, 0);

        this.v3 = VPToVector3(this.swvg);

        this.mesh.position.copy(new THREE.Vector3((this.v3.x * 0.65), (this.v3.y * 0.45), (this.v3.z * 0.65)));

        this.mesh.lookAt(camera.position);

        this.mesh.name = this.arrowData.dstPanoID;

        this.mesh.userData.depthlevel = 1;

        scene.add(this.mesh);

        c_arrowCurentArr.push(this.mesh);

        this.mesh.visible = false;

        this.mouseDownBoo = false;

        let text = (this.arrowData.dstPanoID == c_LastStopPanoID ? "上一站" : "下一站") + (this.arrowData.dstPanoName == "" ? this.arrowData.dstPanoName : "：") + this.arrowData.dstPanoName;

        this.textDiv.innerHTML = text;

        this.textWidth = textSize("18px", "Arial", text).width * 0.5;

        setTimeout(() => {

            this.mesh.visible = true;

        }, 1000);

        this.mesh.mouseDown = (e, obj) => {

            this.mouseDownBoo = true;

        };

        this.mesh.mouseUp = (e, obj) => {

            if(!c_isPreviewImageLoadEnd){

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

    update(delta) {
        if (this.textureAnimator && this.markerType == 2) {

            this.textureAnimator.update(1000 * delta);

        }

        if(c_currentState == c_currentStateEnum.phoneStatus){

            if (this.textDiv && this.mesh.visible) {

                let labelPos = getWorldToScene(this.mesh.position);
    
                if(labelPos.z < 1){
    
                    this.textDiv.style.display = "block";
    
                    this.textDiv.style.left = (labelPos.x - this.textWidth) + "px";
        
                    this.textDiv.style.top = (labelPos.y - 60) + "px";

                    if((labelPos.x - this.textWidth) > c_clientWidth || (labelPos.x - this.textWidth) < 0 || (labelPos.y - 60) > c_clientHeight || (labelPos.y - 60) < 0){
                        this.textDiv.style.display = "none";
                    }

                }else{
                    this.textDiv.style.display = "none";
                }
            }
        }
    }

    /**
     * 老箭头已经在的情况下，新箭头校正坐标
     * @param {SWArrowInfo} date 新箭头数据
     */
    updateLocation(date) {
        this.arrowData = date;

        this.swvg = new SWViewGesture(this.arrowData.yaw, this.arrowData.pitch, 0);

        this.v3 = VPToVector3(this.swvg);

        this.mesh.position.copy(new THREE.Vector3((this.v3.x * 0.65), (this.v3.y * 0.45), (this.v3.z * 0.65)));

        this.mesh.lookAt(camera.position);
    }

    /**清理箭头对象 */
    clearArrow() {

        this.textDiv.style.display = "none";
        
        this.clear();

        this.arrowData = null;

    }
}

export default SWMarkerArrowModule;