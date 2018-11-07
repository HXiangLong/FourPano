import {
    pano_prompt_state
} from '../action';

export default function panoPrompt(state = {
    panoNames:""
}, action) {
    switch (action.type) {
        case pano_prompt_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}