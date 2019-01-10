/** */
import React, { Component } from 'react';
import './PPanoMap.css';
import * as constants from '../../../../src/tool/SWConstants';
import SWKMeans from '../../PC/map/SWKMeans';
import MapMarker from '../../PC/map/MapMarker';
const external = require('../../../../src/tool/SWExternalConst.js');

class PPanoMap extends Component {
	constructor() {
		super();

		this.initOver = false; //是否可以小地图居中了
		this.imgWidth = 1920; //小地图默认宽度
		this.imgHeight = 1500; //小地图默认高度
		this.minZoom = 0.15; //最小缩放值
		this.maxZoom = 1.5; //最大缩放值
		this.zoomNum = 0.5; //每次缩放值
		this.imgScale = 0.18; // 图片缩放的比例
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
		this.touchZoomDistanceStart = 0;
		this.touchZoomDistanceEnd = 0;

		this.state = {
			imgUrl: '',
			mapboxClass: '',
			imgStyle: {
				transform: `scale(${this.imgScale})`,
				WebkitTransform: `scale(${this.imgScale})`
			},
			markerStyle: {}
		};
	}

	/**鼠标按下 */
	_mouseDown(event) {
		// 防止滚动背景
		event.preventDefault();
		event.stopPropagation();
		this.dragDrop = true;

		this.apartX = event.touches[0].clientX;
		this.apartY = event.touches[0].clientY;
	}

	/**鼠标弹起 */
	_mouseUp(event) {
		// 防止滚动背景
		event.preventDefault();
		event.stopPropagation();
		this.dragDrop = false;
	}

	/**鼠标移动 */
	_mouseMove(event) {
		// 防止滚动背景
		event.preventDefault();
		event.stopPropagation();
		if (!this.dragDrop) return;

		this.top += event.touches[0].clientY - this.apartY;
		this.left += event.touches[0].clientX - this.apartX;

		this.markerLeft += event.touches[0].clientX - this.apartX;
		this.markerTop += event.touches[0].clientY - this.apartY;

		this.setState({
			imgStyle: {
				transform: `translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`,
				WebkitTransform:`translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`
			},
			markerStyle: {
				top: `${this.markerTop}px`,
				left: `${this.markerLeft}px`
			}
		});

		this.apartX = event.touches[0].clientX;

		this.apartY = event.touches[0].clientY;
	}

	/**缩小 */
	zoomOut() {
		this.minusRotateImg();
		this.centered();
	}

	/**放大 */
	zoomIn() {
		this.plusRotateImg();
	}

	/**放大图像 */
	plusRotateImg() {
		this.imgScale = (this.imgScale * (1 + this.zoomNum)).toFixed(2);

		this.imgScale = this.imgScale >= this.maxZoom ? this.maxZoom : this.imgScale;

		this.setState({
			imgStyle: {
				transform: `translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`,
				WebkitTransform:`translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`
			}
		});
	}

	/**缩小图像 */
	minusRotateImg() {
		this.imgScale = (this.imgScale * (1 - this.zoomNum)).toFixed(2);

		this.imgScale = this.imgScale <= this.minZoom ? this.minZoom : this.imgScale;

		this.setState({
			imgStyle: {
				transform: `translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`,
				WebkitTransform:`translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`
			}
		});
	}

	/**关闭 */
	closePanoMap() {
		this.centered();
		this.props.closePanoMap();
	}

	/**居中 */
	centered() {
		this.left = (window.innerWidth - this.imgWidth) * 0.5;

		this.top = (window.innerHeight * 0.4 - this.imgHeight) * 0.5;

		this.markerLeft = 0;

		this.markerTop = 0;

		this.setState({
			imgStyle: {
				transform: `translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`,
				WebkitTransform:`translate3d(${this.left}px, ${this.top}px, 0px) scale(${this.imgScale})`
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

		let left = (window.innerWidth - this.imgWidth * this.imgScale) * 0.5;

		let top = (window.innerHeight * 0.4 - this.imgHeight * this.imgScale) * 0.5;

		mapMarkers.forEach((marker) => {
			let px = left + marker.pixShapeX * this.imgScale - 20;

			let py = top + marker.pixShapeY * this.imgScale - 16;

			if (marker.panoID == constants.c_StationInfo.panoID) {
				kmTable.push([ px, py, marker.panoID, '999' ]);
			} else {
				kmTable.push([ px, py, marker.panoID, marker.markerTypeCode ]);
			}
		});

		// let kmesans = this.SWKMeans.start(kmTable);

		kmTable.forEach((item, idx) => {
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
		return external.server_json.features.map ? (
			<div
				className={`Pzoom-marker-div ${this.state.mapboxClass}`}
				style={{ display: this.props.phoneOff ? 'block' : 'none' }}
			>
				<span className="iconfont icon-svg26 guangbi" title="关闭展示框" onClick={this.closePanoMap.bind(this)} />
				<span className="iconfont icon-jia big" title="放大展示框" onClick={this.zoomIn.bind(this)} />
				<span className="iconfont icon-jian small" title="缩小展示框" onClick={this.zoomOut.bind(this)} />
				<span
					className="iconfont icon-fuhao-zhuangtai-yiwen shuoming"
					title="功能说明"
					onClick={this.description.bind(this)}
				/>
				<div className="mapMarkerBox">
					<div
						className="zoom-marker-img"
						style={this.state.imgStyle}
						onTouchStart={this._mouseDown.bind(this)}
						onTouchMove={this._mouseMove.bind(this)}
						onTouchEnd={this._mouseUp.bind(this)}
					>
						<img ref="showPreviewImageWrap" src={this.props.imgUrl} onLoad={this.centered.bind(this)} />
					</div>

					<div className="zoom-marker" style={this.state.markerStyle}>
						{this.SiteDisplay()}
						<div
							className="mapRadar"
							style={{
								transform: `translate3d(${this.radarLeft - 16}px, ${this.radarTop -
									8}px, 0px) rotate(${-(
									constants.c_deviationAngle -
									90 +
									this.props.radarAngle
								)}deg)`,
								WebkitTransform: `translate3d(${this.radarLeft - 16}px, ${this.radarTop -
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
		);
	}
}
export default PPanoMap;
