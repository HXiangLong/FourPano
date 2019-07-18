import {
    show_Setting_state
} from '../action';

export default function OpenSetting(state = {
    off:false,
    brightness:0
}, action) {
    switch (action.type) {
        case show_Setting_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}