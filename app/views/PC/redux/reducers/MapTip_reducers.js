import {show_maptipbox_state} from '../action';

export default function OpenMapTip(state=false,action){
    switch (action.type) {
        case show_maptipbox_state:
            return action.data;
        default:
            return state;
    }
}