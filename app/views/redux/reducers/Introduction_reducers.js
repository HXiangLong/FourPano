import {
    show_Introduction_state
} from '../action';

export default function OpenIntroduction(state = {
    off: false,
    imgurl: "",
    title: "",
    content: ""
}, action) {
    switch (action.type) {
        case show_Introduction_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}