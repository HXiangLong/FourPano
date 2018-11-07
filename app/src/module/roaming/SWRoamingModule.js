import * as constants from '../../tool/SWConstants';
import {
    jumpSite
} from '../../tool/SWInitializeInstance';
import initStore from '../../../views/redux/store/store';
import {
    open_roaming_fun
} from '../../../views/redux/action';
import {
    notify
} from 'reapop';

/**漫游对象类 */
class SWRoamingModule {
    constructor() {
        /**漫游累加旋转值 */
        this.roamingAngle = 0;
        /**漫游旋转速度 */
        this.roamingSpeed = 0.1;
        /**漫游跳站数量 */
        this.roamingPanoNum = 0;
        /**漫游楼层 */
        this.initialFloor = 0;
        /**漫游类别0-视频文物类 1-主要站点 2-全部站点 */
        this.roamingType = 0;
        /**当前旋转点 */
        this.currentSite = "";
        /**楼层路径集合 */
        this.floorArr = [];
        /**俯仰角 */
        this.pitchRotate = 0;
        /**俯仰角加减值 */
        this.picthAngle = 0;
    }

    /**漫游中 需要不停的更新 */
    update() {
        if (!constants.c_roamingStatus || !constants.c_JumpCompleted) {
            return;
        }

        this.picthAngle += (this.pitchRotate < 0 ? this.roamingSpeed : -this.roamingSpeed);

        this.picthAngle = (this.picthAngle > -1 && this.picthAngle < 1) ? 0 : this.picthAngle;

        if (this.roamingAngle >= 360) {

            this.roamingAngle = 0;

            this.initialFloor++;

            if (this.initialFloor >= this.floorArr.length) {

                this.initialFloor = 0;

            }

            jumpSite(this.floorArr[this.initialFloor]);
            return;
        }

        this.roamingAngle += this.roamingSpeed * constants.c_roamingMultiple;

        constants.sw_cameraManage.setOverlayViewAngle(this.roamingSpeed * constants.c_roamingMultiple, this.picthAngle);
    }

    /**查找楼层 */
    findFloor() {

        this.floorArr = [];

        let floorsMapArr = constants.c_FloorsMapTable.getValues();

        let mapmarkerArr = [];

        //查找当前属于哪个楼层的站点
        //把当前楼层排到最前面进行漫游
        floorsMapArr.forEach((obj) => {

            let mapmarker = obj.rasterMapMarkers.getValues();

            let boo = true;

            mapmarker.forEach((mapObj) => {

                if (mapObj.panoID == constants.c_StationInfo.panoID) {

                    mapmarkerArr.unshift(mapmarker);

                    boo = false;
                }
            });

            if (boo) mapmarkerArr.push(mapmarker);

        });

        let typeCode = this.roamingType == 0 ? 2 : this.roamingType == 1 ? 1 : 0;

        //根据漫游类型把所有满足的站点集合起来
        mapmarkerArr.forEach((mapObj) => {

            mapObj.forEach((item) => {

                if (item.markerTypeCode > typeCode) {

                    this.floorArr.push(item.panoID);
                }
            });

        });

        //如果当前站点不在漫游路线内  先跳转到第一站点
        //在漫游线路内 就按当前站点为起点漫游
        this.initialFloor = this.floorArr.indexOf(constants.c_StationInfo.panoID);

        if (this.initialFloor < 0) {

            this.initialFloor = 0;

            jumpSite(this.floorArr[this.initialFloor]);

        }

        this.picthAngle = this.pitchRotate = constants.sw_cameraManage.picth_Camera;
    }

    /**开始漫游 */
    StartRoaming(index) {

        constants.c_roamingStatus = true;

        this.roamingType = index;

        this.findFloor();

        let store = initStore();
        store.dispatch(open_roaming_fun({
            roamingOff: true
        }));
    }


    /**结束漫游 */
    EndRoaming() {

        if(!constants.c_roamingStatus){
            return;
        }
        constants.c_roamingStatus = false;

        this.picthAngle = 0;

        this.roamingAngle = 0;

        let store = initStore();
        store.dispatch(open_roaming_fun({
            roamingOff: false
        }));
        store.dispatch(notify({
            title: `关闭漫游。`,
            message: '',
            position: 'tc',
            status: 'success',
            dismissible: true,
            dismissAfter: 5000
        }));
    }
}

export default SWRoamingModule;