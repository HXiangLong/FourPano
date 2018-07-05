/* global THREE*/

import {
    scene,
    camera,
    minfov,
    c_StationInfo,
    c_WallDisplaySize,
    c_DS3ToOpenGLMx4,
    c_OpenGLToDS3Mx4,
    c_isWallProbeSurfacePlusShow,
    c_wallClickRotateV3,
    sw_getService
} from '../../tool/SWConstants';
import { getRandomColor, disposeNode } from '../../tool/SWTool';
/**
 * 激光点云墙面片
 */
class SWWallFaceModule {
    constructor(obj) {
        this.info = obj; //面片数据
        this.points = [];
        this.startPoint = new THREE.Vector2();
        this.wallmesh = undefined;

        this.drawWallFace();
    }

    drawWallFace() {

        let sif = c_StationInfo.point.clone();

        this.points.p1 = new THREE.Vector3(this.info.points.p1.x - sif.x,
            this.info.points.p1.y - sif.y,
            this.info.points.p1.z - sif.z);
        this.points.p2 = new THREE.Vector3(this.info.points.p2.x - sif.x,
            this.info.points.p2.y - sif.y,
            this.info.points.p2.z - sif.z);
        this.points.p3 = new THREE.Vector3(this.info.points.p3.x - sif.x,
            this.info.points.p3.y - sif.y,
            this.info.points.p3.z - sif.z);
        this.points.p4 = new THREE.Vector3(this.info.points.p4.x - sif.x,
            this.info.points.p4.y - sif.y,
            this.info.points.p4.z - sif.z);

        let material = new THREE.MeshLambertMaterial({
            color: getRandomColor(),
            depthTest: true,
            side: 2,
            transparent: true,
            opacity: 0.5
        });

        let geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(this.points.p1.x * 0.5 * c_WallDisplaySize,
            this.points.p1.y * 0.5 * c_WallDisplaySize,
            this.points.p1.z * 0.5 * c_WallDisplaySize).applyMatrix4(c_DS3ToOpenGLMx4));
        geometry.vertices.push(new THREE.Vector3(this.points.p2.x * 0.5 * c_WallDisplaySize,
            this.points.p2.y * 0.5 * c_WallDisplaySize,
            this.points.p2.z * 0.5 * c_WallDisplaySize).applyMatrix4(c_DS3ToOpenGLMx4));
        geometry.vertices.push(new THREE.Vector3(this.points.p3.x * 0.5 * c_WallDisplaySize,
            this.points.p3.y * 0.5 * c_WallDisplaySize,
            this.points.p3.z * 0.5 * c_WallDisplaySize).applyMatrix4(c_DS3ToOpenGLMx4));
        geometry.vertices.push(new THREE.Vector3(this.points.p4.x * 0.5 * c_WallDisplaySize,
            this.points.p4.y * 0.5 * c_WallDisplaySize,
            this.points.p4.z * 0.5 * c_WallDisplaySize).applyMatrix4(c_DS3ToOpenGLMx4));

        let face = new THREE.Face3(0, 1, 2);
        let face1 = new THREE.Face3(2, 3, 0);
        geometry.faces.push(face);
        geometry.faces.push(face1);
        geometry.computeFaceNormals();

        this.wallmesh = new THREE.Mesh(geometry, material);
        this.wallmesh.rotation.y = THREE.Math.degToRad(90);
        this.wallmesh.rotation.z = THREE.Math.degToRad(180);
        this.wallmesh.userData.depthlevel = 2;
        this.wallmesh.name = this.info.facadeID;
        scene.add(this.wallmesh);
    }

    wallMouseEvent() {

        this.wallmesh.mouseOver = (e, obj) => { //鼠标进入
            // if (!SWPanoView.isMeasureStatus) { //测量状态
            //     SWPanoView.wallProbeSurface.wallProbeSurfaceVisible(true);
            // }
        };

        this.wallmesh.mouseOut = (e, obj) => { //鼠标离开
            // SWPanoView.wallProbeSurface.wallProbeSurfaceVisible(false);
        };

        this.wallmesh.mouseUp = (e, obj) => { //鼠标点击事件

            let event = e || window.event;

            let v3 = new THREE.Vector2(event.clientX, event.clientY);

            let boo = v3.equals(this.startPoint);

            if (boo) {

                // if (!SWPanoView.isEditorStatus) { //编辑状态

                //     if (SWPanoView.isMeasureStatus) { //测量状态

                //         SWPanoView.swMeasure.addPoint(obj.point, 1);

                //     } else {

                //         if (!c_isWallProbeSurfacePlusShow) {

                // SWPanoView.addmouseEvent.mouseEvent.ifJump = true;

                let realPoint1 = obj.point.clone().applyMatrix4(obj.object.matrix).applyMatrix4(c_OpenGLToDS3Mx4);

                let realPoint = new THREE.Vector3(c_StationInfo.nx + realPoint1.x / 10,
                    c_StationInfo.ny + realPoint1.y / 10,
                    c_StationInfo.nz + realPoint1.z / 10);

                c_wallClickRotateV3.copy(realPoint);

                sw_getService.getOtherPanoByFacadeID(realPoint.x, realPoint.y, realPoint.z, obj.object.name);

                // SWPanoView.wallProbeSurface.wallProbeSurfaceVisible(false);

                // } else {

                // let fovLevel = Math.ceil((camera.fov - minfov) / 12);

                // if (fovLevel > 1) {

                //     SWPanoView.swCameraManage.wallMoseWheel(1);
                // } else {

                //     SWPanoView.swCameraManage.wallMoseWheel(0);

                // }
                // }
                // }
                // }
            }
        };

        this.wallmesh.mouseDown = (e) => {

            let event = e || window.event;

            this.startPoint.x = event.clientX;

            this.startPoint.y = event.clientY;

        };
    }

    clearWallMesh() {
        disposeNode(this.wallmesh);
    }

}

export default SWWallFaceModule;