/* global THREE*/

import {
    scene,
    c_StationInfo,
    c_WallDisplaySize,
    c_DS3ToOpenGLMx4,
    c_OpenGLToDS3Mx4,
    c_wallClickRotateV3,
    sw_getService,
    sw_wallProbeSurface,
    sw_cameraManage
} from '../../tool/SWConstants';
import { getRandomColor, disposeNode, Vector3ToVP, setCameraAngle } from '../../tool/SWTool';
import { deleteAll } from '../../tool/SWInitializeInstance';
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

    /**
     * 绘制墙面片
     */
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

        this.wallMouseEvent();
    }

    /**墙面面片鼠标事件 */
    wallMouseEvent() {

        //鼠标进入
        this.wallmesh.mouseOver = (e, obj) => {
            sw_wallProbeSurface.wallProbeSurfaceVisible(1);
        }

        //出去
        this.wallmesh.mouseOut = (e, obj) => {
            sw_wallProbeSurface.wallProbeSurfaceVisible(0);
        }

        //移动
        this.wallmesh.mouseMove = (e, obj) => {

            sw_wallProbeSurface.wallFaceMove(obj);

        }

        //鼠标弹起
        this.wallmesh.mouseUp = (e, obj) => { //鼠标点击事件

            let event = e || window.event;

            let v3 = new THREE.Vector2(event.clientX, event.clientY);

            let boo = v3.equals(this.startPoint);

            if (boo) {

                if (sw_wallProbeSurface.isWallFaceJumpBoo) {

                    let realPoint1 = obj.point.clone().applyMatrix4(obj.object.matrix).applyMatrix4(c_OpenGLToDS3Mx4);

                    let realPoint = new THREE.Vector3(c_StationInfo.nx + realPoint1.x / 10,
                        c_StationInfo.ny + realPoint1.y / 10,
                        c_StationInfo.nz + realPoint1.z / 10);

                    c_wallClickRotateV3.copy(realPoint);

                    deleteAll();

                    sw_getService.getOtherPanoByFacadeID(realPoint.x, realPoint.y, realPoint.z, obj.object.name);

                } else {

                    let vp = Vector3ToVP(obj.point.clone());

                    setCameraAngle(vp.Yaw, vp.Pitch, true);

                    sw_cameraManage.setWallWheel();

                }
            }
        };

        //鼠标按下
        this.wallmesh.mouseDown = (e) => {

            let event = e || window.event;

            this.startPoint.x = event.clientX;

            this.startPoint.y = event.clientY;

        };
    }

    /**清除墙面片 */
    clearWallMesh() {
        disposeNode(this.wallmesh);
    }

}

export default SWWallFaceModule;