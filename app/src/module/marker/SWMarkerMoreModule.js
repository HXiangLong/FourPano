/* global THREE,$*/
import SWMarkerModule from "./SWMarkerModule";
import { VPToVector3 } from '../../tool/SWTool';
import SWViewGesture from '../../tool/SWViewGesture';
import { camera, scene } from '../../tool/SWConstants';
import initStore from '../../../views/PC/redux/store/store';
import {
    show_Iframe_fun
} from '../../../views/PC/redux/action';

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

        this.mouseDownBoo = false;

        if (obj) {
            this.markerObj = obj;

            this.createPolygon(obj.points);

            this.addMouseEvent();
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

        //所有点由空间坐标转三维坐标
        points.map((data) => {

            let v3 = VPToVector3(new SWViewGesture(data.yaw, parseFloat(data.pitch) + 20, 0));

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

        this.material = new THREE.MeshLambertMaterial({
            color: 0x06FFFF,
            depthTest: true,
            transparent: true,
            colorWrite: true,
            side: 2,
            opacity: 0.5
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.lookAt(camera.position);

        this.mesh.name = "markerMesh";

        this.mesh.userData.depthlevel = 1;

        scene.add(this.mesh);
    }

    /**
     * 添加鼠标事件
     */
    addMouseEvent() {

        this.mesh.mouseDown = (e, obj) => {

            this.mouseDownBoo = true;

        };

        this.mesh.mouseUp = (e, obj) => {

            if (this.mouseDownBoo) {

                this.mouseDownBoo = false;

                console.log("鼠标弹起啦~~~~~" + this.markerObj.name);

                		let store = initStore();
		store.dispatch(show_Iframe_fun({
            iframeOff: true,
            iframeUrl: "http://192.168.10.63:8090/GZXHGM/DigitalMusService/BusinessData/ExhibitDetails/3DModel/001.html"
        }));
            }

        };

        //鼠标进入
        this.mesh.mouseOver = (e, obj) => {

            this.showTextDiv(obj, this.markerObj.name);

        }

        //出去
        this.mesh.mouseOut = (e, obj) => {

            this.hideTextDiv();

        }

    }
}

export default SWMarkerMoreModule;