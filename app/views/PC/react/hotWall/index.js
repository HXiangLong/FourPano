import HotPhotoWall from './HotPhotoWall';
import {
    connect
} from 'react-redux';
import {
    show_HotPhotoWall_fun
} from '../../redux/action';

const thumbnailsStateToProps = (state, ownProps) => {
    return {
        off: state.OpenHotPhotoWall.off,
        allShow: state.OpenHotPhotoWall.allShow
    }
}
const thumbnailsDispatchToProps = (dispatch, ownProps) => {
    return {
        closeHotPhotoWall: () => {
            dispatch(show_HotPhotoWall_fun({
                off:false
            }))
        }
    }
}

export default connect(thumbnailsStateToProps, thumbnailsDispatchToProps)(HotPhotoWall);