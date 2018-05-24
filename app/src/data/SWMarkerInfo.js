/**
 * 标注信息
 */
class MarkerInfo {
    constructor(obj) {
        this.centerX = obj.CenterX; //标注位置
        this.centerY = obj.CenterY; //标注位置
        this.centerZ = obj.CenterZ; //标注位置
        this.markerID = obj.MarkerID; //标注ID
        this.name = obj.Name; //标注名称
        this.panoID = obj.PanoID; //标注所在的站点ID
        this.points = obj.Points == "" ? [] : JSON.parse(obj.Points); //面标注点集合
        this.type = obj.Type; //标注类型
    }
}

export default MarkerInfo;