/* global THREE*/

import { c_stationInfo } from '../tool/SWConstants';
import { getArrowsAngle } from '../tool/SWTool'
/**
 * 新老箭头数据
 */
class ArrowData {
    /**
     * 箭头构造函数
     * @param {*} obj 服务器穿过来的数据
     * @param {*} type 1-老箭头 2-新箭头
     */
    constructor(obj, type) {
        if (type == 1) {
            this.dstPanoID = obj.DstImageID; //目标站点编号
            this.dstPanoName = obj.DstName; //目标站点名称
            this.srcPanoID = obj.SrcImageID; //当前站点编号
            this.angle = -90 - getArrowsAngle(c_stationInfo.point.clone(), new THREE.Vector3(obj.X, obj.Y, obj.Z)); //偏移世界角度        
        } else if (type == 2) {
            this.linkID = obj.LinkID; //标识ID
            this.srcPanoID = obj.SrcPanoID; //当前站点
            this.dstPanoID = obj.DstPanoID; //下一站点
            this.yaw = obj.Yaw; //箭头位置yaw
            this.pitch = obj.Pitch; //箭头位置pitch
            this.dstPanoName = obj.DstPanoName; //箭头名称
        }
    }
}

export default ArrowData;