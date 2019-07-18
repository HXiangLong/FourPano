/* global THREE,$*/
import SWMarkerModule from "./SWMarkerModule";
import {
    VPToVector3
} from '../../tool/SWTool';
import SWViewGesture from '../../tool/SWViewGesture';
import * as constants from '../../tool/SWConstants';

/**
 * 多点绘面标注
 */
class SWMarkerMoreModule extends SWMarkerModule {
    /**
     * 构造函数
     * @param {SWMarkerInfo} obj 标注数据对象
     */
    constructor(obj) {

        super();

        this.config = {
            max: 0.6,
            min: 0.15,
            openness: 0.6,
            weak: -0.005
        }

        if (obj) {
            this.markerObj = obj;

            this.createPolygon(obj.points);
        }
    }

    /**
     * 创建多边形
     * @param {Array} vertices 顶点信息
     */
    createPolygon(points) {
        let holes = [],
            triangles,
            vertices = [];

        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0x06FFFF),
            depthTest: false,
            transparent: true,
            side: 2,
            alphaTest:0,
            opacity: 1
        });

        //所有点由空间坐标转三维坐标
        points.forEach((data) => {

            let v3 = VPToVector3(new SWViewGesture(parseFloat(data.yaw), parseFloat(data.pitch), 0));

            vertices.push(v3.subScalar(0.8));

        });

        this.geometry = new THREE.Geometry();

        this.geometry.vertices = vertices;

        //构建面顶点信息
        triangles = THREE.ShapeUtils.triangulateShape(vertices, holes);

        //三点构建面
        for (let i = 0; i < triangles.length; i++) {

            this.geometry.faces.push(new THREE.Face3(triangles[i][0], triangles[i][1], triangles[i][2]));

        }

        this.geometry.computeFaceNormals();

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.lookAt(constants.camera.position);
        this.mesh.name = "markerMesh";
        this.mesh.userData.depthlevel = 1;
        this.mesh.userData.markerID = this.markerObj.markerID;
        constants.scene.add(this.mesh);

        this.addMouseEvent();
    }

    update() {

        this.mesh.material.transparent = true;
        
        this.mesh.material.opacity = this.config.openness;

        this.config.openness += this.config.weak;

        if (this.config.openness <= this.config.min || this.config.openness >= this.config.max) {

            this.config.weak = -this.config.weak;

        }
    }
}

export default SWMarkerMoreModule;