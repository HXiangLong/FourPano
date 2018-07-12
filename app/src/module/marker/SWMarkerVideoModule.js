/* global THREE,$*/

import { scene } from '../../tool/SWConstants';

/**
 * 视频标注
 */
class SWMarkerVideoModule {
    /**
     * 视频标注构造函数
     * @param {*} obj 参数 url:视频地址
     *                  width:视频宽
     *                  height:视频高度
     *                  posX:视频坐标X
     *                  posY:视频坐标Y
     *                  posZ:视频坐标Z
     *                  rotX:视频旋转X
     *                  rotY:视频旋转Y
     *                  rotZ:视频旋转Z
     *                  loop:循环播放 bool
     */
    constructor(obj) {
        let loopPlay = obj.loop || true;
        let video = document.createElement('video');
        video.src = obj.url;
        video.load();
        video.play();

        let videoImage = document.createElement('canvas');
        videoImage.width = obj.width;
        videoImage.height = obj.height;

        let videoImageContext = videoImage.getContext('2d');
        // 如果没有视频存在时的背景颜色
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

        let videoTexture = new THREE.Texture(videoImage);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        let movieMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, overdraw: true, side: THREE.DoubleSide });
        //将要显示电影的几何图形,电影图像将缩放以适合这些尺寸。
        let movieGeometry = new THREE.PlaneGeometry(obj.width, obj.height, 1, 1);
        let movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
        movieScreen.position.copy(new THREE.Vector3(obj.posX, obj.posY, obj.posZ));
        movieScreen.rotation.x = THREE.Math.degToRad(obj.rotX);
        movieScreen.rotation.y = THREE.Math.degToRad(obj.rotY);
        movieScreen.rotation.z = THREE.Math.degToRad(obj.rotZ);
        movieScreen.userData.depthlevel = 1;
        movieScreen.userData.ifPlayBoo = true;
        movieScreen.userData.video = video;
        movieScreen.name = obj.url;
        scene.add(movieScreen);
    }
}

export default SWMarkerVideoModule;