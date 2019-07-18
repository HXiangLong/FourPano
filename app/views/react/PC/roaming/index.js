import RoamingBox from './RoamingBox';
import {
    connect
} from 'react-redux';
import {
    open_roaming_fun
} from '../../../redux/action';
import {
    notify
} from 'reapop';

const mapStateToProps = (state, ownProps) => {
    return {
        boxOff: state.OpenRoaming.boxOff
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        OpenRoamingFun: (flag, index) => {
            dispatch(open_roaming_fun(flag));
            if(index > 0){
                dispatch(notify({
                    title: `开启${index== 1?'快速浏览':index== 2?'详细浏览':'沉浸浏览'}式漫游。`,
                    message: '',
                    position: 'tc',
                    status: 'success',
                    dismissible: true,
                    dismissAfter: 5000
                }));
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoamingBox);