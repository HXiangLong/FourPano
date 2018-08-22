import React from 'react';
import {render} from 'react-dom';
import { Provider} from 'react-redux';
import Index from './react/index';
import SWPano from '../../src/SWPano';
import { createStore } from 'redux';
import rootReducer from './redux/reducers';
const swExternalConst = require('../../src/tool/SWExternalConst');
const axios = require('axios');

const tt = Date.now();
console.log(serverPath,tt);

axios.get(serverPath, {
    responseType: "json"
  })
  .then(json => {
    swExternalConst.server_json = json.data;
    console.log('====================================');
    console.log(json.data,(Date.now() - tt));
    console.log('====================================');
    init();
  });

function init() {

  const store = createStore(rootReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

  let swPano = new SWPano();
  swPano.initStats();
  swPano.initScene();
  swPano.initCamera();
  swPano.initRenderer();
  swPano.initLight();
  swPano.initService();
  swPano.initMouseModule();
  swPano.initCameraManage();
  swPano.initSkyBox();
  swPano.initWallModule();
  swPano.initEditor();

  render( <Provider store = {
      store
    } >
    <Index />
    </Provider>,
    document.getElementById('app')
  );

  (function animate() {
    requestAnimationFrame(animate);
    swPano.Animate();
  })();
}