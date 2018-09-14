import Thumbnails from './Thumbnails';
import {
    connect
} from 'react-redux';
import {
    show_Thumbnails_fun
} from '../../redux/action';

const thumbnailsStateToProps = (state, ownProps) => {
    return {
        off: state.OpenThumbnails
    }
}
const thumbnailsDispatchToProps = (dispatch, ownProps) => {
    return {
        closeThumbnails: () => {
            dispatch(show_Thumbnails_fun(false))
        },
        showThumbnails: () => {
            dispatch(show_Thumbnails_fun(true))
        }
    }
}

export default connect(thumbnailsStateToProps, thumbnailsDispatchToProps)(Thumbnails);