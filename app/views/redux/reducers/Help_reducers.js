import {
    show_help_state
} from '../action';

export default function OpenHelp(state = false, action) {
    switch (action.type) {
        case show_help_state:
            return action.data;
        default:
            return state;
    }
}