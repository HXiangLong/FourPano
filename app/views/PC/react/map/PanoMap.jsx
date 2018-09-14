/**小地图 */
import React, { Component } from 'react';
import './PanoMap.pcss';
import * as constants from '../../../../src/tool/SWConstants';

class PanoMap extends Component {
	constructor() {
		super();

		this.minZoom = 0.25; //最小缩放值
		this.maxZoom = 2; //最大缩放值
		this.zoomNum = 0.25; //每次缩放值
		this.imgScale = 0.25; // 图片缩放的比例
		this.floorsMapData; //本层所有信息
		this.rasterMapID; //本层标识
		this.markerUpdata = false; //是否更新地图
		this.zoomInt = 0;

		this.state = {
			touchORmouse: 'ontouchstart' in window, //是否是触屏
			imgUrl: '',
			mapboxClass: '',
			imgStyle: {
				transform: `scale(${this.imgScale})`,
				top: '-148%',
				left: '-150%'
			}
		};
	}

	/**鼠标按下 */
	_mouseDown(event) {
		event.preventDefault();
		event.stopPropagation();

		this.dragDrop = true;

		const imgWrap = this.refs.showPreviewImageWrap;
		this.apartX = event.pageX - imgWrap.offsetLeft; // 鼠标在图片中与图片左上角的X轴的距离
		this.apartY = event.pageY - imgWrap.offsetTop;
	}

	/**鼠标弹起 */
	_mouseUp(event) {
		event.preventDefault();
		event.stopPropagation();

		this.dragDrop = false;
	}

	/**鼠标移动 */
	_mouseMove(event) {
		event.preventDefault();
		event.stopPropagation();

		if (!this.dragDrop) {
			return;
		}

		const imgWrap = this.refs.showPreviewImageWrap;
		imgWrap.style.left = event.pageX - this.apartX + 'px';
		imgWrap.style.top = event.pageY - this.apartY + 'px';
	}

	/**图像滚轮事件 */
	_mouseWheelRotateImg(event) {
		event.preventDefault();
		event.stopPropagation();

		if (event.deltaY > 0) {
			this.minusRotateImg();
		} else {
			this.plusRotateImg();
		}
	}

	/**放大图像 */
	plusRotateImg() {
		this.imgScale = this.imgScale + this.zoomNum;
		this.imgScale = this.imgScale >= this.maxZoom ? this.maxZoom : this.imgScale;
		this.setState({
			imgStyle: { transform: `rotate(0deg) scale(${this.imgScale})` }
		});
	}

	/**缩小图像 */
	minusRotateImg() {
		this.imgScale = this.imgScale - this.zoomNum;
		this.imgScale = this.imgScale <= this.minZoom ? this.minZoom : this.imgScale;
		this.setState({
			imgStyle: { transform: `rotate(0deg) scale(${this.imgScale})` }
		});
	}

	_touchDown() {}

	_touchUp() {}

	_touchMove() {}

	componentWillUpdate() {
		let floorsMapArr = constants.c_FloorsMapTable.getValues();

		floorsMapArr.map((obj, idx) => {
			let mapmarker = obj.rasterMapMarkers.getValues();

			mapmarker.map((mapObj, idxs) => {
				if (mapObj.panoID == constants.c_StationInfo.panoID) {
					this.floorsMapData = obj;

					if (this.rasterMapID != mapObj.rasterMapID) {
						this.setState({
							imgUrl: `${constants.sw_getService.getmusServerURL().split('/S')[0]}/${obj.rasterMapPath}`
						});

						this.markerUpdata = true;

						this.rasterMapID = mapObj.rasterMapID;
					}
				}
			});
		});
	}

	/**关闭 */
	closePanoMap() {
		this.props.closePanoMap();
	}

	/**缩小 */
	zoomOut() {
		this.zoomInt--;
		this.zoomInt = this.zoomInt <= 0 ? 0 : this.zoomInt;
		let classname = '';
		switch (this.zoomInt) {
			case 1:
				classname = 'mapbox2';
				break;
			case 2:
				classname = 'mapbox4';
				break;
		}
		this.setState({
			mapboxClass: classname
		});
	}

	/**放大 */
	zoomIn() {
		this.zoomInt++;
		this.zoomInt = this.zoomInt >= 2 ? 2 : this.zoomInt;
		let classname = '';
		switch (this.zoomInt) {
			case 1:
				classname = 'mapbox2';
				break;
			case 2:
				classname = 'mapbox4';
				break;
		}
		this.setState({
			mapboxClass: classname
		});
	}

	/**说明 */
	description() {
		this.props.showMaptipBox();
	}

	render() {
		return this.props.off ? (
			<div className={`zoom-marker-div ${this.state.mapboxClass}`}>
				<span className="iconfont icon-svg26 guangbi" title="关闭地图" onClick={this.closePanoMap.bind(this)} />
				<span className="iconfont icon-jia big" title="放大展示框" onClick={this.zoomIn.bind(this)} />
				<span className="iconfont icon-jian small" title="缩小展示框" onClick={this.zoomOut.bind(this)} />
				<span
					className="iconfont icon-fuhao-zhuangtai-yiwen shuoming"
					title="说明"
					onClick={this.description.bind(this)}
				/>
				<div className="zoom-marker-img">
					{this.state.touchORmouse ? (
						<img
							ref="showPreviewImageWrap"
							src={this.state.imgUrl}
							style={this.state.imgStyle}
							onTouchEnd={this._touchUp.bind(this)}
							onTouchStart={this._touchDown.bind(this)}
							onTouchMove={this._touchMove.bind(this)}
						/>
					) : (
						<img
							ref="showPreviewImageWrap"
							src={this.state.imgUrl}
							style={this.state.imgStyle}
							onWheel={this._mouseWheelRotateImg.bind(this)}
							onMouseUp={this._mouseUp.bind(this)}
							onMouseDown={this._mouseDown.bind(this)}
							onMouseMove={this._mouseMove.bind(this)}
						/>
					)}
					<div className="zoom-marker" />
				</div>
				<div className="mapcont" />
			</div>
		) : (
			''
		);
	}
}

export default PanoMap;
