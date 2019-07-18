//所有文物列表
class AllExhibitsForBuilding {

    constructor(obj) {

        this.buildingID = obj.BuildingID; //建筑ID

        this.description = obj.Description; //说明

        this.displayPriority = obj.DisplayPriority; //显示优先级

        this.exhibitID = obj.ExhibitID; //编号

        this.filePath = obj.FilePath; //缩略图地址

        this.floorID = obj.FloorID; //楼层ID

        this.have3D = obj.Have3D; //是否有3维

        this.markerID = obj.MarkerID.split('|'); //标注ID

        this.museumID = obj.MuseumID; //博物馆ID

        this.name = obj.Name; //名称

        this.panoID = obj.PanoID; //站点编号

        this.sceneID = obj.SceneID; //楼栋号

        this.featuresList = obj.FeaturesList.split('|');//文物列表功能格式为 三维|视频|音频|书籍|链接

        this.likes = obj.Likes;//喜爱数

        this.commentNum = 0;//评论总数

        this.commentTable = undefined;//评论集合
    }
}

export default AllExhibitsForBuilding;