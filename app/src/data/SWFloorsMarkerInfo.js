/**
 * 楼层点的信息
 */
class FloorsMarkerInfo {

    constructor(obj) {

        this.markerID = obj.MarkerID; //主键编号（第一个编号有用）

        this.names = obj.Name; //名称

        this.rasterMapID = obj.RasterMapID; //楼层编号

        this.markerTypeCode = obj.MarkerTypeCode; //类型 可扩展 1-普通 2-热点 3-视频

        this.panoID = obj.PanoID; //对应的站点id

        this.pixShapeX = obj.PixShapeX; //在小地图的坐标位置 图片尺寸是1920x1500

        this.pixShapeY = obj.PixShapeY; //在小地图的坐标位置
        
        this.markerContent = obj.MarkerContent; //对应页面中心的名称显示
    }
}

export default FloorsMarkerInfo;