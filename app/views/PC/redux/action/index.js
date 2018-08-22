//动作
import {
    creatAction
} from 'redux-actions';

/**背景音乐状态标识 */
export const background_music_state = 'BACKGROUND_MUSIC_STATE';

/**显示帮助界面状态标识 */
export const show_help_state = 'SHOW_HELP_STATE';

//Action Creator
/**背景音乐方法 */
export const background_music_fun = (datas)=>{
    return {
        type:background_music_state,
        data:datas
    }
}

/**帮助界面显示方法 */
export const show_help_fun = function(datas){
    return {
        type:show_help_state,
        data:datas
    }
}