import '../../../commons/css/common.css'
import React from 'react';
import {render} from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Index from '../react/index';
import SWPano from '../../../src/SWPano'
render( <Index />, document.getElementById('app'));

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

(function animate() {
    requestAnimationFrame(animate);
    swPano.Animate();
})();