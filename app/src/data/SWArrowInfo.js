/* global THREE*/

import {
    c_StationInfo,
    sw_GetSQLData
} from '../tool/SWConstants';
import {
    getArrowsAngle
} from '../tool/SWTool'
/**
 * 新老箭头数据
 */
class ArrowData {
    /**
     * 箭头构造函数
     * @param {*} obj 服务器穿过来的数据
     * @param {*} type 1-老箭头 2-新箭头 3-点链接信息
     */
    constructor(obj, type) {

        if (type == 1) {

            this.dstPanoID = obj.DstImageID; //目标站点编号

            this.dstPanoName = obj.DstName; //目标站点名称

            this.srcPanoID = obj.SrcImageID; //当前站点编号

            this.nX = obj.X; //世界坐标位置

            this.nY = obj.Y; //世界坐标位置

            this.nZ = obj.Z; //世界坐标位置

            this.angle = -90 - getArrowsAngle(c_StationInfo.point.clone(), new THREE.Vector3(obj.X, obj.Y, obj.Z)); //偏移世界角度 

        } else if (type == 2) {

            this.linkID = obj.LinkID; //标识ID

            this.srcPanoID = obj.SrcPanoID; //当前站点

            this.dstPanoID = obj.DstPanoID; //下一站点

            this.yaw = obj.Yaw; //箭头位置yaw

            this.pitch = obj.Pitch; //箭头位置pitch

            this.dstPanoName = obj.DstPanoName; //箭头名称

        } else if (type == 3) {

            this.linkID = obj.LinkID; //标识ID

            this.srcPanoID = obj.SrcImageName; //当前站点

            this.dstPanoID = obj.DstImageName; //下一站点

            this.yaw = obj.Yaw; //箭头位置yaw

            this.pitch = obj.Pitch; //箭头位置pitch

            this.dstPanoName = obj.DstName ? obj.DstName : ""; //箭头名称

            let srcPoint = sw_GetSQLData.GetPanoByIDFun(obj.SrcImageName); //当前点信息

            let desPoint = sw_GetSQLData.GetPanoByIDFun(obj.DstImageName); //目标点信息

            let pointV3 = new THREE.Vector3(srcPoint.X + (desPoint.X - srcPoint.X), srcPoint.Y + (desPoint.Y - srcPoint.Y), srcPoint.Z + (desPoint.Z - srcPoint.Z));

            this.nX = pointV3.x; //世界坐标位置

            this.nY = pointV3.y; //世界坐标位置

            this.nZ = pointV3.z; //世界坐标位置

            this.angle = -90 - getArrowsAngle(c_StationInfo.point.clone(), new THREE.Vector3(this.nX, this.nY, this.nZ)); //偏移世界角度

        }
    }
}

export default ArrowData;