import {
    show_ReviewInput_state
} from '../action';

export default function OpenReviewInput(state = {
    off: false,
    exhibitID: ""
}, action) {
    switch (action.type) {
        case show_ReviewInput_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}