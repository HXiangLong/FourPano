import {
    show_HotPhotoWall_state
} from '../action';


export default function OpenHotPhotoWall(state = {
    off: false //界面是否显示
}, action) {
    switch (action.type) {
        case show_HotPhotoWall_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}