import MainMenu from './MainMenu';
import {
    connect
} from 'react-redux';
import {
    show_Introduction_fun,
    show_Thumbnails_fun,
    show_HotPhotoWall_fun,
    show_PanoMap_fun,
    show_OtherLinks_fun,
    open_roaming_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenIntroduction.off,
        brightness:state.OpenIntroduction.brightness,
        OpenThumbnails: state.OpenThumbnails,
        openPanoMapOff: state.OpenPanoMap.off,
        openRoamingOff: state.OpenRoaming.roamingOff
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
        },
        showOtherLinks: () => {
            dispatch(show_OtherLinks_fun(true))
        },
        showroamingBox:()=>{
            dispatch(open_roaming_fun({
                boxOff:true
            }))
        }
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);