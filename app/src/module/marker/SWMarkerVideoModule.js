/* global THREE,$*/
import {
    scene,
    sw_getService
} from '../../tool/SWConstants';
import {
    disposeNode
} from '../../tool/SWTool';
import initStore from '../../../views/redux/store/store';
import {
    background_music_fun,
    show_VideoBox_fun
} from '../../../views/redux/action';

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
 *                  openBox:弹出视频弹出框
 * @param {*} panoid 视频所在的站点
 */
class SWMarkerVideoModule {
    constructor(obj, panoid) {
        this.panoID = panoid;
        this.videoData = obj;
        this.movieScreen;
        this.videoTexture;
        this.videoImageContext;
        this.startPoint = new THREE.Vector2();
        this.loopPlay = obj.loop || true;
        this.videoBox;
        this.video;

        this.lastTime = 0;

        this.initMarkerVideo();
    }

    initMarkerVideo() {
        this.videoBox = document.getElementById("videosBox");
        let url = `${sw_getService.resourcesUrl}/BusinessData/ExhibitDetails/Video/${this.videoData.url}`;
        $(this.videoBox).append('<video id="' + this.videoData.url + '" style="display:none" crossorigin="anonymous">' + '<source src="' + url + '" type=' + 'video/webm; codecs="vp8,vorbis"' + '></video>');

        this.video = document.getElementById(this.videoData.url);

        let videoImage = document.createElement('canvas');
        videoImage.width = this.videoData.width;
        videoImage.height = this.videoData.height;

        this.videoImageContext = videoImage.getContext('2d');
        // 如果没有视频存在时的背景颜色
        this.videoImageContext.fillStyle = '#000000';
        this.videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

        this.videoTexture = new THREE.Texture(videoImage);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;

        let movieMaterial = new THREE.MeshBasicMaterial({
            map: this.videoTexture,
            overdraw: true,
            side: THREE.DoubleSide
        });
        movieMaterial.polygonOffset = true;
        movieMaterial.polygonOffsetFactor = 0.5;
        movieMaterial.polygonOffsetUnits = 0.5;

        //将要显示电影的几何图形,电影图像将缩放以适合这些尺寸。
        let movieGeometry = new THREE.PlaneGeometry(this.videoData.width, this.videoData.height, 1, 1);
        this.movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
        this.movieScreen.position.copy(new THREE.Vector3(this.videoData.posX, this.videoData.posY, this.videoData.posZ));
        this.movieScreen.rotation.x = THREE.Math.degToRad(this.videoData.rotX);
        this.movieScreen.rotation.y = THREE.Math.degToRad(this.videoData.rotY);
        this.movieScreen.rotation.z = THREE.Math.degToRad(this.videoData.rotZ);
        this.movieScreen.scale.x = this.movieScreen.scale.y = this.movieScreen.scale.z = this.videoData.scale;
        this.movieScreen.userData.depthlevel = 1;
        this.movieScreen.userData.ifPlayBoo = true;
        this.movieScreen.userData.video = this.video;
        this.movieScreen.name = this.videoData;
        // scene.add(this.movieScreen);

        this.movieScreen.mouseUp = (e, obj) => {

            let v3 = new THREE.Vector2(e.screenX, e.screenY);

            let boo = v3.equals(this.startPoint);

            if (boo) {

                if (this.videoData.openBox) {

                    obj.object.userData.ifPlayBoo = false;

                    obj.object.userData.video.pause();

                    let store = initStore();

                    store.dispatch(show_VideoBox_fun({
                        off: true,
                        videoUrl: this.videoData.url
                    }));

                } else {

                    let nowTime = Date.now();

                    let differ = nowTime - this.lastTime;

                    if (differ <= 500) {
                        obj.object.userData.ifPlayBoo = false;

                        obj.object.userData.video.pause();

                        obj.object.visible = false;

                        let store = initStore();
                        store.dispatch(background_music_fun({
                            bgMusicOff: true
                        }));

                        return;
                    }

                    this.lastTime = Date.now();

                    if (obj.object.userData.ifPlayBoo) {

                        obj.object.userData.ifPlayBoo = false;

                        obj.object.userData.video.pause();

                    } else {

                        obj.object.userData.ifPlayBoo = true;

                        obj.object.userData.video.play();
                    }
                }
            }
        }

        this.movieScreen.mouseDown = (e, obj) => {

            this.startPoint.x = e.screenX;

            this.startPoint.y = e.screenY;

        }

    }

    //更新
    updataSmallVideo() {
        if (this.video && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {

            if (!this.movieScreen.parent) {

                this.video.play();

                scene.add(this.movieScreen);
            }

            this.videoImageContext.drawImage(this.video, 0, 0);

            if (this.videoTexture) this.videoTexture.needsUpdate = true;

            if (this.loopPlay) {

                if (this.video.currentTime == this.video.duration) {

                    this.video.currentTime = 0;

                    this.video.play();
                }
            }
        }
    }

    clearSmallVideo() {

        this.video.pause();

        $(this.videoBox).html("");

        disposeNode(this.movieScreen);

        this.videoTexture.dispose();

        let store = initStore();

        store.dispatch(background_music_fun({
            bgMusicOff: true
        }));
    }

    changeSmallVideo(obj) {

        this.movieScreen.position.copy(new THREE.Vector3(obj.posX, obj.posY, obj.posZ));

        this.movieScreen.rotation.x = THREE.Math.degToRad(obj.rotX);

        this.movieScreen.rotation.y = THREE.Math.degToRad(obj.rotY);

        this.movieScreen.rotation.z = THREE.Math.degToRad(obj.rotZ);

        this.movieScreen.scale.x = this.movieScreen.scale.y = this.movieScreen.scale.z = obj.scale;

    }

    stopVideo() {
        this.video.pause();
    }

    playVideo() {
        this.movieScreen.userData.ifPlayBoo = true;
        this.video.play();
    }
}

export default SWMarkerVideoModule;