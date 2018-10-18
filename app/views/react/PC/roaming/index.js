import RoamingBox from './RoamingBox';
import {
    connect
} from 'react-redux';
import {
    open_roaming_fun
} from '../../../redux/action';

const thumbnailsStateToProps = (state, ownProps) => {
    return {
        boxOff:state.OpenRoaming.boxOff
    }
}

const thumbnailsDispatchToProps = (dispatch, ownProps) => {
    return {
        OpenRoamingFun: (flag) => {
            dispatch(open_roaming_fun(flag))
        }
    }
}

export default connect(thumbnailsStateToProps, thumbnailsDispatchToProps)(RoamingBox);