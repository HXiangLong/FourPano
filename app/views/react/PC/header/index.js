import Header from './Header'
import {
    connect
} from 'react-redux'
import {
    show_help_fun,
    background_music_fun,
    show_Setting_fun,
    pano_TreeShape_fun
} from '../../../redux/action'

const mapStateToProps = (state, ownProps) => {
    return {
        closeYourself: state.BGMusicOff.closeYourself,
        bgMusicOff: state.BGMusicOff.bgMusicOff,
        audioUrl: state.BGMusicOff.audioUrl,
        panoNames:state.panoPrompt.panoNames,
        openTreeShape:state.OpenTreeShape
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        openHelp: (flag) => {
            dispatch(show_help_fun(flag))
        },
        open_close_Audio: (flag) => {
            dispatch(background_music_fun(flag))
        },
        show_Setting:()=>{
            dispatch(show_Setting_fun({
                off:true
            }))
        },
        pano_TreeShape:(flag)=>{
            dispatch(pano_TreeShape_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)