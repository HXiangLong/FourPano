import React from 'react';
import {
  render
} from 'react-dom';
import {
  Provider
} from 'react-redux';
import Index from './react/index';
import SWPano from '../src/SWPano';
import * as constants from '../src/tool/SWConstants';
import initStore from './redux/store/store';
import Detector from '../src/libs/Detector';
require('../src/libs/CSS3DRenderer');
// require('../src/libs/CanvasRenderer');
const swExternalConst = require('../src/tool/SWExternalConst');
const axios = require('axios');

String.prototype.getQuery = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = this.substr(this.indexOf("?") + 1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
};

//获取外部配置文件
axios.get(serverPath, {
    responseType: "json"
  })
  .then(json => {
    swExternalConst.server_json = json.data;
    init();
  });

//初始化底层全景和全景UI
function init() {
  let detector = new Detector();
  if (!detector.detector.webgl) detector.addGetWebGLMessage();

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    constants.c_currentState = constants.c_currentStateEnum.phoneStatus;
  } else {
    constants.c_currentState = constants.c_currentStateEnum.pcStatus;
  }

  //外部传入站点和看向点
  let firtPanoid = swExternalConst.server_json.firstPanoID;
  let htmlPanoId = document.URL.getQuery('PanoID');
  let htmlYaw = document.URL.getQuery('dYaw');
  let htmlPicth = document.URL.getQuery('dPitch');

  swExternalConst.server_json.firstAnimation = htmlPanoId ? true : false;
  swExternalConst.server_json.firstPanoID = htmlPanoId ? htmlPanoId : firtPanoid;
  swExternalConst.server_json.firstYaw = htmlYaw;
  swExternalConst.server_json.firstPitch = htmlPicth;

  //全景底层
  let swPano = new SWPano();
  // swPano.initStats();
  swPano.initScene();
  swPano.initCamera();
  // constants.c_currentState == constants.c_currentStateEnum.phoneStatus ? swPano.initCSSRenderer() : swPano.initRenderer();
  swPano.initRenderer();
  swPano.initLight();
  swPano.initService();
  swPano.initMouseModule();
  swPano.initCameraManage();
  swPano.initSkyBox();
  swPano.initWallModule();
  swPano.initRoaming();
  swPano.initEditor();

  render( < Provider store = {
      initStore()
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