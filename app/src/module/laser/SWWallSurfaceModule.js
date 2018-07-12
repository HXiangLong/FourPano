/* global THREE*/

import {
    scene,
    camera,
    c_Minfov,
    c_Maxfov
} from '../../tool/SWConstants';
import {
    TextDiv,
    getJudgeOrZoom,
    getWorldToScene,
    getProbeSurfaceDistance,
    getWallProbeSurfaceAngle
} from '../../tool/SWTool';
const external = require('../../tool/SWExternalConst');

/**
 * 墙面探面
 */
class SWWallSurfaceModule {
    constructor() {
        /**墙探面对象 */
        this.wallFaceMash = undefined;
        /**放大标识 */
        this.plusSign = undefined;
        /**缩小标识 */
        this.minusSign = undefined;
        /**地探面对象 */
        this.groundFaceMash = undefined;
        /**地探面距离 */
        this.groundDisplaySize = -500;
        /**探面距离显示框 */
        this.textDiv = new TextDiv(new THREE.Vector3(0, 0, 0));
        /**地面片是否可以跳转 */
        this.isgroundFaceJumpBoo = false;
        /**墙面是否可以跳转 */
        this.isWallFaceJumpBoo = false;

        this.createWallMash();

        this.createGroundMash();
    }

    /**创建墙面片 */
    createWallMash() {
        let material = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            depthTest: false,
            side: 2,
            transparent: true,
            opacity: 0.3
        });
        let geometry = new THREE.PlaneGeometry(200, 123.6);
        this.wallFaceMash = new THREE.Mesh(geometry, material);
        this.wallFaceMash.name = "wallFaceMash";
        this.wallFaceMash.userData.depthlevel = 4;
        scene.add(this.wallFaceMash);

        let texture = new THREE.TextureLoader().load(external.plusSign_icon);
        texture.needsUpdate = true;
        material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1,
            depthTest: false,
            side: 2
        });

        geometry = new THREE.PlaneGeometry(32 * 0.3, 32 * 0.3, 1, 1);

        this.plusSign = new THREE.Mesh(geometry, material);
        this.plusSign.name = "plusSign";
        this.plusSign.userData.depthlevel = 5;
        this.plusSign.position.copy(new THREE.Vector3(-(200 - 32 * 0.5) * 0.5, -(123.6 - 32 * 0.5) * 0.5, 2));
        this.wallFaceMash.add(this.plusSign);

        texture = new THREE.TextureLoader().load(external.minusSign_icon);
        texture.needsUpdate = true;
        material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1,
            depthTest: false,
            side: 2
        });

        geometry = new THREE.PlaneGeometry(32 * 0.3, 32 * 0.3, 1, 1);

        this.minusSign = new THREE.Mesh(geometry, material);
        this.minusSign.name = "minusSign";
        this.minusSign.userData.depthlevel = 5;
        this.minusSign.position.copy(new THREE.Vector3(-(200 - 32 * 0.5) * 0.5, -(123.6 - 32 * 0.5) * 0.5, 2));
        this.wallFaceMash.add(this.minusSign);

        this.wallFaceMash.visible = false;
    }

    /**创建地面片 */
    createGroundMash() {
        let material = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            emissive: 0xFFFFFF,
            depthTest: true,
            side: 2,
            transparent: true,
            opacity: 0.4
        });
        let geometry = new THREE.CircleGeometry(250, 32);
        this.groundFaceMash = new THREE.Mesh(geometry, material);
        this.groundFaceMash.userData.depthlevel = 4;
        this.groundFaceMash.name = "groundFace";
        scene.add(this.groundFaceMash);
        this.groundFaceMash.visible = false;
        this.groundFaceMash.rotation.x = THREE.Math.degToRad(90);
    }

    /**
     * 探面类型显示
     * @param {Number} wallType 0-都不显示 1-显示墙面 2-显示地面
     * @param {Number} zoomType 0-不缩放、要跳转 1-放大 2-缩小
     */
    wallProbeSurfaceVisible(wallType, zoomType) {

        this.wallFaceMash.visible = (wallType === 1);

        this.groundFaceMash.visible = (wallType === 2);

        this.textDiv.style.display = this.groundFaceMash.visible ? "block" : "none";

        this.plusSign.visible = (zoomType === 1);

        this.minusSign.visible = (zoomType === 2);
    }

    /**
     * 地面片上移动
     * @param {Object} obj 射线返回对象
     */
    groundFaceMove(obj) {

        this.isgroundFaceJumpBoo = getJudgeOrZoom(obj, 1);

        if (this.isgroundFaceJumpBoo) {

            this.wallProbeSurfaceVisible(2);

            this.groundFaceMash.position.copy(new THREE.Vector3(obj.point.x, obj.point.y + 50, obj.point.z));

            this.textDiv.style.display = "block";

            var labelPos = getWorldToScene(obj.point);

            this.textDiv.style.left = (labelPos.x - 30) + "px";

            this.textDiv.style.top = (labelPos.y - 40) + "px";

            this.textDiv.innerHTML = "前进 " + this.xround(getProbeSurfaceDistance(obj), 2) + " 米";

        } else {

            this.wallProbeSurfaceVisible(0);

        }
    }

    /**
     * 鼠标在墙面片上移动
     * @param {Object} obj 墙面片对象
     */
    wallFaceMove(obj) {

        this.wallFaceMash.position.copy(obj.point);

        let angle = getWallProbeSurfaceAngle(obj);

        this.wallFaceMash.rotation.y = THREE.Math.degToRad(angle > 180 ? angle - 90 : angle + 90);

        this.isWallFaceJumpBoo = getJudgeOrZoom(obj, 2);

        if (!this.isWallFaceJumpBoo) {

            if (camera.fov != c_Minfov) {

                this.wallProbeSurfaceVisible(1, 1);

            } else {

                this.wallProbeSurfaceVisible(1, 2);

            }

        } else {
            this.wallProbeSurfaceVisible(1, 0);
        }

        let fov = camera.fov / c_Maxfov; //相机缩放比例

        let dis = (obj.distance - 14) * 0.0015; //0.008是每一米对应缩放比例

        dis = dis < 0.05 ? 0.05 : dis; //0.05是最小缩放比例

        dis = dis > 3 ? 3 : dis; //3是最大缩放比例

        this.wallFaceMash.scale.set(dis * fov, dis * fov, dis * fov); //缩放

        if (camera.fov === c_Minfov) {
            this.wallProbeSurfaceVisible(0, 0);
        }
    }


    xround(x, num) {

        return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);

    }

}

export default SWWallSurfaceModule;