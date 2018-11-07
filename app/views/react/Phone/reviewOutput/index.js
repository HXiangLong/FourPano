import PReviewOutput from './PReviewOutput';
import {
    connect
} from 'react-redux';
import {
    show_MarkerInterface_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        commentList:state.OpenMarkerInterface.commentList,
        phoneCommnetOff:state.OpenMarkerInterface.phoneCommnetOff,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        markerInterfaceState: (flag) => {
            dispatch(show_MarkerInterface_fun(flag))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PReviewOutput);