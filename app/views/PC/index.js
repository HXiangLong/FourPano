// import '../../commons/css/common.css'
import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Index from './react/index';
import SWPano from '../../src/SWPano'

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

render(
  <Provider store={store}>
    <Index />
  </Provider>,
  document.getElementById('app')
);

console.log(serverPath);

(function animate() {
    requestAnimationFrame(animate);
    swPano.Animate();
})();