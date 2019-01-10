import PanoMap from './PanoMap';
import {
    connect
} from 'react-redux';
import {
    show_PanoMap_fun,
    show_maptipbox_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenPanoMap.off,
        radarAngle: state.OpenPanoMap.radarAngle,
        pid: state.OpenPanoMap.pID,
        imgUrl:state.OpenPanoMap.imgUrl,
        floorsMapData:state.OpenPanoMap.floorsMapData
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closePanoMap: () => {
            dispatch(show_PanoMap_fun({
                off: false
            }))
        },
        showMaptipBox: () => {
            dispatch(show_maptipbox_fun({
                off: true
            }))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PanoMap);