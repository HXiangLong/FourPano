// import IntroductionComplex from './IntroductionComplex';
import IntroductionSimple from './IntroductionSimple';
import {
    connect
} from 'react-redux';
import {
    show_Introduction_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenIntroduction.off,
        imgurl: state.OpenIntroduction.imgurl,
        title: state.OpenIntroduction.title,
        content: state.OpenIntroduction.content
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        IntroductionState: (flag) => {
            dispatch(show_Introduction_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionSimple)