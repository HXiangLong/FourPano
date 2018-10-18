import {
    show_Iframe_state
} from '../action';

export default function OpenIframe(state = {
    iframeOff: false,
    iframeUrl: ""
}, action) {
    switch (action.type) {
        case show_Iframe_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}