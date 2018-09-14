import {
    show_PanoMap_state
} from '../action';

export default function OpenPanoMap(state = false, action) {
    switch (action.type) {
        case show_PanoMap_state:
            return action.data;
        default:
            return state;
    }
}