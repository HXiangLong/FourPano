import {
    show_Introduction_state
} from '../action';

export default function OpenIntroduction(state = {
    off: true,
    imgurl: "",
    title: "",
    content: "",
    brightness:0//屏幕亮度调节 偷懒写这里了
}, action) {
    switch (action.type) {
        case show_Introduction_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}