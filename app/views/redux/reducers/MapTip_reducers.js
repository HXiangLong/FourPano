import {
    show_maptipbox_state
} from '../action';

export default function OpenMapTip(state = {
    off:false,//界面是否显示
    phoneOff:false,//是否是手机版提示
    imgUrl:"",
    floorsMapData:null
}, action) {
    switch (action.type) {
        case show_maptipbox_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}