import PMarkerInterface from './PMarkerInterface'
import {
    connect
} from 'react-redux'
import {
    show_MarkerInterface_fun,
    show_Iframe_fun,
    show_VideoBox_fun,
    background_music_fun,
    show_ViewPicture_fun,
    show_ReviewInput_fun
} from '../../../redux/action';

const mapStateToProps = (state, ownProps) => {
    return {
        off:state.OpenMarkerInterface.off,
        exhibitID:state.OpenMarkerInterface.exhibitID,
        imglist: state.OpenMarkerInterface.imglist,
        title: state.OpenMarkerInterface.title,
        content:state.OpenMarkerInterface.content,
        likeNum:state.OpenMarkerInterface.likeNum,
        commentList:state.OpenMarkerInterface.commentList,
        links:state.OpenMarkerInterface.links,
        d3:state.OpenMarkerInterface.d3,
        book:state.OpenMarkerInterface.book,
        video:state.OpenMarkerInterface.video,
        audio:state.OpenMarkerInterface.audio,

        closeYourself: state.BGMusicOff.closeYourself,
        audioUrl: state.BGMusicOff.audioUrl
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        markerInterfaceState: (flag) => {
            dispatch(show_MarkerInterface_fun(flag))
        },
        showIframe: (flag) => {
            dispatch(show_Iframe_fun(flag))
        },
        showVideo:(flag)=>{
            dispatch(show_VideoBox_fun(flag));
        },
        open_close_Audio: (flag) => {
            dispatch(background_music_fun(flag))
        },
        show_ViewPicture: (flag) => {
            dispatch(show_ViewPicture_fun(flag))
        },
        show_ReviewInput:(flag) => {
            dispatch(show_ReviewInput_fun(flag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PMarkerInterface);