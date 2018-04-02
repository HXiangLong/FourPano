import HashTable from './HashTable';

export var REVISION = '2.0'; //版本号
export var revision_type = 1; //版本类型 1-PC版 2-手机版 3-编辑版本
export var stats = ""; //性能监视
export var camera = ""; //相机
export var scene = ""; //场景
export var renderer = ""; //渲染
export var c_SkyBoxType = 1; //天空盒子的类型 1为六面体 2为球体
export var c_TileZoom = 2; //缩放第几等级
export var c_Maxfov = 68; //最大视角
export var c_Minfov = 20; //最小视角
export var c_ThumbnailSize = 128; //缩略图尺寸
export var c_FaceDistance = 4096; //面距离
export var c_WallDisplaySize = 20; //面片缩放比例
export var c_OpenGLToDS3Mx4 = new THREE.Matrix4().fromArray([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]); //坐标转换矩阵。坐标系 OpenGL -> 3DS
export var c_DS3ToOpenGLMx4 = new THREE.Matrix4().getInverse(c_OpenGLToDS3Mx4); //坐标转换矩阵。坐标系 3DS -> OpenGL
export var c_JumpMarkerID = ""; //跳转之后需要看向的标注ID

export var c_isPreviewImageLoadEnd = true; //是否加载缩略图中
export var c_isMeasureStatus = false; //测量状态
export var c_isWallProbeSurfacePlusShow = false; //墙面探面加减号是否显示
export var c_isEditorStatus = false; //是否是编辑状态
export var c_isEditorStatus_MarkerPoint = false; //是否是编辑状态下的打标注
export var c_isEditorStatus_ArrowPoint = false; //是否是编辑状态下的移动箭头
export var c_isEditorStatus_ArrowPoint_Select = false; //是否是编辑状态下的移动箭头
export var c_isEditorStatus_ArrowObj = undefined; //是否是编辑状态下的移动箭头
export var c_isModelDisplayStatus = false; //是否3D模型显示状态
export var c_isWallClickRotateBoo = false; //是否跳转之后进行旋转相机看向点击位置
export var c_isThumbnailsRotateBoo = false; //展厅跳转之后看向展厅大门
export var c_loadLocalData = false; //是否读取本地数据类型（适用于没有面片数据的单机版）

export var c_previewImage = undefined; //缩略图对象
export var c_wallClickRotateV3 = new THREE.Vector3(); //跳转之后进行旋转相机看向点击位置
export var c_wallStartPoint = new THREE.Vector3(); //墙面鼠标按下位置
export var c_faceArr = []; //面数组
export var c_viewTileArr = []; //当前已经加载瓦片
export var c_datGuiArr = []; //基础属性值 
export var c_arrowArr = []; //所有箭头对象
export var c_FloorsMapTable = new HashTable(); //楼层集合
export var c_allFacadeByPanoIDInfoTbale = new HashTable(); //所有墙面片集合
export var c_facadeByPanoIDInfoArr = []; //当前站点所需要的墙面片集合
export var c_AdjacentPanoInfoArr = []; //老箭头集合
export var c_ArrowPanoInfoArr = []; //新箭头集合
export var c_smallVideoArr = []; //视频集合
export var c_markerInfoArr = []; //所有标注数据集合（点，面）
export var c_markerMeshArr = []; //所有标注集合（点，面）
export var c_thumbnailsForMuseum = []; //推荐展厅数据集合
export var c_allExhibitsForBuildingTable = new HashTable(); //所有推荐文物信息列表
export var c_multiDataByParentIDTable = new HashTable(); //单个文物详细信息
export var c_clock = new THREE.Clock(); //计时器
export var c_StationInfo = undefined; //当前站点基本信息

//实例化对象
export var sw_getService; //数据
export var sw_cameraManage; //相机控制
export var sw_mouseControl; //鼠标控制
export var sw_minMap //小地图
export var sw_skySphere; //球形盒子
export var sw_skyBox; //六面体
export var sw_groundMesh; //地面
export var sw_measure; //测量
export var sw_wallMesh; //墙面片
export var sw_wallProbeSurface; //墙面探面
export var sw_thumbnailsItems; //推荐展厅
export var sw_markerExhibits; //标注说明
export var sw_markPoint; //打标注类
export var sw_hotPhotoWall; //热点文物墙