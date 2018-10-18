import {
    show_VideoBox_state
} from '../action';

/**
 * 标注展示界面
 * @param {*} state off-开关 videoUrl-视频类别
 * @param {*} action 
 */
export default function OpenVideoBox(state = {
    off: false,
    videoUrl: "01wuchangqiyidebaofa.mp4",
    videoOff:true
}, action) {
    switch (action.type) {
        case show_VideoBox_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}