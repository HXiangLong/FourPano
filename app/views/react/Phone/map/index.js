import PPanoMap from './PPanoMap'
import {
    connect
} from 'react-redux';
import {
    show_PanoMap_fun,
    show_maptipbox_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        phoneOff: state.OpenPanoMap.phoneOff,
        radarAngle: state.OpenPanoMap.radarAngle,
        pid: state.OpenPanoMap.pID
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closePanoMap: () => {
            dispatch(show_PanoMap_fun({
                phoneOff: false
            }))
        },
        showMaptipBox: () => {
            dispatch(show_maptipbox_fun({
                off: true,
                phoneOff:true
            }))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PPanoMap);