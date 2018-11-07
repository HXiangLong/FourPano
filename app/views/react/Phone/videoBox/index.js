import PVideoBox from './PVideoBox'
import {
    connect
} from 'react-redux'
import {
    show_VideoBox_fun,
    background_music_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        bgMusicOff: state.BGMusicOff.bgMusicOff,
        off: state.OpenVideoBox.off,
        videoUrl: state.OpenVideoBox.videoUrl,
        videoOff: state.OpenVideoBox.videoOff,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closeVideoBox: (flag) => {
            dispatch(show_VideoBox_fun(flag))
        },
        open_close_Audio: (flag) => {
            dispatch(background_music_fun(flag))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PVideoBox);