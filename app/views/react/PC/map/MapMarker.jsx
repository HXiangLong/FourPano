import React, { Component } from 'react';
import './PanoMap.css';
import * as constants from '../../../../src/tool/SWConstants';
import { jumpSite } from '../../../../src/tool/SWInitializeInstance';

class MapMarker extends Component {
	constructor() {
		super();
		this.state = {
			off: false,
			indexs: 3
		};
	}

	mouseOver() {
		this.setState({
			off: true,
			indexs: 99
		});
	}

	mouseOut() {
		this.setState({
			off: false,
			indexs: 3
		});
	}

	mouseClick() {
		jumpSite(this.props.panoid);
	}

	render() {
		let imgs = 'huang';
		switch (this.props.markertype) {
			case '1':
				imgs = 'lv';
				break;
			case '2':
				imgs = 'lan';
				break;
			case '3':
				imgs = 'hong';
				break;
			case '4':
				imgs = 'zi';
				break;
			case '999':
				imgs = 'hei';
				break;
			default:
				break;
		}
		let src = `${constants.sw_getService.resourcesUrl}/BusinessData/PanoThumbnails/${this.props.panoid}.jpg`;
		return (
			<div
				className={`markerIcon ${imgs}`}
				style={{
					left: `${this.props.px}px`,
					top: `${this.props.py}px`,
					zIndex: `${this.state.indexs}`
				}}
				onMouseOver={this.mouseOver.bind(this)}
				onMouseOut={this.mouseOut.bind(this)}
				onClick={this.mouseClick.bind(this)}
			>
				{this.state.off && constants.c_currentState != constants.c_currentStateEnum.phoneStatus ? (
					<div className="mapMarkerImgDiv">
						<img src={src} />
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}

export default MapMarker;
