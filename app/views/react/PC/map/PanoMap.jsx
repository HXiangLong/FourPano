/**小地图 */
import React, { Component } from 'react';
import './PanoMap.css';
import * as constants from '../../../../src/tool/SWConstants';
import SWKMeans from './SWKMeans';
import MapMarker from './MapMarker';
const external = require('../../../../src/tool/SWExternalConst.js');

class PanoMap extends Component {
	constructor() {
		super();

		this.initOver = false; //是否可以小地图居中了
		this.imgWidth = 1920; //小地图默认宽度
		this.imgHeight = 1500; //小地图默认高度
		this.minZoom = 0.25; //最小缩放值
		this.maxZoom = 1.5; //最大缩放值
		this.zoomNum = 0.25; //每次缩放值
		this.imgScale = 0.25; // 图片缩放的比例
		this.floorsMapData; //本层所有信息
		this.rasterMapID; //本层标识
		this.zoomInt = 0; //展示框缩放等级
		this.apartX = 0; // 鼠标在图片中与图片左上角的X轴的距离
		this.apartY = 0; //鼠标在图片中与图片左上角的Y轴的距离
		this.top = 0; //地图层位置
		this.left = 0; //地图层位置
		this.markerLeft = 0; //标注层位置
		this.markerTop = 0; //标注层位置
		this.serverUrl = ''; //小地图服务地址
		this.kmTable = []; //聚类需要的数据
		this.SWKMeans = new SWKMeans(); //聚合算法
		this.radarTop = 0; //雷达层位置
		this.radarLeft = 0; //雷达层位置

		this.state = {
			imgUrl: '',
			mapboxClass: '',
			imgStyle: {
				transform: `scale(${this.imgScale})`
			},
			markerStyle: {}
		};

		this.myRef = React.createRef();
	}

	/**鼠标按下 */
	_mouseDown(event) {
		event.preventDefault();
		event.stopPropagation();

		this.dragDrop = true;

		this.apartX = event.clientX;
		this.apartY = event.clientY;
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

		this.top += event.clientY - this.apartY;
		this.left += event.clientX - this.apartX;

		this.markerLeft += event.clientX - this.apartX;
		this.markerTop += event.clientY - this.apartY;

		this.setState({
			imgStyle: {
				transform: `translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`
			},
			markerStyle: {
				top: `${this.markerTop}px`,
				left: `${this.markerLeft}px`
			}
		});

		this.apartX = event.clientX;
		this.apartY = event.clientY;
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
		this.imgScale = (this.imgScale * (1 + this.zoomNum)).toFixed(2);

		this.imgScale = this.imgScale >= this.maxZoom ? this.maxZoom : this.imgScale;

		this.setState({
			imgStyle: {
				transform: `translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`
			}
		});
	}

	/**缩小图像 */
	minusRotateImg() {
		this.imgScale = (this.imgScale * (1 - this.zoomNum)).toFixed(2);

		this.imgScale = this.imgScale <= this.minZoom ? this.minZoom : this.imgScale;

		this.setState({
			imgStyle: {
				transform: `translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`
			}
		});
	}

	/**关闭 */
	closePanoMap() {
		this.props.closePanoMap();
	}

	/**缩小 */
	zoomOut() {
		this.initOver = false;
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
		this.setState(
			{
				mapboxClass: classname
			},
			() => {
				let times = setTimeout(() => {
					this.initOver = true;
					this.centered();
					clearTimeout(times);
				}, 500); //框缩放有动画
			}
		);
	}

	/**放大 */
	zoomIn() {
		this.initOver = false;
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
		this.setState(
			{
				mapboxClass: classname
			},
			() => {
				let times = setTimeout(() => {
					this.initOver = true;
					this.centered();
					clearTimeout(times);
				}, 500); //框缩放有动画
			}
		);
	}

	/**居中 */
	centered() {
		this.left = (document.getElementsByClassName('mapMarkerBox')[0].offsetWidth - this.imgWidth) * 0.5;

		this.top = (document.getElementsByClassName('mapMarkerBox')[0].offsetHeight - this.imgHeight) * 0.5;

		this.markerLeft = 0;

		this.markerTop = 0;

		this.setState({
			imgStyle: {
				transform: `translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`
			},

			markerStyle: {
				top: `${this.markerTop}px`,
				left: `${this.markerLeft}px`
			}
		});

		this.initOver = true;
	}

	/**说明 */
	description() {
		this.props.showMaptipBox();
	}

	/**站点显示 放大之后重新计算距离 */
	SiteDisplay() {
		if (!this.initOver || !document.getElementsByClassName('mapMarkerBox')[0]) return;

		let markerList = [];

		let kmTable = [];

		let mapMarkers = this.props.floorsMapData.rasterMapMarkers.getValues();

		let left =
			(document.getElementsByClassName('mapMarkerBox')[0].offsetWidth - this.imgWidth * this.imgScale) * 0.5;

		let top =
			(document.getElementsByClassName('mapMarkerBox')[0].offsetHeight - this.imgHeight * this.imgScale) * 0.5;

		mapMarkers.forEach((marker) => {
			let px = left + marker.pixShapeX * this.imgScale - 20;

			let py = top + marker.pixShapeY * this.imgScale - 16;

			kmTable.push([ px, py, marker.panoID, marker.markerTypeCode ]);
		});

		let kmesans = this.SWKMeans.start(kmTable);

		kmesans.forEach((item, idx) => {
			if (item[3] == '999') {
				this.radarLeft = item[0];
				this.radarTop = item[1];
			}

			markerList.push(
				<MapMarker key={`mapMarker${idx}`} px={item[0]} py={item[1]} panoid={item[2]} markertype={item[3]} />
			);
		});

		return markerList;
	}

	render() {
		return external.server_json.features.map ? this.props.off ? (
			<div className={`zoom-marker-div ${this.state.mapboxClass}`}>
				<span className="iconfont icon-svg26 guangbi" title="关闭展示框" onClick={this.closePanoMap.bind(this)} />
				<span className="iconfont icon-jia big" title="放大展示框" onClick={this.zoomIn.bind(this)} />
				<span className="iconfont icon-jian small" title="缩小展示框" onClick={this.zoomOut.bind(this)} />
				<span
					className="iconfont icon-fuhao-zhuangtai-yiwen shuoming"
					title="功能说明"
					onClick={this.description.bind(this)}
				/>
				<div className="mapMarkerBox" ref={this.myRef}>
					<div
						className="zoom-marker-img"
						style={this.state.imgStyle}
						onWheel={this._mouseWheelRotateImg.bind(this)}
						onMouseUp={this._mouseUp.bind(this)}
						onMouseDown={this._mouseDown.bind(this)}
						onMouseMove={this._mouseMove.bind(this)}
						onTouchStart={this._mouseDown.bind(this)}
						onTouchMove={this._mouseMove.bind(this)}
						onTouchEnd={this._mouseUp.bind(this)}
						onMouseOut={this._mouseUp.bind(this)}
					>
						<img ref="showPreviewImageWrap" src={this.props.imgUrl} onLoad={this.centered.bind(this)} />
					</div>

					<div className="zoom-marker" style={this.state.markerStyle}>
						{this.SiteDisplay()}
						<div
							className="mapRadar"
							style={{
								transform: `translate3d(${this.radarLeft - 16}px, ${this.radarTop -
									8}px, 0px) rotate(${-(constants.c_deviationAngle - 90 + this.props.radarAngle)}deg)`
							}}
						>
							<div className="mapRadarImg" />
						</div>
					</div>
				</div>
			</div>
		) : (
			''
		) : (
			''
		);
	}
}

export default PanoMap;
