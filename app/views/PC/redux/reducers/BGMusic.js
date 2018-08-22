import {
    background_music_state
} from '../action';

export default function BGMusicOff(state = {
    bgMusicOff: true,
    audioUrl: ""
}, action) {
    switch (action.type) {
        case background_music_state:
            return Object.assign({},state,action.data);
        default:
            return state;
    }
}