import {
    show_Thumbnails_state
} from '../action';

export default function OpenThumbnails(state = false, action) {
    switch (action.type) {
        case show_Thumbnails_state:
            return action.data;
        default:
            return state;
    }
}