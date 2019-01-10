import PHeader from './PHeader'
import {
    connect
} from 'react-redux'

const mapStateToProps = (state, ownProps) => {
    return {
        panoNames:state.panoPrompt.panoNames
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PHeader)