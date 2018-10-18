import SettingBox from './SettingBox';
import {
    connect
} from 'react-redux';
import {
    show_Setting_fun,
    show_Introduction_fun
} from '../../../redux/action';

const thumbnailsStateToProps = (state, ownProps) => {
    return {
        boxOff:state.OpenSetting
    }
}

const thumbnailsDispatchToProps = (dispatch, ownProps) => {
    return {
        OpenSettingFun: () => {
            dispatch(show_Setting_fun(false))
        },
        setBrightness:(flag)=>{
            dispatch(show_Introduction_fun(flag))
        }
    }
}

export default connect(thumbnailsStateToProps, thumbnailsDispatchToProps)(SettingBox);