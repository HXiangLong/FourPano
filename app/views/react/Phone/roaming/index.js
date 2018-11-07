import PRoamingBox from './PRoamingBox';
import {
    connect
} from 'react-redux';
import {
    open_roaming_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        boxOff:state.OpenRoaming.boxOff
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        OpenRoamingFun: (flag) => {
            dispatch(open_roaming_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PRoamingBox);