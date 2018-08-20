//reducer是根据action来返回一个全新state的纯函数。
function BGMusic(state, action) {
    switch (action.type) {
        case "BACKGROUND_MUSIC_OPEN":
            return [
                ...state,
                {
                    text: action.text
                }
            ]
        default:
            return state;
    }
}

export default BGMusic;