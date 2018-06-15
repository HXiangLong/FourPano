import '../../../../commons/css/common.css'
import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../react/index.jsx';
import SWPano from '../../../../src/SWPano'
ReactDOM.render( < Index / > , document.getElementById('app'));

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

(function animate() {
    requestAnimationFrame(animate);
    swPano.Animate();
})();