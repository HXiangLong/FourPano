import {
    open_roaming_state
} from '../action';

export default function OpenRoaming(state = {
    boxOff:false,
    roamingOff:false
}, action) {
    switch (action.type) {
        case open_roaming_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}