/**
 * 推荐展厅信息
 */
class ThumbnailsInfo {
    constructor(obj) {
        this.filePath = obj.FilePath; //图片路径
        this.name = obj.Name; //名称
        this.panoID = obj.PanoID; //对应站点编号
    }
}
export default ThumbnailsInfo;