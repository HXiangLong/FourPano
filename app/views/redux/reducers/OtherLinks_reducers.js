import {
    show_OtherLinks_state
} from '../action';

export default function OpenOtherLinks(state = false, action) {
    switch (action.type) {
        case show_OtherLinks_state:
            return action.data;
        default:
            return state;
    }
}