/* global THREE*/

/**
 * 站点信息
 */
class StationInfo {
    constructor(obj) {
        this.panoID = obj.ImageID; //站点编号;
        this.yaw = (90 + obj.Yaw + 360) % 360; //站点需要调整的yaw
        this.pitch = obj.Pitch; //站点需要调整的pitch
        this.roll = obj.Roll; //站点需要调整的roll
        this.nx = obj.X; //相对于所有站点所在的坐标X
        this.ny = obj.Y; //相对于所有站点所在的坐标Y
        this.nz = obj.Z; //相对于所有站点所在的坐标Y
        this.point = new THREE.Vector3(obj.X, obj.Y, obj.Z); //在3DS坐标系中的位置
    }
}
export default StationInfo;