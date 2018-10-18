import ViewPicture from './ViewPicture';
import {
    connect
} from 'react-redux';
import {
    show_ViewPicture_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenViewPicture.off,
        idx:state.OpenViewPicture.idx,
        imageList:state.OpenViewPicture.imageList,
        thumbs:state.OpenViewPicture.thumbs,
        titles:state.OpenViewPicture.titles,
        captions:state.OpenViewPicture.captions
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closeViewPicture: (flag) => {
            dispatch(show_ViewPicture_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPicture);