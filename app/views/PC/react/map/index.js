import PanoMap from './PanoMap';
import {
    connect
} from 'react-redux';
import {
    show_PanoMap_fun,
    show_maptipbox_fun
} from '../../redux/action';

const thumbnailsStateToProps = (state, ownProps) => {
    return {
        off: state.OpenPanoMap
    }
}

const thumbnailsDispatchToProps = (dispatch, ownProps) => {
    return {
        closePanoMap: () => {
            dispatch(show_PanoMap_fun(false))
        },
        showMaptipBox:() => {
            dispatch(show_maptipbox_fun(true))
        }
    }
}

export default connect(thumbnailsStateToProps, thumbnailsDispatchToProps)(PanoMap);