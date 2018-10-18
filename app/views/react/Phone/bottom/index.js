import PBottom from './PBottom'
import {
    connect
} from 'react-redux'
import {
    show_Introduction_fun
} from '../../../redux/action'

const mapStateToProps = (state, ownProps) => {
    return {
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        showIntroduction: (flag) => {
            dispatch(show_Introduction_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PBottom);