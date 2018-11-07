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
/**显示复杂版简介 */
export const show_IntroductionComplex_state = 'SHOW_INTRODUCTIONCOMPLEX_STATE';
/**显示推荐展厅 */
export const show_Thumbnails_state = 'SHOW_THUMBNAILS_STATE';
/**文物墙 */
export const show_HotPhotoWall_state = 'SHOW_HOTPHOTOWALL_STATE';
/**显示小地图 */
export const show_PanoMap_state = 'SHOW_PANOMAP_STATE';
/**显示标注界面 */
export const show_MarkerInterface_state = 'SHOW_MARKERINTERFACE_STATE';
/**视频弹出框 */
export const show_VideoBox_state = 'SHOW_VIDEOBOX_STATE';
/**查看大图界面 */
export const show_ViewPicture_state = 'SHOW_VIEWPICTURE_STATE';
/**评论界面 */
export const show_ReviewInput_state = 'SHOW_REVIEWINPUT_STATE';
/**友情链接界面 */
export const show_OtherLinks_state = 'SHOW_OTHERLINKS_STATE';
/**漫游是否开启 */
export const open_roaming_state = 'OPEN_ROAMING_STATE';
/**显示设置界面 */
export const show_Setting_state = 'SHOW_SETTING_STATE';
/**各种提示文本 */
export const pano_prompt_state = 'PANO_PROMPT_STATE';
/**目录树 */
export const pano_TreeShape_state = 'PANO_TREESHAPE_STATE';

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

/** 弹出iframe窗口*/
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

/**复杂简介界面 */
export const show_IntroductionComplex_fun = function (datas) {
    return {
        type: show_IntroductionComplex_state,
        data: datas
    }
}

/**推荐展厅 */
export const show_Thumbnails_fun = function (datas) {
    return {
        type: show_Thumbnails_state,
        data: datas
    }
}

/**显示照片墙 */
export const show_HotPhotoWall_fun = function (datas) {
    return {
        type: show_HotPhotoWall_state,
        data: datas
    }
}

/**显示小地图 */
export const show_PanoMap_fun = function (datas) {
    return {
        type: show_PanoMap_state,
        data: datas
    }
}

/**显示标注界面 */
export const show_MarkerInterface_fun = function (datas) {
    return {
        type: show_MarkerInterface_state,
        data: datas
    }
}

/**视频弹出框 */
export const show_VideoBox_fun = function (datas) {
    return {
        type: show_VideoBox_state,
        data: datas
    }
}

/**查看大图 */
export const show_ViewPicture_fun = function (datas) {
    return {
        type: show_ViewPicture_state,
        data: datas
    }
}

/**显示评论框 */
export const show_ReviewInput_fun = function (datas) {
    return {
        type: show_ReviewInput_state,
        data: datas
    }
}

/**友情链接 */
export const show_OtherLinks_fun = function(datas) {
    return {
        type: show_OtherLinks_state,
        data: datas
    }
}

/**漫游 */
export const open_roaming_fun = function(datas){
    return {
        type: open_roaming_state,
        data: datas
    }
}

/**设置 */
export const show_Setting_fun = function(datas){
    return {
        type: show_Setting_state,
        data: datas
    }
}

/**各种提示文本显示 */
export const pano_prompt_fun = function(datas){
    return {
        type:pano_prompt_state,
        data:datas
    }
}

/**目录树 */
export const pano_TreeShape_fun = function(datas){
    return {
        type:pano_TreeShape_state,
        data:datas
    }
}

