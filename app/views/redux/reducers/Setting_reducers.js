import {
    show_Setting_state
} from '../action';

export default function OpenSetting(state = false, action) {
    switch (action.type) {
        case show_Setting_state:
            return action.data;
        default:
            return state;
    }
}