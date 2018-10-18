import Help from './Help'
import {
    connect
} from 'react-redux'
import {
    show_help_fun
} from '../../../redux/action'

const mapStateToProps = (state, ownProps) => {
    return {
        openHelp: state.OpenHelp
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closeHelp: () => {
            dispatch(show_help_fun(false))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Help);