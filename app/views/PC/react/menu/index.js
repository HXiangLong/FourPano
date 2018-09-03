import MainMenu from './MainMenu';
import {
    connect
} from 'react-redux';
import {
    show_Introduction_fun
} from '../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenIntroduction.off
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        IntroductionState: (flag) => {
            dispatch(show_Introduction_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);