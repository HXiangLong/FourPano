import { Vector3 } from 'three';
/**
 * 点云面片数据
 */
class FacadeByPanoIDInfo {
    constructor(obj) {
        this.facadeID = obj.FacadeID; //面片编号
        this.points = []; //面片数组集合
        this.points.p1 = new Vector3(obj.Points[0].X, obj.Points[0].Y, obj.Points[0].Z);
        this.points.p2 = new Vector3(obj.Points[1].X, obj.Points[1].Y, obj.Points[1].Z);
        this.points.p3 = new Vector3(obj.Points[2].X, obj.Points[2].Y, obj.Points[2].Z);
        this.points.p4 = new Vector3(obj.Points[3].X, obj.Points[3].Y, obj.Points[3].Z);
        this.type = obj.Type; //面片类型
        this.nx = obj.X; //面片中心点
        this.ny = obj.Y; //面片中心点
    }
}
export default FacadeByPanoIDInfo;