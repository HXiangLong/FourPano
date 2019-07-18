import {
    show_IntroductionComplex_state
} from '../action';

export default function OpenIntroductionComplex(state = {
    off: false,
    // bgUrl: "",
    // title: "",
    // content: "",
    // bird: [],
    // pic: [],
    // mapPic: [],
    // videos: "",
    // baiduMap: ""
}, action) {
    switch (action.type) {
        case show_IntroductionComplex_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}