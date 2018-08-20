//动作
import {creatAction} from 'redux-actions';

export const BACKGROUND_MUSIC_OPEN = "BACKGROUND_MUSIC_OPEN";

export const BACKGROUND_MUSIC_CLOSE = "BACKGROUND_MUSIC_CLOSE";

//Action Creator
export const background_music_open = creatAction(BACKGROUND_MUSIC_OPEN,data=>data);

export const background_music_clone = () => ({
    type: BACKGROUND_MUSIC_CLOSE,
    text
});