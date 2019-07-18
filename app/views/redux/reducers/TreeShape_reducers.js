import {
    pano_TreeShape_state
} from '../action';

export default function OpenTreeShape(state = true, action) {
    switch (action.type) {
        case pano_TreeShape_state:
            return action.data;
        default:
            return state;
    }
}