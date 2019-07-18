import OtherLinks from './OtherLinks'
import {
    connect
} from 'react-redux'
import {
    show_OtherLinks_fun
} from '../../../redux/action'

const mapStateToProps = (state, ownProps) => {
    return {
        off: state.OpenOtherLinks
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closeOtherLinks: () => {
            dispatch(show_OtherLinks_fun(false))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OtherLinks);