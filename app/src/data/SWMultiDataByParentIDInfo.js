/**
 * 单个文物显示信息
 * @param {Object} obj 
 */
class MultiDataByParentID {

    constructor(obj) {

        this.displayPriority = obj.DisplayPriority; //显示的优先级

        this.fileExt = obj.FileExt; //文件类型（JPG png）

        this.filePath = obj.FilePath; //图片地址

        this.multiID = obj.MultiID; //数据库表编号

        this.parentID = obj.ParentID; //对应着 AllExhibitsForBuilding.exhibitID
        
        this.typeCode = obj.TypeCode; //显示类型

        this.thumbnail = "";//缩略图

        this.phoneMax = "";//手机大图

        this.PCMax = "";//PC版大图

    }
}

export default MultiDataByParentID;