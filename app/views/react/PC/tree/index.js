import TreeShape from './TreeShape';
import {
    connect
} from 'react-redux';
import {
    pano_TreeShape_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off:state.OpenTreeShape,
        pid: state.OpenPanoMap.pID
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeShape);