// import * as Detector from '../libs/Detector';
import * as constants from "./tools/Constants";
import * as tool from './tools/Tool';
import Stats from '../libs/Stats';
import serverData from './server/ServerData';

/**
 * 性能监测
 */
const initStats = () => {
    constants.stats = new Stats();
    constants.stats.setMode(0); // 0: fps, 1: ms
    constants.stats.domElement.style.position = 'absolute';
    constants.stats.domElement.style.left = '0px';
    constants.stats.domElement.style.top = '0px';
    document.getElementById("Stats-output").appendChild(constants.stats.domElement);
}

/**
 * 初始化相机
 */
const initCamera = () => {
    constants.camera = new THREE.PerspectiveCamera(constants.c_Maxfov, window.innerWidth / window.innerHeight, 0.1, 10000);
}

/**
 * 初始化灯光
 */
const initLight = () => {
    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
    constants.scene.add(ambientLight);
}

/**
 * 初始化场景
 */
const initScene = () => {
    constants.scene = new THREE.Scene();
}

/**
 * 初始化渲染
 */
const initRenderer = () => {
    constants.renderer = new THREE.WebGLRenderer({ antialias: true });
    constants.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas3d').appendChild(constants.renderer.domElement);
    constants.renderer.domElement.style.position = "absolute";
    constants.renderer.domElement.style.display = "block";
    constants.renderer.setClearColor(0xffffff, 1.0); //设置canvas背景色(clearColor)
    constants.renderer.shadowMapEnabled = true;
}

/**
 * 每帧调用
 */
const Animate = () => {
    requestAnimationFrame(Animate);

    if (constants.stats) constants.stats.update();

    TWEEN.update();

    Update();

    constants.camera.aspect = window.innerWidth / window.innerHeight;
    constants.camera.updateProjectionMatrix();
    constants.renderer.setPixelRatio(window.devicePixelRatio);
    constants.renderer.setSize(window.innerWidth, window.innerHeight);
    constants.renderer.render(constants.scene, constants.camera);

}

/**
 * 其他需要更新的都在这里
 */
const Update = () => {

}

/**
 * 初始化所有类
 */
const initClass = () => {
    constants.sw_getService = new serverData();
    constants.sw_getService.getConfig();

}
const initBox = () => {
    var box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff00ff }));
    constants.scene.add(box);

    var coords = { x: 0, y: 0, z: 0 }; // Start at (0, 0)
    new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
        .to({ x: 0, y: 0, z: -300 }, 5000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
            box.position.copy(new THREE.Vector3(coords.x, coords.y, coords.z));
        })
        .start(); // Start the tween immediately.
}

/**
 * 初始化
 */
function init() {
    initClass();
    initStats();
    initScene();
    initCamera();
    initRenderer();
    initLight();
    Animate();
    initBox();
}
export default init;