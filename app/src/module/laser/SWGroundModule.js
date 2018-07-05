/* global THREE*/

import { scene, c_FaceDistance } from '../../tool/SWConstants';

/**
 * 地面面片对象
 */
class SWGroundModule {
    constructor() {
        this.groundMesh = undefined;
        this.ifClick = false;
        this.startPoint = new THREE.Vector2();

        this.groundDisplaySize = -500;
        this.probeSurface = null;
        this.textDiv = null;
    }

    /**
     * 绘制底层面片
     */
    drawGroundFace() {
        if (!this.groundMesh) {
            let groundMaterial = new THREE.MeshBasicMaterial({
                color: 0xff00ff,
                depthTest: false,
                transparent: true,
                side: 2,
                opacity: 0.5
            });
            groundMaterial.shading = THREE.SmoothShading;
            groundMaterial.reflectivity = 0;

            var groundGeometry = new THREE.CircleGeometry(c_FaceDistance * 0.45, 32);
            this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
            this.groundMesh.position.copy(new THREE.Vector3(0, this.groundDisplaySize, 0));
            this.groundMesh.rotation.x = THREE.Math.degToRad(-90);
            this.groundMesh.name = "ground face";
            this.groundMesh.userData.depthlevel = 3;
            scene.add(this.groundMesh);

            // this.groundMesh.onClick = function (obj, e) {//鼠标弹起
            //     var event = e || window.event;
            //     var v33 = new THREE.Vector2(event.screenX, event.screenY);
            //     var boo = v33.equals(this.startPoint);
            //     if (boo) {
            //         if (!SWPanoView.isEditorStatus) {
            //             if (!SWPanoView.isMeasureStatus) {
            //                 if (!ifClick) {
            //                     SWPanoView.addmouseEvent.mouseEvent.ifJump = true;
            //                     var v3 = SWPanoView.getPanoRealPoint(obj, 2.5);
            //                     SWPanoView.swGetService.getOtherPanoByPosition(v3.x, v3.y, v3.z, SWPanoView.stationInfo.imageID);
            //                     this.probeSurfaceVisible(false);
            //                 }
            //             }
            //             else {
            //                 SWPanoView.swMeasure.addPoint(obj.point, 2);//测量功能
            //             }
            //         }
            //     }
            // };

            // this.groundMesh.onDown = function (obj, e) {//鼠标按下
            //     if (this.textDiv) {
            //         this.textDiv.style.display = "none";
            //     }
            //     if (this.probeSurface) {
            //         this.probeSurface.visible = false;
            //     }
            //     var event = e || window.event;
            //     this.startPoint.x = event.screenX;
            //     this.startPoint.y = event.screenY;
            // }
        }
    }
}

export default SWGroundModule;