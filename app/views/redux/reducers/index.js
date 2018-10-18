import {
    combineReducers
} from 'redux';
import BGMusicOff from './BGMusic';
import OpenHelp from './Help_reducers';
import OpenMapTip from './MapTip_reducers';
import OpenIframe from './Iframe_reducers';
import OpenIntroduction from './Introduction_reducers';
import OpenThumbnails from './Thumbnails_reducers';
import OpenHotPhotoWall from './HotPhotoWall_reducers';
import OpenPanoMap from './PanoMap_reducers';
import OpenMarkerInterface from './MarkerInterface_reducers';
import OpenVideoBox from './VideoBox_reducers';
import OpenViewPicture from './ViewPicture_reducers';
import OpenReviewInput from './ReviewInput_reducers';
import OpenOtherLinks from './OtherLinks_reducers';
import OpenRoaming from './Roaming_reducers';
import OpenSetting from './Setting_reducers';

export default combineReducers({
    BGMusicOff,
    OpenHelp,
    OpenMapTip,
    OpenIframe,
    OpenIntroduction,
    OpenThumbnails,
    OpenHotPhotoWall,
    OpenPanoMap,
    OpenMarkerInterface,
    OpenVideoBox,
    OpenViewPicture,
    OpenReviewInput,
    OpenOtherLinks,
    OpenRoaming,
    OpenSetting
})