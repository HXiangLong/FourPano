import PBottom from './PBottom';
import {
    connect
} from 'react-redux';
import {
    show_Introduction_fun,
    open_roaming_fun,
    show_Thumbnails_fun,
    show_HotPhotoWall_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        brightness:state.OpenSetting.brightness,
        openRoamingOff: state.OpenRoaming.roamingOff,
        OpenThumbnails: state.OpenThumbnails,
        hotWallOff:state.OpenHotPhotoWall.off
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        showIntroduction: (flag) => {
            dispatch(show_Introduction_fun(flag))
        },
        showroamingBox:()=>{
            dispatch(open_roaming_fun({
                boxOff:true
            }))
        },
        closeThumbnails: () => {
            dispatch(show_Thumbnails_fun(false))
        },
        showThumbnails: () => {
            dispatch(show_Thumbnails_fun(true))
        },
        showHotPhotoWall: (flag) => {
            dispatch(show_HotPhotoWall_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PBottom);