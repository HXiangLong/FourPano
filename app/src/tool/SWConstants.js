/* global THREE*/

import HashTable from './SWHashTable';

/**版本号*/
export var REVISION = '4.0';
/**版本类型 1-PC版 2-手机版 3-编辑版本*/
export var revision_type = 1;
/**性能监视*/
export var stats = "";
/**相机*/
export var camera = "";
/**灯光对象 */
export var ambientLight;
/**正方形相机*/
export var cubeCamera = "";
/**场景*/
export var scene = "";
/**渲染*/
export var renderer = "";
//像素与物理尺寸比例
export var c_devicePixelRatio = window.devicePixelRatio < 3 ? 3 : window.devicePixelRatio;
/**最大视角*/
export var c_Maxfov = 68;
/**最小视角*/
export var c_Minfov = 20;
/** 最大俯仰角*/
export var c_maxPitch = 85;
/**最小俯仰角*/
export var c_minPitch = -85;
/**面距离*/
export var c_FaceDistance = 4096;
/**面片缩放比例*/
export var c_WallDisplaySize = 20;
/**漫游倍数 */
export var c_roamingMultiple = 5;
/**移动速度倍率 */
export var c_movingSpeedMultiple = 5;
/**偏差角 */
export var c_deviationAngle = -165;
/**场景宽 */
export var c_clientWidth;
/**场景高 */
export var c_clientHeight;
/**跳转之后需要看向的标注ID*/
export var c_JumpMarkerID = "";
/**当前点赞的是哪个编号 */
export var c_likeToExhibitID = "";
/**上一站全景ID */
export var c_LastStopPanoID = "";
/**坐标转换矩阵。坐标系 OpenGL -> 3DS*/
export var c_OpenGLToDS3Mx4 = new THREE.Matrix4().fromArray([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
/**坐标转换矩阵。坐标系 3DS -> OpenGL*/
export var c_DS3ToOpenGLMx4 = new THREE.Matrix4().fromArray([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]);
/**跳转之后进行旋转相机看向点击位置*/
export var c_wallClickRotateV3 = new THREE.Vector3();
/** true所有文物显示 false按照楼层显示*/
export var c_collectAll = false;
/**初始化完成之后是否弹出展厅推荐列表 */
export var c_thumbnailsShow = false;
/**初始化完成之后是否弹出小地图 */
export var c_mapShow = false;
/**是否是低端机 */
export var c_LowendMachine = false;
/**是否是微信QQ微博内打开的 */
export var c_weixinQQWeibo = false;
/**漫游状态 */
export var c_roamingStatus = false;
/**是否显示探面 */
export var c_isDisplayFace = true;
/**测量状态*/
export var c_isMeasureStatus = false;
/**站点表现形式 true-箭头 false-点 */
export var c_siteRepresentation = false;
/**是否加载缩略图中 */
export var c_isPreviewImageLoadEnd = false;
/**是否是编辑状态*/
export var c_isEditorStatus = false;
/**是否跳转之后进行旋转相机看向点击位置*/
export var c_isWallClickRotateBoo = false;
/**展厅跳转之后看向展厅大门*/
export var c_isThumbnailsRotateBoo = false;
/**目录树点击跳转站点 */
export var c_treeShapeJumpPano = false;
/**目录树点击跳转站点Yaw Pitch值 */
export var c_treeShapeJumpPanoStr = "";
/**初始化时界面数据显示 */
export var c_initUIData = true;
/**全景有几种版本 1-默认为PC版 2-手机版 3-编辑版 4-触屏版*/
export var c_currentStateEnum = {
    pcStatus: 1,
    phoneStatus: 2,
    editorStatus: 3,
    touchStatus: 4
};
/**当前运行的是什么版本 */
export var c_currentState = c_currentStateEnum.pcStatus;

/**编辑版的几种状态 1-默认编辑箭头 2-编辑标注*/
export var c_editorStateEnum = {
    arrow: 1,
    markerPoint: 2
};
/**当前运行的是编辑版的什么状态 */
export var c_editorState = c_editorStateEnum.markerPoint;

/**当前运行模式 正常/VR */
export var c_modes = {
    NORMAL: 1,
    STEREO: 2
}
/**当前模型 */
export var c_mode = c_modes.NORMAL;

/**计时器*/
export var c_clock = new THREE.Clock();
/**当前站点基本信息*/
export var c_StationInfo;
/**跳转过程中的过渡球*/
export var c_jumpSphere = undefined;
/**所有箭头对象*/
export var c_arrowArr = [];
/**所有箭头Mash对象 */
export var c_arrowCurentArr = [];
/**当前站点所需要的墙面片集合*/
export var c_facadeByPanoIDInfoArr = [];
/**老箭头集合*/
export var c_AdjacentPanoInfoArr = [];
/**新箭头集合*/
export var c_ArrowPanoInfoArr = [];
/**视频集合*/
export var c_smallVideoArr = [];
/**所有标注数据集合（点，面）*/
export var c_markerInfoArr = [];
/**所有标注集合（点，面）*/
export var c_markerMeshArr = [];
/**推荐展厅数据集合*/
export var c_thumbnailsForMuseum = [];
/**所有推荐文物信息列表*/
export var c_allExhibitsForBuildingTable = new HashTable();
/**所有推荐文物对应标注列表*/
export var c_allExhibitsForMarkerTable = new HashTable();
/**单个文物详细信息*/
export var c_multiDataByParentIDTable = new HashTable();
/**所有视频集合 */
export var c_allVideoTable = new HashTable();
/**楼层集合*/
export var c_FloorsMapTable = new HashTable();
/**所有站点集合 */
export var c_panoIDTable = new HashTable();
/**第三层贴图集合 */
export var c_panoImageTable = new HashTable();

/**当前控制器 */
export var c_control;
/**字板界面 */
export var c_effect;
//实例化对象
/**本地数据读取 */
export var sw_GetSQLData;
/**数据*/
export var sw_getService;
/**相机控制*/
export var sw_cameraManage;
/**鼠标控制*/
export var sw_mouseControl;
/**小地图*/
export var sw_minMap;
/**球形盒子*/
export var sw_skySphere;
/**六面体*/
export var sw_skyBox;
/**地面*/
export var sw_groundMesh;
/**测量*/
export var sw_measure;
/**墙面片*/
export var sw_wallMesh;
/**墙面探面*/
export var sw_wallProbeSurface;
/**推荐展厅*/
export var sw_thumbnailsItems;
/**标注说明*/
export var sw_markerExhibits;
/**打标注类*/
export var sw_markPoint;
/**热点文物墙*/
export var sw_hotPhotoWall;
/**漫游 */
export var sw_roamingModule;
/**十字点 */
export var sw_SWReticle;
/**三维模型 */
export var sw_SWModel;

/**小行星全景Shader */
export var StereographicShader = {

    uniforms: {

        "tDiffuse": {
            value: new THREE.Texture()
        },
        "resolution": {
            value: 1.0
        },
        "transform": {
            value: new THREE.Matrix4()
        },
        "zoom": {
            value: 1.0
        }

    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

        "vUv = uv;",
        "gl_Position = vec4( position, 1.0 );",

        "}"

    ].join("\n"),

    fragmentShader: [

        "uniform sampler2D tDiffuse;",
        "uniform float resolution;",
        "uniform mat4 transform;",
        "uniform float zoom;",

        "varying vec2 vUv;",

        "const float PI = 3.141592653589793;",

        "void main(){",

        "vec2 position = -1.0 +  2.0 * vUv;",

        "position *= vec2( zoom * resolution, zoom * 0.5 );",

        "float x2y2 = position.x * position.x + position.y * position.y;",
        "vec3 sphere_pnt = vec3( 2. * position, x2y2 - 1. ) / ( x2y2 + 1. );",

        "sphere_pnt = vec3( transform * vec4( sphere_pnt, 1.0 ) );",

        "vec2 sampleUV = vec2(",
        "(atan(sphere_pnt.y, sphere_pnt.x) / PI + 1.0) * 0.5,",
        "(asin(sphere_pnt.z) / PI + 0.5)",
        ");",

        "gl_FragColor = texture2D( tDiffuse, sampleUV );",

        "}"

    ].join("\n")

};

var e = ["#ifdef",
    "GL_ES",
    "#ifdef",
    "GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "#endif",
    "uniform sampler2D sm;",
    "varying vec2 tx;",
    "uniform float ca;",
    "uniform float ol;",
    "void main()",
    "{",
    "float g = texture2D(sm,tx).g;",
    "vec2 center = vec2(0.5 + (0.5 - ol)*(step(0.5,tx.x) - 0.5), 0.5);",
    "vec2 v = tx - center;",
    "vec2 vR = center + v * ca;",
    "float r = texture2D(sm,vR).r;",
    "vec2 vB = center + v / ca;",
    "float b = texture2D(sm,vB).b;",
    "gl_FragColor=vec4(r,g,b,1.0);",
    "}"
];

var s = ["#ifdef",
    "GL_ES",
    "#ifdef",
    "GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "#endif",
    "uniform sampler2D sm;",
    "varying vec2 tx;",
    "uniform vec2 sz;",
    "uniform float ss;",
    "uniform float ca;",
    "uniform float ol;",
    "uniform float vg;",
    "uniform vec4 dd;",
    "void main()",
    "{",
    "float vig = 0.015;",
    "float side = step(0.5,tx.x) - 0.5;",
    "float aspect = (sz.x / sz.y);",
    "vec2 center = vec2(0.5 + (0.5 - ol)*side, 0.5);",
    "vec2 v = tx - center;",
    "v.x = v.x * aspect;",
    "v *= 2.0 * ss;",
    "float rs = dot(v,v);",
    "v = v * (dd.x + rs*(dd.y + rs*(dd.z + rs*dd.w)));",
    "v /= 2.0 * ss;",
    "v.x = v.x / aspect;",
    "vec2 vG = center + v;",
    "float a = (1.0 - smoothstep(vG.x-vig - side*ol, vG.x - side*ol, center.x - 0.25)) * ",
    "(1.0 - smoothstep(center.x + 0.25 - vG.x + side*ol - vig, center.x + 0.25 - vG.x + side*ol, 0.0)) * ",
    "(1.0 - smoothstep(vG.y-vig, vG.y, 0.0)) * ",
    "(1.0 - smoothstep(1.0 - vG.y-vig,1.0 - vG.y, 0.0));",
    "a *= smoothstep(rs-vig, rs+vig, vg);",
    "vec2 vR = center + v * ca;",
    "vec2 vB = center + v / ca;",
    "float r = texture2D(sm,vR).r;",
    "float g = texture2D(sm,vG).g;",
    "float b = texture2D(sm,vB).b;",
    "gl_FragColor=vec4(a*r,a*g,a*b,1.0);",
    "}"
];