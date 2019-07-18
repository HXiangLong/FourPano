/**
 * 参考：https://github.com/frontend-collective/react-image-lightbox
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { translate, getWindowWidth, getWindowHeight, getHighestSafeWindowContext } from './util';
import {
	KEYS,
	MIN_ZOOM_LEVEL,
	MAX_ZOOM_LEVEL,
	ZOOM_RATIO,
	WHEEL_MOVE_X_THRESHOLD,
	WHEEL_MOVE_Y_THRESHOLD,
	ZOOM_BUTTON_INCREMENT_SIZE,
	ACTION_NONE,
	ACTION_MOVE,
	ACTION_SWIPE,
	ACTION_PINCH,
	SOURCE_ANY,
	SOURCE_MOUSE,
	SOURCE_TOUCH,
	SOURCE_POINTER,
	MIN_SWIPE_DISTANCE
} from './constant';
import './style.css';

class ReactImageLightbox extends Component {
	static isTargetMatchImage(target) {
		return target && /ril-image-current/.test(target.className);
	}

	static parseMouseEvent(mouseEvent) {
		return {
			id: 'mouse',
			source: SOURCE_MOUSE,
			x: parseInt(mouseEvent.clientX, 10),
			y: parseInt(mouseEvent.clientY, 10)
		};
	}

	static parseTouchPointer(touchPointer) {
		return {
			id: touchPointer.identifier,
			source: SOURCE_TOUCH,
			x: parseInt(touchPointer.clientX, 10),
			y: parseInt(touchPointer.clientY, 10)
		};
	}

	static parsePointerEvent(pointerEvent) {
		return {
			id: pointerEvent.pointerId,
			source: SOURCE_POINTER,
			x: parseInt(pointerEvent.clientX, 10),
			y: parseInt(pointerEvent.clientY, 10)
		};
	}

	// 请求转换到上一个图像
	static getTransform({ x = 0, y = 0, zoom = 1, width, targetWidth }) {
		let nextX = x;
		const windowWidth = getWindowWidth();
		if (width > windowWidth) {
			nextX += (windowWidth - width) / 2;
		}
		const scaleFactor = zoom * (targetWidth / width);

		return {
			transform: `translate3d(${nextX}px,${y}px,0) scale3d(${scaleFactor},${scaleFactor},1)`
		};
	}

	constructor(props) {
		super(props);

		this.state = {
			//-----------------------------
			// 动画
			//-----------------------------

			//灯箱正在关闭
			//安装Lightbox时，如果启用了动画，它将以关闭动画的反向打开
			isClosing: !props.animationDisabled,

			// 组件部件应该设置动画（例如，当图像移动或图像被缩放时）
			shouldAnimate: false,

			//缩放设置
			//-----------------------------
			//缩放图像级别
			//-----------------------------
			zoomLevel: MIN_ZOOM_LEVEL,

			//图像位置设置
			//-----------------------------
			//从中心水平偏移
			//-----------------------------
			offsetX: 0,

			// 垂直偏离中心
			offsetY: 0,

			// srcType的图像加载错误
			loadErrorStatus: {}
		};

		this.closeIfClickInner = this.closeIfClickInner.bind(this);
		this.handleImageDoubleClick = this.handleImageDoubleClick.bind(this);
		this.handleImageMouseWheel = this.handleImageMouseWheel.bind(this);
		this.handleKeyInput = this.handleKeyInput.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleOuterMousewheel = this.handleOuterMousewheel.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.handlePointerEvent = this.handlePointerEvent.bind(this);
		this.handleCaptionMousewheel = this.handleCaptionMousewheel.bind(this);
		this.handleWindowResize = this.handleWindowResize.bind(this);
		this.handleZoomInButtonClick = this.handleZoomInButtonClick.bind(this);
		this.handleZoomOutButtonClick = this.handleZoomOutButtonClick.bind(this);
		this.requestClose = this.requestClose.bind(this);
		this.requestMoveNext = this.requestMoveNext.bind(this);
		this.requestMovePrev = this.requestMovePrev.bind(this);
	}

	componentWillMount() {
		// 超时 - 在卸载前始终清除它
		this.timeouts = [];

		// 目前的行动
		this.currentAction = ACTION_NONE;

		// 事件来源
		this.eventsSource = SOURCE_ANY;

		// 空指针列表
		this.pointerList = [];

		// 防止内部关闭
		this.preventInnerClose = false;
		this.preventInnerCloseTimeout = null;

		// 用于在更改props.mainSrc | nextSrc | prevSrc时禁用动画
		this.keyPressed = false;

		// 用于存储图像的负载状态/尺寸
		this.imageCache = {};

		// 调用最后一个keydown事件的时间（用于键盘动作速率限制）
		this.lastKeyDownTime = 0;

		// 用于去抖窗口调整大小事件
		this.resizeTimeout = null;

		// 用于确定滚轮触发动作的时间
		this.wheelActionTimeout = null;
		this.resetScrollTimeout = null;
		this.scrollX = 0;
		this.scrollY = 0;

		// 用于平移缩放图像
		this.moveStartX = 0;
		this.moveStartY = 0;
		this.moveStartOffsetX = 0;
		this.moveStartOffsetY = 0;

		// 用于滑动
		this.swipeStartX = 0;
		this.swipeStartY = 0;
		this.swipeEndX = 0;
		this.swipeEndY = 0;

		// 用来捏
		this.pinchTouchList = null;
		this.pinchDistance = 0;

		// 用于区分具有相同src的图像
		this.keyCounter = 0;

		// 用于在所有src保持不变的情况下检测移动（连续四个或更多相同的图像）
		this.moveRequested = false;

		if (!this.props.animationDisabled) {
			// 打开动画片
			this.setState({ isClosing: false });
		}
	}

	componentDidMount() {
		// 使用跨源iframe时防止出现跨源错误
		this.windowContext = getHighestSafeWindowContext();

		this.listeners = {
			resize: this.handleWindowResize,
			mouseup: this.handleMouseUp,
			touchend: this.handleTouchEnd,
			touchcancel: this.handleTouchEnd,
			pointerdown: this.handlePointerEvent,
			pointermove: this.handlePointerEvent,
			pointerup: this.handlePointerEvent,
			pointercancel: this.handlePointerEvent
		};
		Object.keys(this.listeners).forEach((type) => {
			this.windowContext.addEventListener(type, this.listeners[type]);
		});

		this.loadAllImages();
	}

	componentWillReceiveProps(nextProps) {
		//遍历prevProps和nextProps的源类型
		//确定是否有任何来源发生了变化
		let sourcesChanged = false;
		const prevSrcDict = {};
		const nextSrcDict = {};
		this.getSrcTypes().forEach((srcType) => {
			if (this.props[srcType.name] !== nextProps[srcType.name]) {
				sourcesChanged = true;

				prevSrcDict[this.props[srcType.name]] = true;
				nextSrcDict[nextProps[srcType.name]] = true;
			}
		});

		if (sourcesChanged || this.moveRequested) {
			//重置下次未呈现的图像的加载状态
			Object.keys(prevSrcDict).forEach((prevSrc) => {
				if (!(prevSrc in nextSrcDict) && prevSrc in this.imageCache) {
					this.imageCache[prevSrc].loaded = false;
				}
			});

			this.moveRequested = false;

			//加载任何新图像
			this.loadAllImages(nextProps);
		}
	}

	shouldComponentUpdate() {
		//等等搬家......
		return !this.moveRequested;
	}

	componentWillUnmount() {
		this.didUnmount = true;
		Object.keys(this.listeners).forEach((type) => {
			this.windowContext.removeEventListener(type, this.listeners[type]);
		});
		this.timeouts.forEach((tid) => clearTimeout(tid));
	}

	setTimeout(func, time) {
		const id = setTimeout(() => {
			this.timeouts = this.timeouts.filter((tid) => tid !== id);
			func();
		}, time);
		this.timeouts.push(id);
		return id;
	}

	setPreventInnerClose() {
		if (this.preventInnerCloseTimeout) {
			this.clearTimeout(this.preventInnerCloseTimeout);
		}
		this.preventInnerClose = true;
		this.preventInnerCloseTimeout = this.setTimeout(() => {
			this.preventInnerClose = false;
			this.preventInnerCloseTimeout = null;
		}, 100);
	}

	//获取要使用给定srcType显示的最适合图像的信息
	getBestImageForType(srcType) {
		let imageSrc = this.props[srcType];
		let fitSizes = {};

		if (this.isImageLoaded(imageSrc)) {
			// 如果可用，请使用全尺寸图像
			fitSizes = this.getFitSizes(this.imageCache[imageSrc].width, this.imageCache[imageSrc].height);
		} else if (this.isImageLoaded(this.props[`${srcType}Thumbnail`])) {
			// 如果尚未加载图像，则回退到使用缩略图
			imageSrc = this.props[`${srcType}Thumbnail`];
			fitSizes = this.getFitSizes(this.imageCache[imageSrc].width, this.imageCache[imageSrc].height, true);
		} else {
			return null;
		}

		return {
			src: imageSrc,
			height: this.imageCache[imageSrc].height,
			width: this.imageCache[imageSrc].width,
			targetHeight: fitSizes.height,
			targetWidth: fitSizes.width
		};
	}

	// 获取图像大于窗口时的大小
	getFitSizes(width, height, stretch) {
		const boxSize = this.getLightboxRect();
		let maxHeight = boxSize.height - this.props.imagePadding * 2;
		let maxWidth = boxSize.width - this.props.imagePadding * 2;

		if (!stretch) {
			maxHeight = Math.min(maxHeight, height);
			maxWidth = Math.min(maxWidth, width);
		}

		const maxRatio = maxWidth / maxHeight;
		const srcRatio = width / height;

		if (maxRatio > srcRatio) {
			//高度是照片的约束尺寸
			return {
				width: width * maxHeight / height,
				height: maxHeight
			};
		}

		return {
			width: maxWidth,
			height: height * maxWidth / width
		};
	}

	getMaxOffsets(zoomLevel = this.state.zoomLevel) {
		const currentImageInfo = this.getBestImageForType('mainSrc');
		if (currentImageInfo === null) {
			return { maxX: 0, minX: 0, maxY: 0, minY: 0 };
		}

		const boxSize = this.getLightboxRect();
		const zoomMultiplier = this.getZoomMultiplier(zoomLevel);

		let maxX = 0;
		if (zoomMultiplier * currentImageInfo.width - boxSize.width < 0) {
			// 如果X维度中仍有空格，则不要限制除相反边缘外
			maxX = (boxSize.width - zoomMultiplier * currentImageInfo.width) / 2;
		} else {
			maxX = (zoomMultiplier * currentImageInfo.width - boxSize.width) / 2;
		}

		let maxY = 0;
		if (zoomMultiplier * currentImageInfo.height - boxSize.height < 0) {
			// 如果Y尺寸中仍有空白，则除了相反的边缘外不要限制
			maxY = (boxSize.height - zoomMultiplier * currentImageInfo.height) / 2;
		} else {
			maxY = (zoomMultiplier * currentImageInfo.height - boxSize.height) / 2;
		}

		return {
			maxX,
			maxY,
			minX: -1 * maxX,
			minY: -1 * maxY
		};
	}

	//获取图像src类型
	getSrcTypes() {
		return [
			{
				name: 'mainSrc',
				keyEnding: `i${this.keyCounter}`
			},
			{
				name: 'mainSrcThumbnail',
				keyEnding: `t${this.keyCounter}`
			},
			{
				name: 'nextSrc',
				keyEnding: `i${this.keyCounter + 1}`
			},
			{
				name: 'nextSrcThumbnail',
				keyEnding: `t${this.keyCounter + 1}`
			},
			{
				name: 'prevSrc',
				keyEnding: `i${this.keyCounter - 1}`
			},
			{
				name: 'prevSrcThumbnail',
				keyEnding: `t${this.keyCounter - 1}`
			}
		];
	}

	/**
   * 缩放图像时获取大小
   */
	getZoomMultiplier(zoomLevel = this.state.zoomLevel) {
		return ZOOM_RATIO ** zoomLevel;
	}

	/**
   * 以像素为单位获取灯箱的大小
   */
	getLightboxRect() {
		if (this.outerEl) {
			return this.outerEl.getBoundingClientRect();
		}

		return {
			width: getWindowWidth(),
			height: getWindowHeight(),
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};
	}

	clearTimeout(id) {
		this.timeouts = this.timeouts.filter((tid) => tid !== id);
		clearTimeout(id);
	}

	// 更改缩放级别
	changeZoom(zoomLevel, clientX, clientY) {
		// 如果禁用缩放，请忽略
		if (!this.props.enableZoom) {
			return;
		}

		//将缩放级别约束到设定范围
		const nextZoomLevel = Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, zoomLevel));

		// 忽略不更改缩放级别的请求
		if (nextZoomLevel === this.state.zoomLevel) {
			return;
		} else if (nextZoomLevel === MIN_ZOOM_LEVEL) {
			// 如果完全缩小，则快速回到中心
			this.setState({
				zoomLevel: nextZoomLevel,
				offsetX: 0,
				offsetY: 0
			});

			return;
		}

		const imageBaseSize = this.getBestImageForType('mainSrc');
		if (imageBaseSize === null) {
			return;
		}

		const currentZoomMultiplier = this.getZoomMultiplier();
		const nextZoomMultiplier = this.getZoomMultiplier(nextZoomLevel);

		// 未指定鼠标位置时，默认为要缩放的图像中心
		const boxRect = this.getLightboxRect();
		const pointerX = typeof clientX !== 'undefined' ? clientX - boxRect.left : boxRect.width / 2;
		const pointerY = typeof clientY !== 'undefined' ? clientY - boxRect.top : boxRect.height / 2;

		const currentImageOffsetX = (boxRect.width - imageBaseSize.width * currentZoomMultiplier) / 2;
		const currentImageOffsetY = (boxRect.height - imageBaseSize.height * currentZoomMultiplier) / 2;

		const currentImageRealOffsetX = currentImageOffsetX - this.state.offsetX;
		const currentImageRealOffsetY = currentImageOffsetY - this.state.offsetY;

		const currentPointerXRelativeToImage = (pointerX - currentImageRealOffsetX) / currentZoomMultiplier;
		const currentPointerYRelativeToImage = (pointerY - currentImageRealOffsetY) / currentZoomMultiplier;

		const nextImageRealOffsetX = pointerX - currentPointerXRelativeToImage * nextZoomMultiplier;
		const nextImageRealOffsetY = pointerY - currentPointerYRelativeToImage * nextZoomMultiplier;

		const nextImageOffsetX = (boxRect.width - imageBaseSize.width * nextZoomMultiplier) / 2;
		const nextImageOffsetY = (boxRect.height - imageBaseSize.height * nextZoomMultiplier) / 2;

		let nextOffsetX = nextImageOffsetX - nextImageRealOffsetX;
		let nextOffsetY = nextImageOffsetY - nextImageRealOffsetY;

		// 缩小时，限制偏移量，以免歪斜
		if (this.currentAction !== ACTION_PINCH) {
			const maxOffsets = this.getMaxOffsets();
			if (this.state.zoomLevel > nextZoomLevel) {
				nextOffsetX = Math.max(maxOffsets.minX, Math.min(maxOffsets.maxX, nextOffsetX));
				nextOffsetY = Math.max(maxOffsets.minY, Math.min(maxOffsets.maxY, nextOffsetY));
			}
		}

		this.setState({
			zoomLevel: nextZoomLevel,
			offsetX: nextOffsetX,
			offsetY: nextOffsetY
		});
	}

	closeIfClickInner(event) {
		if (!this.preventInnerClose && event.target.className.search(/\bril-inner\b/) > -1) {
			this.requestClose(event);
		}
	}

	/**
   * 处理用户键盘操作
   */
	handleKeyInput(event) {
		event.stopPropagation();

		// 在动画期间忽略键输入
		if (this.isAnimating()) {
			return;
		}

		// 当用户反复按键时，允许稍微更快地导航图像
		if (event.type === 'keyup') {
			this.lastKeyDownTime -= this.props.keyRepeatKeyupBonus;
			return;
		}

		const keyCode = event.which || event.keyCode; //但是如果它是灯箱关闭动作则允许它

		//忽略相互靠近的按键（按下快速按键或按住键时）
		const currentTime = new Date();
		if (currentTime.getTime() - this.lastKeyDownTime < this.props.keyRepeatLimit && keyCode !== KEYS.ESC) {
			return;
		}
		this.lastKeyDownTime = currentTime.getTime();

		switch (keyCode) {
			// ESC键关闭灯箱
			case KEYS.ESC:
				event.preventDefault();
				this.requestClose(event);
				break;

			// 左箭头键移动到上一个图像
			case KEYS.LEFT_ARROW:
				if (!this.props.prevSrc) {
					return;
				}

				event.preventDefault();
				this.keyPressed = true;
				this.requestMovePrev(event);
				break;

			// 右箭头键移动到下一个图像
			case KEYS.RIGHT_ARROW:
				if (!this.props.nextSrc) {
					return;
				}

				event.preventDefault();
				this.keyPressed = true;
				this.requestMoveNext(event);
				break;

			default:
		}
	}

	/**
   * 在灯箱容器上处理鼠标滚轮事件
   */
	handleOuterMousewheel(event) {
		// 防止滚动背景
		event.preventDefault();
		event.stopPropagation();

		const xThreshold = WHEEL_MOVE_X_THRESHOLD;
		let actionDelay = 0;
		const imageMoveDelay = 500;

		this.clearTimeout(this.resetScrollTimeout);
		this.resetScrollTimeout = this.setTimeout(() => {
			this.scrollX = 0;
			this.scrollY = 0;
		}, 300);

		// 防止快速变焦行为
		if (this.wheelActionTimeout !== null || this.isAnimating()) {
			return;
		}

		if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
			// 处理水平滚动与图像移动
			this.scrollY = 0;
			this.scrollX += event.deltaX;

			const bigLeapX = xThreshold / 2;
			// 如果滚动量已经充分累积，或者进行了大的跳跃
			if (this.scrollX >= xThreshold || event.deltaX >= bigLeapX) {
				// 向右滚动移动到下一个
				this.requestMoveNext(event);
				actionDelay = imageMoveDelay;
				this.scrollX = 0;
			} else if (this.scrollX <= -1 * xThreshold || event.deltaX <= -1 * bigLeapX) {
				// 向左滚动移动到上一个
				this.requestMovePrev(event);
				actionDelay = imageMoveDelay;
				this.scrollX = 0;
			}
		}

		// 在设定的延迟后允许连续动作
		if (actionDelay !== 0) {
			this.wheelActionTimeout = this.setTimeout(() => {
				this.wheelActionTimeout = null;
			}, actionDelay);
		}
	}

	handleImageMouseWheel(event) {
		event.preventDefault();
		const yThreshold = WHEEL_MOVE_Y_THRESHOLD;

		if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
			event.stopPropagation();
			// 如果垂直滚动量足够大，请执行缩放
			if (Math.abs(event.deltaY) < yThreshold) {
				return;
			}

			this.scrollX = 0;
			this.scrollY += event.deltaY;

			this.changeZoom(this.state.zoomLevel - event.deltaY, event.clientX, event.clientY);
		}
	}

	/**
   * 双击当前图像
   */
	handleImageDoubleClick(event) {
		if (this.state.zoomLevel > MIN_ZOOM_LEVEL) {
			// 放大时双击可以完全缩小
			this.changeZoom(MIN_ZOOM_LEVEL, event.clientX, event.clientY);
		} else {
			// 完全缩放时双击放大
			this.changeZoom(this.state.zoomLevel + ZOOM_BUTTON_INCREMENT_SIZE, event.clientX, event.clientY);
		}
	}

	shouldHandleEvent(source) {
		if (this.eventsSource === source) {
			return true;
		}
		if (this.eventsSource === SOURCE_ANY) {
			this.eventsSource = source;
			return true;
		}
		switch (source) {
			case SOURCE_MOUSE:
				return false;
			case SOURCE_TOUCH:
				this.eventsSource = SOURCE_TOUCH;
				this.filterPointersBySource();
				return true;
			case SOURCE_POINTER:
				if (this.eventsSource === SOURCE_MOUSE) {
					this.eventsSource = SOURCE_POINTER;
					this.filterPointersBySource();
					return true;
				}
				return false;
			default:
				return false;
		}
	}

	addPointer(pointer) {
		this.pointerList.push(pointer);
	}

	removePointer(pointer) {
		this.pointerList = this.pointerList.filter(({ id }) => id !== pointer.id);
	}

	filterPointersBySource() {
		this.pointerList = this.pointerList.filter(({ source }) => source === this.eventsSource);
	}

	handleMouseDown(event) {
		if (this.shouldHandleEvent(SOURCE_MOUSE) && ReactImageLightbox.isTargetMatchImage(event.target)) {
			this.addPointer(ReactImageLightbox.parseMouseEvent(event));
			this.multiPointerStart(event);
		}
	}

	handleMouseMove(event) {
		if (this.shouldHandleEvent(SOURCE_MOUSE)) {
			this.multiPointerMove(event, [ ReactImageLightbox.parseMouseEvent(event) ]);
		}
	}

	handleMouseUp(event) {
		if (this.shouldHandleEvent(SOURCE_MOUSE)) {
			this.removePointer(ReactImageLightbox.parseMouseEvent(event));
			this.multiPointerEnd(event);
		}
	}

	handlePointerEvent(event) {
		if (this.shouldHandleEvent(SOURCE_POINTER)) {
			switch (event.type) {
				case 'pointerdown':
					if (ReactImageLightbox.isTargetMatchImage(event.target)) {
						this.addPointer(ReactImageLightbox.parsePointerEvent(event));
						this.multiPointerStart(event);
					}
					break;
				case 'pointermove':
					this.multiPointerMove(event, [ ReactImageLightbox.parsePointerEvent(event) ]);
					break;
				case 'pointerup':
				case 'pointercancel':
					this.removePointer(ReactImageLightbox.parsePointerEvent(event));
					this.multiPointerEnd(event);
					break;
				default:
					break;
			}
		}
	}

	handleTouchStart(event) {
		if (this.shouldHandleEvent(SOURCE_TOUCH) && ReactImageLightbox.isTargetMatchImage(event.target)) {
			[].forEach.call(event.changedTouches, (eventTouch) =>
				this.addPointer(ReactImageLightbox.parseTouchPointer(eventTouch))
			);
			this.multiPointerStart(event);
		}
	}

	handleTouchMove(event) {
		if (this.shouldHandleEvent(SOURCE_TOUCH)) {
			this.multiPointerMove(
				event,
				[].map.call(event.changedTouches, (eventTouch) => ReactImageLightbox.parseTouchPointer(eventTouch))
			);
		}
	}

	handleTouchEnd(event) {
		if (this.shouldHandleEvent(SOURCE_TOUCH)) {
			[].map.call(event.changedTouches, (touch) =>
				this.removePointer(ReactImageLightbox.parseTouchPointer(touch))
			);
			this.multiPointerEnd(event);
		}
	}

	decideMoveOrSwipe(pointer) {
		if (this.state.zoomLevel <= MIN_ZOOM_LEVEL) {
			this.handleSwipeStart(pointer);
		} else {
			this.handleMoveStart(pointer);
		}
	}

	multiPointerStart(event) {
		this.handleEnd(null);
		switch (this.pointerList.length) {
			case 1: {
				event.preventDefault();
				this.decideMoveOrSwipe(this.pointerList[0]);
				break;
			}
			case 2: {
				event.preventDefault();
				this.handlePinchStart(this.pointerList);
				break;
			}
			default:
				break;
		}
	}

	multiPointerMove(event, pointerList) {
		switch (this.currentAction) {
			case ACTION_MOVE: {
				event.preventDefault();
				this.handleMove(pointerList[0]);
				break;
			}
			case ACTION_SWIPE: {
				event.preventDefault();
				this.handleSwipe(pointerList[0]);
				break;
			}
			case ACTION_PINCH: {
				event.preventDefault();
				this.handlePinch(pointerList);
				break;
			}
			default:
				break;
		}
	}

	multiPointerEnd(event) {
		if (this.currentAction !== ACTION_NONE) {
			this.setPreventInnerClose();
			this.handleEnd(event);
		}
		switch (this.pointerList.length) {
			case 0: {
				this.eventsSource = SOURCE_ANY;
				break;
			}
			case 1: {
				event.preventDefault();
				this.decideMoveOrSwipe(this.pointerList[0]);
				break;
			}
			case 2: {
				event.preventDefault();
				this.handlePinchStart(this.pointerList);
				break;
			}
			default:
				break;
		}
	}

	handleEnd(event) {
		switch (this.currentAction) {
			case ACTION_MOVE:
				this.handleMoveEnd(event);
				break;
			case ACTION_SWIPE:
				this.handleSwipeEnd(event);
				break;
			case ACTION_PINCH:
				this.handlePinchEnd(event);
				break;
			default:
				break;
		}
	}

	// 有时候是这样的：
	// - 在mouseDown事件上
	// - 在touchstart事件上
	//处理灯箱容器上的移动开始
	handleMoveStart({ x: clientX, y: clientY }) {
		if (!this.props.enableZoom) {
			return;
		}
		this.currentAction = ACTION_MOVE;
		this.moveStartX = clientX;
		this.moveStartY = clientY;
		this.moveStartOffsetX = this.state.offsetX;
		this.moveStartOffsetY = this.state.offsetY;
	}

	// 有时候是这样的：
	// - 在mouseDown之后和mouseUp事件之前
	// - 触摸开始之后和touchend事件之前
	//处理灯箱容器上的拖动
	handleMove({ x: clientX, y: clientY }) {
		const newOffsetX = this.moveStartX - clientX + this.moveStartOffsetX;
		const newOffsetY = this.moveStartY - clientY + this.moveStartOffsetY;
		if (this.state.offsetX !== newOffsetX || this.state.offsetY !== newOffsetY) {
			this.setState({
				offsetX: newOffsetX,
				offsetY: newOffsetY
			});
		}
	}

	handleMoveEnd() {
		this.currentAction = ACTION_NONE;
		this.moveStartX = 0;
		this.moveStartY = 0;
		this.moveStartOffsetX = 0;
		this.moveStartOffsetY = 0;
		//如果超出最大偏移范围，则将图像重新捕捉到帧中
		const maxOffsets = this.getMaxOffsets();
		const nextOffsetX = Math.max(maxOffsets.minX, Math.min(maxOffsets.maxX, this.state.offsetX));
		const nextOffsetY = Math.max(maxOffsets.minY, Math.min(maxOffsets.maxY, this.state.offsetY));
		if (nextOffsetX !== this.state.offsetX || nextOffsetY !== this.state.offsetY) {
			this.setState({
				offsetX: nextOffsetX,
				offsetY: nextOffsetY,
				shouldAnimate: true
			});
			this.setTimeout(() => {
				this.setState({ shouldAnimate: false });
			}, this.props.animationDuration);
		}
	}

	handleSwipeStart({ x: clientX, y: clientY }) {
		this.currentAction = ACTION_SWIPE;
		this.swipeStartX = clientX;
		this.swipeStartY = clientY;
		this.swipeEndX = clientX;
		this.swipeEndY = clientY;
	}

	handleSwipe({ x: clientX, y: clientY }) {
		this.swipeEndX = clientX;
		this.swipeEndY = clientY;
	}

	handleSwipeEnd(event) {
		const xDiff = this.swipeEndX - this.swipeStartX;
		const xDiffAbs = Math.abs(xDiff);
		const yDiffAbs = Math.abs(this.swipeEndY - this.swipeStartY);

		this.currentAction = ACTION_NONE;
		this.swipeStartX = 0;
		this.swipeStartY = 0;
		this.swipeEndX = 0;
		this.swipeEndY = 0;

		if (!event || this.isAnimating() || xDiffAbs < yDiffAbs * 1.5) {
			return;
		}

		if (xDiffAbs < MIN_SWIPE_DISTANCE) {
			const boxRect = this.getLightboxRect();
			if (xDiffAbs < boxRect.width / 4) {
				return;
			}
		}

		if (xDiff > 0 && this.props.prevSrc) {
			event.preventDefault();
			this.requestMovePrev();
		} else if (xDiff < 0 && this.props.nextSrc) {
			event.preventDefault();
			this.requestMoveNext();
		}
	}

	calculatePinchDistance([ a, b ] = this.pinchTouchList) {
		return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
	}

	calculatePinchCenter([ a, b ] = this.pinchTouchList) {
		return {
			x: a.x - (a.x - b.x) / 2,
			y: a.y - (a.y - b.y) / 2
		};
	}

	handlePinchStart(pointerList) {
		if (!this.props.enableZoom) {
			return;
		}
		this.currentAction = ACTION_PINCH;
		this.pinchTouchList = pointerList.map(({ id, x, y }) => ({ id, x, y }));
		this.pinchDistance = this.calculatePinchDistance();
	}

	handlePinch(pointerList) {
		this.pinchTouchList = this.pinchTouchList.map((oldPointer) => {
			for (let i = 0; i < pointerList.length; i += 1) {
				if (pointerList[i].id === oldPointer.id) {
					return pointerList[i];
				}
			}

			return oldPointer;
		});

		const newDistance = this.calculatePinchDistance();

		const zoomLevel = this.state.zoomLevel + newDistance - this.pinchDistance;

		this.pinchDistance = newDistance;
		const { x: clientX, y: clientY } = this.calculatePinchCenter(this.pinchTouchList);
		this.changeZoom(zoomLevel, clientX, clientY);
	}

	handlePinchEnd() {
		this.currentAction = ACTION_NONE;
		this.pinchTouchList = null;
		this.pinchDistance = 0;
	}

	// 处理窗口调整大小事件
	handleWindowResize() {
		this.clearTimeout(this.resizeTimeout);
		this.resizeTimeout = this.setTimeout(this.forceUpdate.bind(this), 100);
	}

	handleZoomInButtonClick() {
		const nextZoomLevel = this.state.zoomLevel + ZOOM_BUTTON_INCREMENT_SIZE;
		this.changeZoom(nextZoomLevel);
		if (nextZoomLevel === MAX_ZOOM_LEVEL) {
			this.zoomOutBtn.focus();
		}
	}

	handleZoomOutButtonClick() {
		const nextZoomLevel = this.state.zoomLevel - ZOOM_BUTTON_INCREMENT_SIZE;
		this.changeZoom(nextZoomLevel);
		if (nextZoomLevel === MIN_ZOOM_LEVEL) {
			this.zoomInBtn.focus();
		}
	}

	handleCaptionMousewheel(event) {
		event.stopPropagation();

		if (!this.caption) {
			return;
		}

		const { height } = this.caption.getBoundingClientRect();
		const { scrollHeight, scrollTop } = this.caption;
		if ((event.deltaY > 0 && height + scrollTop >= scrollHeight) || (event.deltaY < 0 && scrollTop <= 0)) {
			event.preventDefault();
		}
	}

	// 分离键和鼠标输入事件
	isAnimating() {
		return this.state.shouldAnimate || this.state.isClosing;
	}

	// 检查图像是否已加载
	isImageLoaded(imageSrc) {
		return imageSrc && imageSrc in this.imageCache && this.imageCache[imageSrc].loaded;
	}

	// 从src加载图像并在加载时调用图像宽度和高度的回调
	loadImage(srcType, imageSrc, done) {
		// 如果图像信息已被缓存，则返回它
		if (this.isImageLoaded(imageSrc)) {
			this.setTimeout(() => {
				done();
			}, 1);
			return;
		}

		const inMemoryImage = new global.Image();

		if (this.props.imageCrossOrigin) {
			inMemoryImage.crossOrigin = this.props.imageCrossOrigin;
		}

		inMemoryImage.onerror = (errorEvent) => {
			this.props.onImageLoadError(imageSrc, srcType, errorEvent);

			// 无法加载所以设置状态loadErrorStatus
			this.setState((prevState) => ({
				loadErrorStatus: { ...prevState.loadErrorStatus, [srcType]: true }
			}));

			done(errorEvent);
		};

		inMemoryImage.onload = () => {
			this.props.onImageLoad(imageSrc, srcType, inMemoryImage);

			this.imageCache[imageSrc] = {
				loaded: true,
				width: inMemoryImage.width,
				height: inMemoryImage.height
			};

			done();
		};

		inMemoryImage.src = imageSrc;
	}

	// 加载所有图像及其缩略图
	loadAllImages(props = this.props) {
		const generateLoadDoneCallback = (srcType, imageSrc) => (err) => {
			// 放弃显示错误的图像
			if (err) {
				return;
			}

			//如果src与加载开始时不同，请不要重新渲染
			//或者组件是否已卸载
			if (this.props[srcType] !== imageSrc || this.didUnmount) {
				return;
			}

			// 使用新图像强制重新渲染
			this.forceUpdate();
		};

		// 加载图像
		this.getSrcTypes().forEach((srcType) => {
			const type = srcType.name;

			// 我们最初尝试加载时没有错误
			if (props[type] && this.state.loadErrorStatus[type]) {
				this.setState((prevState) => ({
					loadErrorStatus: { ...prevState.loadErrorStatus, [type]: false }
				}));
			}

			// 加载卸载的图像
			if (props[type] && !this.isImageLoaded(props[type])) {
				this.loadImage(type, props[type], generateLoadDoneCallback(type, props[type]));
			}
		});
	}

	// 要求关闭灯箱
	requestClose(event) {
		// 调用父关闭请求
		const closeLightbox = () => this.props.onCloseRequest(event);

		if (this.props.animationDisabled || (event.type === 'keydown' && !this.props.animationOnKeyInput)) {
			// 没有动画
			closeLightbox();
			return;
		}

		//用动画
		//开始关闭动画
		this.setState({ isClosing: true });

		// 在动画结束时执行实际关闭
		this.setTimeout(closeLightbox, this.props.animationDuration);
	}

	requestMove(direction, event) {
		// 在图像移动时重置缩放级别
		const nextState = {
			zoomLevel: MIN_ZOOM_LEVEL,
			offsetX: 0,
			offsetY: 0
		};

		// 启用动画状态
		if (!this.props.animationDisabled && (!this.keyPressed || this.props.animationOnKeyInput)) {
			nextState.shouldAnimate = true;
			this.setTimeout(() => this.setState({ shouldAnimate: false }), this.props.animationDuration);
		}
		this.keyPressed = false;

		this.moveRequested = true;

		if (direction === 'prev') {
			this.keyCounter -= 1;
			this.setState(nextState);
			this.props.onMovePrevRequest(event);
		} else {
			this.keyCounter += 1;
			this.setState(nextState);
			this.props.onMoveNextRequest(event);
		}
	}

	// 请求转换到下一个图像
	requestMoveNext(event) {
		this.requestMove('next', event);
	}

	// 请求转换到上一个图像
	requestMovePrev(event) {
		this.requestMove('prev', event);
	}

	render() {
		const {
			animationDisabled,
			animationDuration,
			clickOutsideToClose,
			discourageDownloads,
			enableZoom,
			imageTitle,
			nextSrc,
			prevSrc,
			toolbarButtons,
			reactModalStyle,
			onAfterOpen,
			imageCrossOrigin,
			reactModalProps
		} = this.props;
		const { zoomLevel, offsetX, offsetY, isClosing, loadErrorStatus } = this.state;

		const boxSize = this.getLightboxRect();
		let transitionStyle = {};

		// 滑动动画的过渡设置
		if (!animationDisabled && this.isAnimating()) {
			transitionStyle = {
				...transitionStyle,
				transition: `transform ${animationDuration}ms`
			};
		}

		// 用于区分具有相同src的图像的关键结尾
		const keyEndings = {};
		this.getSrcTypes().forEach(({ name, keyEnding }) => {
			keyEndings[name] = keyEnding;
		});

		// 要显示的图像
		const images = [];
		const addImage = (srcType, imageClass, transforms) => {
			// 忽略没有为其全尺寸图像定义源的类型
			if (!this.props[srcType]) {
				return;
			}
			const bestImageInfo = this.getBestImageForType(srcType);

			const imageStyle = {
				...transitionStyle,
				...ReactImageLightbox.getTransform({
					...transforms,
					...bestImageInfo
				})
			};

			if (zoomLevel > MIN_ZOOM_LEVEL) {
				imageStyle.cursor = 'move';
			}

			// 支持IE 9和11
			const hasTrueValue = (object) => Object.keys(object).some((key) => object[key]);

			// 当其中一个负载出现错误然后推送自定义错误的东西
			if (bestImageInfo === null && hasTrueValue(loadErrorStatus)) {
				images.push(
					<div
						className={`${imageClass} ril__image ril-errored`}
						style={imageStyle}
						key={this.props[srcType] + keyEndings[srcType]}
					>
						<div className="ril__errorContainer">{this.props.imageLoadErrorMessage}</div>
					</div>
				);

				return;
			} else if (bestImageInfo === null) {
				const loadingIcon = (
					<div className="ril-loading-circle ril__loadingCircle ril__loadingContainer__icon">
						{[ ...new Array(12) ].map((_, index) => (
							<div
								// eslint-disable-next-line react/no-array-index-key
								key={index}
								className="ril-loading-circle-point ril__loadingCirclePoint"
							/>
						))}
					</div>
				);

				// 如果尚未加载缩略图，则返回加载图标
				images.push(
					<div
						className={`${imageClass} ril__image ril-not-loaded`}
						style={imageStyle}
						key={this.props[srcType] + keyEndings[srcType]}
					>
						<div className="ril__loadingContainer">{loadingIcon}</div>
					</div>
				);

				return;
			}

			const imageSrc = bestImageInfo.src;
			if (discourageDownloads) {
				imageStyle.backgroundImage = `url('${imageSrc}')`;
				images.push(
					<div
						className={`${imageClass} ril__image ril__imageDiscourager`}
						onDoubleClick={this.handleImageDoubleClick}
						onWheel={this.handleImageMouseWheel}
						style={imageStyle}
						key={imageSrc + keyEndings[srcType]}
					>
						<div className="ril-download-blocker ril__downloadBlocker" />
					</div>
				);
			} else {
				images.push(
					<img
						{...(imageCrossOrigin ? { crossOrigin: imageCrossOrigin } : {})}
						className={`${imageClass} ril__image`}
						onDoubleClick={this.handleImageDoubleClick}
						onWheel={this.handleImageMouseWheel}
						onDragStart={(e) => e.preventDefault()}
						style={imageStyle}
						src={imageSrc}
						key={imageSrc + keyEndings[srcType]}
						alt={typeof imageTitle === 'string' ? imageTitle : translate('Image')}
						draggable={false}
					/>
				);
			}
		};

		const zoomMultiplier = this.getZoomMultiplier();
		// 下一张图片（显示在右侧）
		addImage('nextSrc', 'ril-image-next ril__imageNext', {
			x: boxSize.width
		});
		// 主要形象
		addImage('mainSrc', 'ril-image-current', {
			x: -1 * offsetX,
			y: -1 * offsetY,
			zoom: zoomMultiplier
		});
		// 上一张图片（显示在左侧）
		addImage('prevSrc', 'ril-image-prev ril__imagePrev', {
			x: -1 * boxSize.width
		});

		const modalStyle = {
			overlay: {
				zIndex: 1000,
				backgroundColor: 'transparent',
				...reactModalStyle.overlay // 允许通过道具覆盖样式
			},
			content: {
				backgroundColor: 'transparent',
				overflow: 'hidden', // 需要，否则键盘快捷键滚动页面
				border: 'none',
				borderRadius: 0,
				padding: 0,
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				...reactModalStyle.content // 允许通过道具覆盖样式
			}
		};

		return (
			<Modal
				isOpen
				onRequestClose={clickOutsideToClose ? this.requestClose : undefined}
				onAfterOpen={() => {
					// 用关键处理程序专注于div
					if (this.outerEl) {
						this.outerEl.focus();
					}

					onAfterOpen();
				}}
				style={modalStyle}
				contentLabel={translate('Lightbox')}
				appElement={typeof global.window !== 'undefined' ? global.window.document.body : undefined}
				{...reactModalProps}
			>
				<div // eslint-disable-line jsx-a11y/no-static-element-interactions
					// 具有关闭动画的浮动模态
					className={`ril-outer ril__outer ril__outerAnimating ${this.props.wrapperClassName} ${isClosing
						? 'ril-closing ril__outerClosing'
						: ''}`}
					style={{
						transition: `opacity ${animationDuration}ms`,
						animationDuration: `${animationDuration}ms`,
						animationDirection: isClosing ? 'normal' : 'reverse'
					}}
					ref={(el) => {
						this.outerEl = el;
					}}
					onWheel={this.handleOuterMousewheel}
					onMouseMove={this.handleMouseMove}
					onMouseDown={this.handleMouseDown}
					onTouchStart={this.handleTouchStart}
					onTouchMove={this.handleTouchMove}
					tabIndex="-1" // 启用div上的键处理程序
					onKeyDown={this.handleKeyInput}
					onKeyUp={this.handleKeyInput}
				>
					<div // eslint-disable-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
						// 图像持有人
						className="ril-inner ril__inner"
						onClick={clickOutsideToClose ? this.closeIfClickInner : undefined}
					>
						{images}
					</div>

					{prevSrc && (
						<button // 移至上一个图像按钮
							type="button"
							className="ril-prev-button ril__navButtons ril__navButtonPrev"
							key="prev"
							aria-label={this.props.prevLabel}
							onClick={!this.isAnimating() ? this.requestMovePrev : undefined} // 在动画期间忽略点击次数
						/>
					)}

					{nextSrc && (
						<button // Move to next image button
							type="button"
							className="ril-next-button ril__navButtons ril__navButtonNext"
							key="next"
							aria-label={this.props.nextLabel}
							onClick={!this.isAnimating() ? this.requestMoveNext : undefined} // 在动画期间忽略点击次数
						/>
					)}

					<div className="ril-toolbar ril__toolbar">
						{' '}
						// Lightbox toolbar
						<ul className="ril-toolbar-left ril__toolbarSide ril__toolbarLeftSide">
							<li className="ril-toolbar__item ril__toolbarItem">
								<span className="ril-toolbar__item__child ril__toolbarItemChild">{imageTitle}</span>
							</li>
						</ul>
						<ul className="ril-toolbar-right ril__toolbarSide ril__toolbarRightSide">
							{toolbarButtons &&
								toolbarButtons.map((button, i) => (
									<li key={`button_${i + 1}`} className="ril-toolbar__item ril__toolbarItem">
										{button}
									</li>
								))}

							<li>
								<span
									style={{
										color: '#fff',
										fontSize: '14px',
										position: 'absolute',
										top: '20px',
										right: '140px'
									}}
								>
									{this.props.page+1}/{this.props.allpage}
								</span>
							</li>

							{enableZoom && (
								<li className="ril-toolbar__item ril__toolbarItem">
									<button // 灯箱放大按钮
										type="button"
										key="zoom-in"
										aria-label={this.props.zoomInLabel}
										className={[
											'ril-zoom-in',
											'ril__toolbarItemChild',
											'ril__builtinButton',
											'ril__zoomInButton',
											...(zoomLevel === MAX_ZOOM_LEVEL ? [ 'ril__builtinButtonDisabled' ] : [])
										].join(' ')}
										ref={(el) => {
											this.zoomInBtn = el;
										}}
										disabled={this.isAnimating() || zoomLevel === MAX_ZOOM_LEVEL}
										onClick={
											!this.isAnimating() && zoomLevel !== MAX_ZOOM_LEVEL ? (
												this.handleZoomInButtonClick
											) : (
												undefined
											)
										}
									/>
								</li>
							)}

							{enableZoom && (
								<li className="ril-toolbar__item ril__toolbarItem">
									<button // 灯箱缩小按钮
										type="button"
										key="zoom-out"
										aria-label={this.props.zoomOutLabel}
										className={[
											'ril-zoom-out',
											'ril__toolbarItemChild',
											'ril__builtinButton',
											'ril__zoomOutButton',
											...(zoomLevel === MIN_ZOOM_LEVEL ? [ 'ril__builtinButtonDisabled' ] : [])
										].join(' ')}
										ref={(el) => {
											this.zoomOutBtn = el;
										}}
										disabled={this.isAnimating() || zoomLevel === MIN_ZOOM_LEVEL}
										onClick={
											!this.isAnimating() && zoomLevel !== MIN_ZOOM_LEVEL ? (
												this.handleZoomOutButtonClick
											) : (
												undefined
											)
										}
									/>
								</li>
							)}

							<li className="ril-toolbar__item ril__toolbarItem">
								<button // 灯箱关闭按钮
									type="button"
									key="close"
									aria-label={this.props.closeLabel}
									className="ril-close ril-toolbar__item__child ril__toolbarItemChild ril__builtinButton ril__closeButton"
									onClick={!this.isAnimating() ? this.requestClose : undefined} // Ignore clicks during animation
								/>
							</li>
						</ul>
					</div>

					{this.props.imageCaption && (
						// eslint-disable-next-line jsx-a11y/no-static-element-interactions
						<div // 图片标题
							onWheel={this.handleCaptionMousewheel}
							onMouseDown={(event) => event.stopPropagation()}
							className="ril-caption ril__caption"
							ref={(el) => {
								this.caption = el;
							}}
						>
							<div className="ril-caption-content ril__captionContent">{this.props.imageCaption}</div>
						</div>
					)}
				</div>
			</Modal>
		);
	}
}

ReactImageLightbox.propTypes = {
	//-----------------------------
	// 图片来源
	//-----------------------------

	// 主显示图片网址
	mainSrc: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types

	//上一个显示图片网址（显示在左侧）
	//如果未定义，则不会执行movePrev操作，并且不显示该按钮
	prevSrc: PropTypes.string,

	//下一个显示图片网址（显示在右侧）
	//如果未定义，则不会执行moveNext操作，并且不显示该按钮
	nextSrc: PropTypes.string,

	//-----------------------------
	// 图像缩略图来源
	//-----------------------------

	// 与props.mainSrc对应的缩略图图像url
	mainSrcThumbnail: PropTypes.string, // eslint-disable-line react/no-unused-prop-types

	// 与props.prevSrc对应的缩略图图像url
	prevSrcThumbnail: PropTypes.string, // eslint-disable-line react/no-unused-prop-types

	// 与props.nextSrc对应的缩略图图像url
	nextSrcThumbnail: PropTypes.string, // eslint-disable-line react/no-unused-prop-types

	//-----------------------------
	// 事件处理程序
	//-----------------------------

	//关闭窗口事件
	//应该更改父状态，以便不渲染灯箱
	onCloseRequest: PropTypes.func.isRequired,

	//移至上一个图像事件
	//应该改变父状态，使props.prevSrc成为props.mainSrc，
	// props.mainSrc成为props.nextSrc等
	onMovePrevRequest: PropTypes.func,

	//移动到下一个图像事件
	//应该改变父状态，使props.nextSrc成为props.mainSrc，
	// props.mainSrc成为props.prevSrc等
	onMoveNextRequest: PropTypes.func,

	//在图像无法加载时调用
	//（imageSrc：string，srcType：string，errorEvent：object）：void
	onImageLoadError: PropTypes.func,

	//图像成功加载时调用
	onImageLoad: PropTypes.func,

	//打开窗口事件
	onAfterOpen: PropTypes.func,

	//-----------------------------
	// 下载劝阻设置
	//-----------------------------

	//启用下载阻止（阻止[右键单击 - >将图像另存为...]）
	discourageDownloads: PropTypes.bool,

	//-----------------------------
	// 动画设置
	//-----------------------------

	//禁用所有动画
	animationDisabled: PropTypes.bool,

	// 对使用键盘快捷键执行的操作禁用动画
	animationOnKeyInput: PropTypes.bool,

	// 动画持续时间（毫秒）
	animationDuration: PropTypes.number,

	//-----------------------------
	// 键盘快捷键设置
	//-----------------------------

	//关键操作之间所需的时间间隔（ms）
	//（防止图像过快导航）
	keyRepeatLimit: PropTypes.number,

	//每个密钥后恢复的时间（ms）
	//（快速按键比按住按键导航图像略快）
	keyRepeatKeyupBonus: PropTypes.number,

	//-----------------------------
	// 图片信息
	//-----------------------------

	// 图片标题
	imageTitle: PropTypes.node,

	// 图片标题
	imageCaption: PropTypes.node,

	// 可选的crossOrigin属性
	imageCrossOrigin: PropTypes.string,

	//-----------------------------
	// 灯箱风格
	//-----------------------------

	// 为parent react-modal设置z-index样式等（格式：https://github.com/reactjs/react-modal#styles）
	reactModalStyle: PropTypes.shape({}),

	// 在窗口边缘和灯箱之间填充（px）
	imagePadding: PropTypes.number,

	wrapperClassName: PropTypes.string,

	//-----------------------------
	// 其他
	//-----------------------------

	// 自定义工具栏按钮的数组
	toolbarButtons: PropTypes.arrayOf(PropTypes.node),

	// 如果为true，则单击图像外部的点击关闭灯箱
	clickOutsideToClose: PropTypes.bool,

	// 设置为false可禁用缩放功能并隐藏缩放按钮
	enableZoom: PropTypes.bool,

	// 覆盖react-modal上设置的道具 (https://github.com/reactjs/react-modal)
	reactModalProps: PropTypes.shape({}),

	// Aria-labels
	nextLabel: PropTypes.string,
	prevLabel: PropTypes.string,
	zoomInLabel: PropTypes.string,
	zoomOutLabel: PropTypes.string,
	closeLabel: PropTypes.string,

	imageLoadErrorMessage: PropTypes.node
};

ReactImageLightbox.defaultProps = {
	imageTitle: null,
	imageCaption: null,
	toolbarButtons: null,
	reactModalProps: {},
	animationDisabled: false,
	animationDuration: 800,
	animationOnKeyInput: false,
	clickOutsideToClose: true,
	closeLabel: 'Close lightbox',
	discourageDownloads: false,
	enableZoom: true,
	imagePadding: 10,
	imageCrossOrigin: null,
	keyRepeatKeyupBonus: 40,
	keyRepeatLimit: 180,
	mainSrcThumbnail: null,
	nextLabel: 'Next image',
	nextSrc: null,
	nextSrcThumbnail: null,
	onAfterOpen: () => {},
	onImageLoadError: () => {},
	onImageLoad: () => {},
	onMoveNextRequest: () => {},
	onMovePrevRequest: () => {},
	prevLabel: 'Previous image',
	prevSrc: null,
	prevSrcThumbnail: null,
	reactModalStyle: {},
	wrapperClassName: '',
	zoomInLabel: 'Zoom in',
	zoomOutLabel: 'Zoom out',
	imageLoadErrorMessage: 'This image failed to load'
};

export default ReactImageLightbox;
