import {
    show_ViewPicture_state
} from '../action';

/**
 * 标注展示界面
 * @param {*} state off-开关 idx-第一次看的图片 imageList-展示图片列表 thumbs-缩略图列表 titles-标题 captions-介绍内容
 * @param {*} action  
 */
export default function OpenViewPicture(state = {
    off: false,
    idx: 0,
    imageList: [],
    thumbs: [],
    titles: [],
    captions: []
}, action) {
    switch (action.type) {
        case show_ViewPicture_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}