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
/**天空盒子的类型 1为六面体 2为球体*/
export var c_SkyBoxType = 1;
/**缩放第几等级*/
export var c_TileZoom = 2;
/**最大视角*/
export var c_Maxfov = 68;
/**最小视角*/
export var c_Minfov = 20;
/** 最大俯仰角*/
export var c_maxPitch = 85;
/**最小俯仰角*/
export var c_minPitch = -85;
/**缩略图尺寸*/
export var c_ThumbnailSize = 128;
/**面距离*/
export var c_FaceDistance = 4096;
/**面片缩放比例*/
export var c_WallDisplaySize = 20;
/**地面片缩放比例*/
export var c_groundDisplaySize = -500;
/**漫游倍数 */
export var c_roamingMultiple = 5;
/**偏差角 */
export var c_deviationAngle = -145;
/**跳转之后需要看向的标注ID*/
export var c_JumpMarkerID = "";
/**小地图点击放大的站点名称*/
export var c_minMapClickPanoID = "";
/**当前点赞的是哪个编号 */
export var c_likeToExhibitID = "";
/**上一站全景ID */
export var c_LastStopPanoID = "";
/**坐标转换矩阵。坐标系 OpenGL -> 3DS*/
export var c_OpenGLToDS3Mx4 = new THREE.Matrix4().fromArray([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
/**坐标转换矩阵。坐标系 3DS -> OpenGL*/
export var c_DS3ToOpenGLMx4 = new THREE.Matrix4().getInverse(c_OpenGLToDS3Mx4);
/**跳转之后进行旋转相机看向点击位置*/
export var c_wallClickRotateV3 = new THREE.Vector3();
/**墙面鼠标按下位置*/
export var c_wallStartPoint = new THREE.Vector3();

/**初始化完成之后是否弹出展厅推荐列表 */
export var c_thumbnailsShow = false;
/**漫游状态 */
export var c_roamingStatus = false;
/**是否显示探面 */
export var c_isDisplayFace = true;
/**测量状态*/
export var c_isMeasureStatus = false;
/**false-网络版，true-单机版 */
export var c_isSingleVision = false;
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

/**跳转是否完毕 */
export var c_JumpCompleted = false;
/**是否加载缩略图中 */
export var c_isPreviewImageLoadEnd = true;
/**墙面探面加减号是否显示*/
export var c_isWallProbeSurfacePlusShow = false;
/**是否是编辑状态*/
export var c_isEditorStatus = false;
/**是否是编辑状态下的打标注*/
export var c_isEditorStatus_MarkerPoint = false;
/**是否是编辑状态下的移动箭头*/
export var c_isEditorStatus_ArrowPoint = false;
/**是否是编辑状态下的移动箭头*/
export var c_isEditorStatus_ArrowPoint_Select = false;
/**是否是编辑状态下的移动箭头*/
export var c_isEditorStatus_ArrowObj = undefined;
/**是否3D模型显示状态*/
export var c_isModelDisplayStatus = false;
/**是否跳转之后进行旋转相机看向点击位置*/
export var c_isWallClickRotateBoo = false;
/**展厅跳转之后看向展厅大门*/
export var c_isThumbnailsRotateBoo = false;
/**是否读取本地数据类型（适用于没有面片数据的单机版）*/
export var c_isloadLocalDataBoo = false;


/**面数组*/
export var c_faceArr = [];
/**当前已经加载瓦片*/
export var c_viewTileArr = [];
/**基础属性值 */
export var c_datGuiArr = [];
/**所有箭头对象*/
export var c_arrowArr = [];
/**楼层集合*/
export var c_FloorsMapTable = new HashTable();
/**所有站点集合 */
export var c_panoIDTable = new HashTable();
/**所有墙面片集合*/
export var c_allFacadeByPanoIDInfoTbale = new HashTable();
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
/**单个文物详细信息*/
export var c_multiDataByParentIDTable = new HashTable();
/**计时器*/
export var c_clock = new THREE.Clock();
/**当前站点基本信息*/
export var c_StationInfo;
/**缩略图对象*/
export var c_previewImage = undefined;
/**跳转过程中的过渡球*/
export var c_jumpSphere = undefined;
/**所有视频集合 */
export var c_allVideoTable = new HashTable();


//实例化对象
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

export var fs_hdr = `
    uniform sampler2D   tDiffuse;
    uniform float       exposure;
    uniform float       brightMax;

    varying vec2  vUv;

    vec3 decode_pnghdr( const in vec4 color ) {

        // remove gamma correction
        vec4 res = color * color;

        // decoded RI
        float ri = pow( 2.0, res.w * 32.0 - 16.0 );

        // decoded HDR pixel
        res.xyz = res.xyz * ri;
        return res.xyz;

    }

    void main()	{

        vec4 color = texture2D( tDiffuse, vUv );
        color.xyz  = decode_pnghdr( color );

        // apply gamma correction and exposure
        //gl_FragColor = vec4( pow( exposure * color.xyz, vec3( 0.474 ) ), 1.0 );

        // Perform tone-mapping
        float Y = dot(vec4(0.30, 0.59, 0.11, 0.0), color);
        float YD = exposure * (exposure/brightMax + 1.0) / (exposure + 1.0);
        color *= YD;

        gl_FragColor = vec4( color.xyz, 1.0 );
    }`;

export var vs_hdr = `
    varying vec2 vUv;

    void main()	{
        vUv  = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`;