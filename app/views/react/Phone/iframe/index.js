import POpenIframe from './POpenIframe'
import {
    connect
} from 'react-redux'
import {
    show_Iframe_fun
} from '../../../redux/action'

const mapStateToProps = (state, ownProps) => {
    return {
        iframeOff: state.OpenIframe.iframeOff,
        iframeUrl: state.OpenIframe.iframeUrl
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        openIframe: (data) => {
            dispatch(show_Iframe_fun(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(POpenIframe);