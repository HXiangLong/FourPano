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
import SWDevice from '../src/tool/SWDevice';
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
    constants.c_thumbnailsShow = swExternalConst.server_json.features.exhibithallOpen;
    constants.c_mapShow = swExternalConst.server_json.features.mapOpen;
    constants.c_siteRepresentation = swExternalConst.server_json.features.arrowType;
    constants.c_collectAll = swExternalConst.server_json.features.collectAll;
    document.title = swExternalConst.server_json.projectName;

    render( <Provider store = {
        initStore()
      } >
      <Index />
      </ Provider>,
      document.getElementById('app')
    );

    init();
  });



//初始化底层全景和全景UI
function init() {
  let detector = new Detector();
  if (!detector.detector.webgl) detector.addGetWebGLMessage();

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    constants.c_currentState = constants.c_currentStateEnum.phoneStatus;

    let device = new SWDevice();
    let iPhone_cpu_revision = device.getGlRenderer();
    let Android_revision = device.get_android_version();
    constants.c_weixinQQWeibo = device.getBrowser();
  
    console.log('==================================');
    console.log(iPhone_cpu_revision);
    console.log(Android_revision);
    console.log(constants.c_weixinQQWeibo);
    console.log('====================================');

    // if (iPhone_cpu_revision.indexOf('A4') != -1 ||
    //   iPhone_cpu_revision.indexOf('A5') != -1 ||
    //   iPhone_cpu_revision.indexOf('A6') != -1 ||
    //   iPhone_cpu_revision.indexOf('A7') != -1 ||
    //   iPhone_cpu_revision.indexOf('A8') != -1 ||
    //   (Android_revision && Android_revision <= 6)) {
      constants.c_LowendMachine = true;
    // }
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
  swPano.initScene();
  swPano.initCamera();
  swPano.initRenderer();
  swPano.initLight();
  swPano.initMouseModule();
  swPano.initCameraManage();
  swPano.initSkyBox();
  swPano.initWallModule();
  swPano.initRoaming();
  swPano.initEditor();
  swPano.initService();
  swPano.initModel();
  swPano.initReticle();
  swPano.initControls();
  swPano.initVR();

  (function animate() {
    requestAnimationFrame(animate);
    swPano.Animate();
  })();
}