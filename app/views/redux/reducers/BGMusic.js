import {
    background_music_state
} from '../action';

export default function BGMusicOff(state = {
    closeYourself: true, //自己关闭背景音乐
    bgMusicOff: true, //其他程序关闭背景音乐
    audioUrl: "" //声音地址
}, action) {
    switch (action.type) {
        case background_music_state:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}