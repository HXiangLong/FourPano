//动作
import {
    creatAction
} from 'redux-actions';

/**背景音乐状态标识 */
export const background_music_state = 'BACKGROUND_MUSIC_STATE';
/**显示帮助界面状态标识 */
export const show_help_state = 'SHOW_HELP_STATE';
/**显示小地图帮助界面 */
export const show_maptipbox_state = 'SHOW_MAPTIPBOX_STATE';
/**弹出iframe窗口 */
export const show_Iframe_state = 'SHOW_IFRAME_STATE';
/**显示简介界面 */
export const show_Introduction_state = 'SHOW_INTRODUCTION_STATE';

//Action Creator
/**背景音乐方法 */
export const background_music_fun = (datas) => {
    return {
        type: background_music_state,
        data: datas
    }
}

/**帮助界面显示方法 */
export const show_help_fun = function (datas) {
    return {
        type: show_help_state,
        data: datas
    }
}

/**小地图帮助显示方法 */
export const show_maptipbox_fun = function (datas) {
    return {
        type: show_maptipbox_state,
        data: datas
    }
}

/**
 * 弹出iframe窗口
 * @param {*} datas 
 */
export const show_Iframe_fun = function (datas) {
    return {
        type: show_Iframe_state,
        data: datas
    }
}
/**简介界面 */
export const show_Introduction_fun = function (datas) {
    return {
        type: show_Introduction_state,
        data: datas
    }
}