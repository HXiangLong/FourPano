import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../react/index.jsx';
import {initStats,initClass,initScene,initCamera,initRenderer,initLight,Animate,initBox} from '../../../../src/SWPano'
ReactDOM.render(<Index/>,document.getElementById('app'));
initClass();
initStats();
initScene();
initCamera();
initRenderer();
initLight();
Animate();
initBox();
