import MapTipBox from './MapTipBox';
import {
    connect
} from 'react-redux';
import {
    show_maptipbox_fun
} from '../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        openMapTip: state.OpenMapTip
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closeMapTip: () => {
            dispatch(show_maptipbox_fun(false))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapTipBox);
;