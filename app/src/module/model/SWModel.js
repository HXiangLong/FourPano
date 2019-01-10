import * as constants from '../../tool/SWConstants';
import HashTable from '../../tool/SWHashTable';
require('../../libs/OBJLoader');
require('../../libs/MTLLoader');

class SWModel {
    constructor() {
        this.model;
        this.startPoint = new THREE.Vector2(0, 0);
        this.panoPoint = [[-443.49,-99.52],[-451.48,-181.64]];
    }

    onProgress(xhr) {
        if (xhr.lengthComputable) {
            let percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    }

    onError() {}

    init() {
        let url = `${constants.sw_getService.resourcesUrl}/BusinessData/ExhibitDetails/model/`;
        new THREE.MTLLoader().setPath(url).setCrossOrigin('Anonymous').load('1.mtl', (materials) => {
            materials.preload();
            materials.polygonOffset = true; //开启偏移
            materials.polygonOffsetFactor = -1.0; //与相机距离减1
            materials.polygonOffsetUnits = -4.0; //偏移的单位

            new THREE.OBJLoader().setMaterials(materials).setPath(url).load(
                '1.obj',
                (object) => {
                    this.model = object;

                    this.model.position.y = -70;

                    this.model.scale.set(3, 3, 3);

                    constants.scene.add(this.model);

                    // let box = new THREE.Box3().setFromObject(this.model);
                    constants.camera.position.x = -443.49;
                    constants.camera.position.z = -99.52;

                    // console.log('====================================');
                    // console.log(box);
                    // console.log('====================================');

                    this.addMouseEvent();
                    this.initPoint();
                },
                this.onProgress,
                this.onError
            );
        });
    }

    initPoint() {
        // let points = constants.sw_GetSQLData.GetPanoByIDTable.getValue(constants.c_StationInfo.panoID);
        // let pointArr = constants.sw_GetSQLData.GetPanoByIDTable.getValues();
        // let table = new HashTable();
        // pointArr.forEach((item) => {
        //     //所有点相对于第一个点的点位
        //     let xdpoint = new THREE.Vector3(
        //         parseFloat(item.X) - parseFloat(points.X),
        //         parseFloat(item.Y) - parseFloat(points.Y),
        //         parseFloat(item.Z) - parseFloat(points.Z)
        //     );
        //     table.add(item.ImageID, xdpoint.applyMatrix4(constants.c_DS3ToOpenGLMx4));
        // });

        // let ppp = table.getValues();
        // let boxs = new THREE.Group();
        this.panoPoint.forEach((item, idx) => {
            let geometry = new THREE.BoxBufferGeometry(5, 5, 5);
            let material = new THREE.MeshNormalMaterial();

            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = item[0];
            mesh.position.y = -45;
            mesh.position.z = item[1];
            mesh.userData.panoID = idx;
            
            constants.scene.add(mesh);

            mesh.mouseUp = (e, obj) => {
                console.log('====================================');
                console.log(obj);
                console.log('====================================');
            };
        });
        // boxs.rotation.y = THREE.Math.degToRad(-90);
        // this.model.add(boxs);
    }

    addMouseEvent() {
        this.model.mouseDown = (e, obj) => {
            this.mouseDownBoo = true;

            this.startPoint.x = e.clientX;

            this.startPoint.y = e.clientY;
        };

        this.model.mouseUp = (e, obj) => {
            if (this.mouseDownBoo) {
                let v3 = new THREE.Vector2(e.clientX, e.clientY);

                let boo = v3.equals(this.startPoint);

                this.mouseDownBoo = false;

                if (boo) {
                    console.log('====================================');
                    console.log(obj.point);
                    console.log('====================================');
                    constants.camera.position.x = obj.point.x;
                    constants.camera.position.z = obj.point.z;
                }
            }
        };
    }
}
export default SWModel;