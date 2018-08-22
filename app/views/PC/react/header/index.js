import Header from './Header'
import {
    connect
} from 'react-redux'
import {
    show_help_fun,
    background_music_fun
} from '../../redux/action'

const mapStateToProps = (state, ownProps) => {
    return {
        bgMusicOff: state.BGMusicOff.bgMusicOff,
        audioUrl:state.BGMusicOff.audioUrl
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        openHelp: (flag) => {
            dispatch(show_help_fun(flag))
        },
        open_close_Audio:(flag)=>{
            dispatch(background_music_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)