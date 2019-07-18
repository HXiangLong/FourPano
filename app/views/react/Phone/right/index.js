import PRight from './PRight'
import {
    connect
} from 'react-redux'
import {
    background_music_fun,
    show_Setting_fun
} from '../../../redux/action';
import {
    notify
} from 'reapop';

const mapStateToProps = (state, ownProps) => {
    return {
        closeYourself: state.BGMusicOff.closeYourself,
        bgMusicOff: state.BGMusicOff.bgMusicOff,
        audioUrl: state.BGMusicOff.audioUrl
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        open_close_Audio: (flag) => {
            dispatch(background_music_fun(flag))
        },
        show_Setting: () => {
            dispatch(show_Setting_fun({
                off: true
            }))
        },
        OpenPrompt: (str) => {
            dispatch(notify({
                title: str,
                message: '',
                position: 'tc',
                status: 'success',
                dismissible: true,
                dismissAfter: 3000
            }));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PRight);