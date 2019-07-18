/**视频数据 */
class VideosData {

    constructor(obj) {

        this.panoID = obj.PanoID; //站点ID

        this.videoName = obj.VideoName; //视频名称
        
        this.details = obj.Details; //文件类型（json）
    }
}
export default VideosData;