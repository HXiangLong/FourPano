import SettingBox from './SettingBox';
import {
    connect
} from 'react-redux';
import {
    show_Setting_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        boxOff:state.OpenSetting.off
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        OpenSettingFun: () => {
            dispatch(show_Setting_fun({
                off:false
            }))
        },
        setBrightness:(flag)=>{
            dispatch(show_Setting_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingBox);