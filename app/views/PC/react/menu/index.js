import MainMenu from './MainMenu';
import {
    connect
} from 'react-redux';
import {
    show_Introduction_fun,
    show_Thumbnails_fun,
    show_HotPhotoWall_fun,
    show_PanoMap_fun
} from '../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenIntroduction.off,
        OpenThumbnails: state.OpenThumbnails,
        openPanoMapOff:state.OpenPanoMap.off
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        IntroductionState: (flag) => {
            dispatch(show_Introduction_fun(flag))
        },
        closeThumbnails: () => {
            dispatch(show_Thumbnails_fun(false))
        },
        showThumbnails: () => {
            dispatch(show_Thumbnails_fun(true))
        },
        showHotPhotoWall: (flag) => {
            dispatch(show_HotPhotoWall_fun(flag))
        },
        showPanoMap: (flag) => {
            dispatch(show_PanoMap_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);