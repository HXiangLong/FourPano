// 最小图像缩放级别
export const MIN_ZOOM_LEVEL = 0;

// 最大图像缩放级别
export const MAX_ZOOM_LEVEL = 300;

// 前一个和下一个缩放级别之间的大小比率
export const ZOOM_RATIO = 1.007;

// 单击缩放按钮时增加/减少缩放级别的程度
export const ZOOM_BUTTON_INCREMENT_SIZE = 100;

// 用于判断启动图像移动所需的水平滚动量
export const WHEEL_MOVE_X_THRESHOLD = 200;

// 用于判断启动缩放操作所需的垂直滚动量
export const WHEEL_MOVE_Y_THRESHOLD = 1;

export const KEYS = {
    ESC: 27,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
};

// 操作
export const ACTION_NONE = 0;
export const ACTION_MOVE = 1;
export const ACTION_SWIPE = 2;
export const ACTION_PINCH = 3;
export const ACTION_ROTATE = 4;

// 事件来源
export const SOURCE_ANY = 0;
export const SOURCE_MOUSE = 1;
export const SOURCE_TOUCH = 2;
export const SOURCE_POINTER = 3;

// 最小滑动距离
export const MIN_SWIPE_DISTANCE = 200;