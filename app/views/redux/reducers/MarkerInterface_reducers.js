import {
    show_MarkerInterface_state
} from '../action';

/**
 * 标注展示界面
 * @param {*} state off-开关 exhibitID-详情界面编号 imglist-图片列表 title-文本标题 content-文本内容 likeNum-喜欢数 commentList-评论列表
 * @param {*} action 
 */
export default function OpenMarkerInterface(state = {
    off: false,
    exhibitID: "",
    imglist: [],
    title: "",
    content: "",
    likeNum: 9,
    commentList: ["啊实打实大所多按时达到阿萨德按时", "文琪奥无所大所大所大硕大的阿打算达到安定啊", "啊实打实的啊实打实大师大师啊", "qqqqqqqqqq", "qwertyuiop[]dasdfghk", "sd", "111112222", "啊实打实大所多按时达到阿萨德按时", "文琪奥无所大所大所大硕大的阿打算达到安定啊", "啊实打实的啊实打实大师大师啊", "qqqqqqqqqq", "qwertyuiop[]dasdfghk", "sd", "111112222"],
    links: "",
    d3: "",
    book: "",
    video: "",
    audio: ""
}, action) {
    switch (action.type) {
        case show_MarkerInterface_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}