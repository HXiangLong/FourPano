import {combineReducers} from 'redux';
import BGMusicOff from './BGMusic';
import OpenHelp from './Help_reducers';
import OpenMapTip from './MapTip_reducers';
import OpenIframe from './Iframe_reducers';
import OpenIntroduction from './Introduction_reducers';

export default combineReducers({
    BGMusicOff,
    OpenHelp,
    OpenMapTip,
    OpenIframe,
    OpenIntroduction
})