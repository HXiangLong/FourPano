import { createStore } from 'redux';
import rootReducer from '../reducers';

let store;

/**实例化store，已经实例化就直接返回 */
export default function initStore(){
     if(!store){
         store = createStore(rootReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
     }
    return store;
}

