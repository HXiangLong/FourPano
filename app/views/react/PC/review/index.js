import ReviewInput from './ReviewInput';
import {
    connect
} from 'react-redux';
import {
    show_ReviewInput_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenReviewInput.off,
        exhibitID:state.OpenMarkerInterface.exhibitID,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeViewPicture: (flag) => {
            dispatch(show_ReviewInput_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewInput);