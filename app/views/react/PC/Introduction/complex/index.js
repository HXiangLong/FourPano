import IntroductionComplex from './IntroductionComplex';
import {
    connect
} from 'react-redux';
import {
    show_IntroductionComplex_fun,
    background_music_fun
} from '../../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenIntroductionComplex.off,
        // bgUrl: state.OpenIntroductionComplex.imgurl,
        // title: state.OpenIntroductionComplex.title,
        // content: state.OpenIntroductionComplex.content,
        // bird: state.OpenIntroductionComplex.content,
        // pic: state.OpenIntroductionComplex.content,
        // mapPic: state.OpenIntroductionComplex.content,
        // videos: state.OpenIntroductionComplex.content,
        // baiduMap: state.OpenIntroductionComplex.content,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        IntroductionState: (flag) => {
            dispatch(show_IntroductionComplex_fun(flag))
        },
        open_close_Audio: (flag) => {
            dispatch(background_music_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionComplex)