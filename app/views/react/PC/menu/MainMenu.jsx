/**界面下方主菜单 */
import React, { Component } from 'react';
import * as constants from '../../../../src/tool/SWConstants';
import { deleteMeasuring } from '../../../../src/tool/SWInitializeInstance';
import './MainMenu.css';
const external = require('../../../../src/tool/SWExternalConst.js');

class MainMenu extends Component {
	constructor() {
		super();
		this.state = {
			measure: false
		};
	}

	/**显示简介界面 */
	showIntroduction() {
		this.props.closeThumbnails();
		if (external.server_json.features.summaryType == 1) {
			this.props.IntroductionState({
				//简单版
				off: true
			});
		} else {
			this.props.IntroductionComplex(); //复杂版
		}
	}

	/**显示展厅列表 */
	showThumbnails() {
		this.props.OpenThumbnails ? this.props.closeThumbnails() : this.props.showThumbnails();
	}

	/**显示文物界面 */
	showHotPhotoWall() {
		this.props.closeThumbnails();
		this.props.showHotPhotoWall({
			off: true
		});
	}

	/**显示小地图 */
	showPanoMap() {
		this.props.closeThumbnails();
		this.props.openPanoMapOff ? this.props.showPanoMap({ off: false }) : this.props.showPanoMap({ off: true });
	}

	/**开启漫游 */
	turnRoaming() {
		this.props.closeThumbnails();
		//直接开启漫游 根据不同项目来开启
		if (external.server_json.features.roam == 1) {
			if (this.props.openRoamingOff) {
				constants.sw_roamingModule.EndRoaming();
			} else {
				constants.sw_roamingModule.StartRoaming();
				this.props.openRoaming();
			}
		} else if (external.server_json.features.roam == 2) {
			this.props.openRoamingOff ? constants.sw_roamingModule.EndRoaming() : this.props.showroamingBox();
		}
	}

	/**开启测量 */
	turnMeasurement() {
		this.props.closeThumbnails();
		constants.c_isMeasureStatus = !constants.c_isMeasureStatus;
		this.setState({
			measure: constants.c_isMeasureStatus
		});
		!constants.c_isMeasureStatus && deleteMeasuring();
		this.props.openMeasuring(constants.c_isMeasureStatus);
	}

	turnLinks() {
		this.props.closeThumbnails();
		this.props.showOtherLinks();
	}

	render() {
		return (
			<div>
				<div className="lightDiv" style={{ backgroundColor: `rgba(0,0,0,${this.props.brightness})` }} />
				<div className="mainmenu" url="">
					<ul>
						{external.server_json.features.exhibithall ? (
							<li className="exhibithall" onClick={this.showThumbnails.bind(this)}>
								<i />
								<p>展厅</p>
							</li>
						) : (
							''
						)}
						{external.server_json.features.summary ? (
							<li className="summary" onClick={this.showIntroduction.bind(this)}>
								<i />
								<p>简介</p>
							</li>
						) : (
							''
						)}
						{external.server_json.features.collect ? (
							<li className="collect" onClick={this.showHotPhotoWall.bind(this)}>
								<i />
								<p>文物</p>
							</li>
						) : (
							''
						)}
						{external.server_json.features.measure ? (
							<li
								className={`measure${this.state.measure ? ' active' : ''}`}
								title={this.state.measure ? '关闭测量' : '开启测量'}
								onClick={this.turnMeasurement.bind(this)}
							>
								<i />
								<p>测量</p>
							</li>
						) : (
							''
						)}
						{external.server_json.features.roam != 0 ? (
							<li
								className={`roam ${this.props.openRoamingOff ? 'close' : ''}`}
								title={this.props.openRoamingOff ? '停止漫游' : '开始漫游'}
								onClick={this.turnRoaming.bind(this)}
							>
								<i />
								<p>漫游</p>
							</li>
						) : (
							''
						)}
						{external.server_json.features.map ? (
							<li className="map" onClick={this.showPanoMap.bind(this)}>
								<i />
								<p>地图</p>
							</li>
						) : (
							''
						)}
						{external.server_json.features.school ? (
							<li className="school">
								<i />
								<p>学堂</p>
							</li>
						) : (
							''
						)}
						{external.server_json.features.links ? (
							<li className="links" onClick={this.turnLinks.bind(this)}>
								<i />
								<p>链接</p>
							</li>
						) : (
							''
						)}
					</ul>
				</div>
			</div>
		);
	}
}

export default MainMenu;
