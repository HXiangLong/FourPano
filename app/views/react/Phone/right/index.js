import PRight from './PRight'
import {
    connect
} from 'react-redux'
import {
    background_music_fun,
    show_Setting_fun,
    show_PanoMap_fun
} from '../../../redux/action'

const mapStateToProps = (state, ownProps) => {
    return {
        closeYourself: state.BGMusicOff.closeYourself,
        bgMusicOff: state.BGMusicOff.bgMusicOff,
        audioUrl: state.BGMusicOff.audioUrl,
        openPanoMapOff: state.OpenPanoMap.phoneOff
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        open_close_Audio: (flag) => {
            dispatch(background_music_fun(flag))
        },
        show_Setting:()=>{
            dispatch(show_Setting_fun({
                off:true
            }))
        },
        showPanoMap: (flag) => {
            dispatch(show_PanoMap_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PRight);