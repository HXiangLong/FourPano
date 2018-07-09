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
        this.type = obj.Type; //标注类型 1-图文 2-高清大图 3-三维 4-视频 5-书籍 6-音频 7-环拍 998-地面跳点 999-天空跳站点
    }
}

export default MarkerInfo;