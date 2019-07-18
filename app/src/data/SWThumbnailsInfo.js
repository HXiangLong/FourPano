/**
 * 推荐展厅信息
 */
class ThumbnailsInfo {

    constructor(obj) {

        this.filePath = obj.FilePath; //图片路径

        this.name = obj.Name; //名称

        this.panoID = obj.PanoID; //对应站点编号

        this.sceneID = obj.SceneID; //对应场景ID
        
        this.floorID = obj.FloorID; //对应场景ID

        this.displayPriority = obj.DisplayPriority; //对应优先级 1-按照楼层（展厅来） 2-按照站点来
    }
}
export default ThumbnailsInfo;