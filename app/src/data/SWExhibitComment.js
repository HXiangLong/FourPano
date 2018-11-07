//评论列表
class SWExhibitComment {

    constructor(obj) {

        this.gUID= obj.GUID;//唯一标识

        this.panoID= obj.PanoID;//站点编号

        this.exhibitID= obj.ExhibitID;//文物列表编号

        this.contents= obj.Contents;//评论文本

        this.isCheck= obj.IsCheck;//是否通过审核 传过来的都是审核通过的 0-未通过 1-通过

        this.addTime= obj.AddTime;//评论时间

        this.userID= obj.UserID;//用户ID 保留后期再开发
    }
}

export default SWExhibitComment;