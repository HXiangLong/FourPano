import {
    show_PanoMap_state
} from '../action';

export default function OpenPanoMap(state = {
    off: false,
    phoneOff:false,
    radarAngle: 0,
    pID: ""
}, action) {
    switch (action.type) {
        case show_PanoMap_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}