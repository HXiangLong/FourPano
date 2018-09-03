import { createStore } from 'redux';
import rootReducer from '../reducers';

let store;

export default function initStore(){
     if(!store){
         store = createStore(rootReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
     }
    return store;
}

