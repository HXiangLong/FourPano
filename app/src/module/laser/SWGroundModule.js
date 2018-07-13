/* global THREE*/

import {
    scene,
    c_FaceDistance,
    sw_getService,
    c_StationInfo,
    sw_wallProbeSurface,
    c_isMeasureStatus,
    sw_measure
} from '../../tool/SWConstants';
import { getPanoRealPoint } from '../../tool/SWTool';
import { deleteAll } from '../../tool/SWInitializeInstance';

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
                opacity: 0
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

            //进入
            this.groundMesh.mouseOver = (e, obj) => {

                sw_wallProbeSurface.wallProbeSurfaceVisible(2);

            }

            //出去
            this.groundMesh.mouseOut = (e, obj) => {

                sw_wallProbeSurface.wallProbeSurfaceVisible(0);

            }

            //移动
            this.groundMesh.mouseMove = (e, obj) => {

                sw_wallProbeSurface.groundFaceMove(obj);

            }

            //鼠标弹起
            this.groundMesh.mouseUp = (e, obj) => {

                var event = e || window.event;

                var v3 = new THREE.Vector2(event.clientX, event.clientY);

                var boo = v3.equals(this.startPoint);

                if (boo) {
                    //测量状态开启
                    if (c_isMeasureStatus) {
                        sw_measure.addPoint(obj, 2);
                        return;
                    }
                    let v3 = getPanoRealPoint(obj, 2.5);

                    deleteAll();

                    sw_getService.getOtherPanoByPosition(v3.x, v3.y, v3.z, c_StationInfo.imageID);
                }
            }

            //鼠标按下
            this.groundMesh.mouseDown = (e) => {

                let event = e || window.event;

                this.startPoint.x = event.clientX;

                this.startPoint.y = event.clientY;
            }
        }
    }
}

export default SWGroundModule;