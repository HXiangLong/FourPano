import PHotPhotoWall from './PHotPhotoWall'
import {
    connect
} from 'react-redux';
import {
    show_HotPhotoWall_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenHotPhotoWall.off,
        allShow: state.OpenHotPhotoWall.allShow
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closeHotPhotoWall: () => {
            dispatch(show_HotPhotoWall_fun({
                off:false
            }))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PHotPhotoWall);