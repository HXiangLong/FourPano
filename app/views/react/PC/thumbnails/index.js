import Thumbnails from './Thumbnails';
import {
    connect
} from 'react-redux';
import {
    show_Thumbnails_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenThumbnails
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closeThumbnails: () => {
            dispatch(show_Thumbnails_fun(false))
        },
        showThumbnails: () => {
            dispatch(show_Thumbnails_fun(true))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnails);