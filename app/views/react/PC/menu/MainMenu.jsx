/**界面下方主菜单 */
import React, { Component } from 'react';
import * as constants from '../../../../src/tool/SWConstants';
import { deleteMeasuring } from '../../../../src/tool/SWInitializeInstance';
import './MainMenu.css';

class MainMenu extends Component {
	constructor() {
		super();
	}

	/**显示简介界面 */
	showIntroduction() {
		// this.props.IntroductionState({//简单版
		// 	off: true
		// });
		this.props.IntroductionComplex(); //复杂版
		this.props.closeThumbnails();
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
		// this.props.openRoamingOff ? constants.sw_roamingModule.EndRoaming() : constants.sw_roamingModule.StartRoaming();
		this.props.openRoamingOff ? constants.sw_roamingModule.EndRoaming() : this.props.showroamingBox();
	}

	/**开启测量 */
	turnMeasurement() {
		this.props.closeThumbnails();
		constants.c_isMeasureStatus = !constants.c_isMeasureStatus;
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
						<li className="exhibithall" title="展厅" onClick={this.showThumbnails.bind(this)}>
							<i />
							<p>展厅</p>
						</li>
						<li className="summary" title="简介" onClick={this.showIntroduction.bind(this)}>
							<i />
							<p>简介</p>
						</li>
						<li className="collect" title="文物" onClick={this.showHotPhotoWall.bind(this)}>
							<i />
							<p>文物</p>
						</li>
						<li
							className="measure"
							title={constants.c_isMeasureStatus ? '关闭测量' : '开启测量'}
							onClick={this.turnMeasurement.bind(this)}
						>
							<i />
							<p>测量</p>
						</li>
						<li
							className={`roam ${this.props.openRoamingOff ? 'close' : ''}`}
							title={this.props.openRoamingOff ? '停止漫游' : '开始漫游'}
							onClick={this.turnRoaming.bind(this)}
						>
							<i />
							<p>漫游</p>
						</li>
						<li className="map" title="地图" onClick={this.showPanoMap.bind(this)}>
							<i />
							<p>地图</p>
						</li>
						<li className="school" title="学堂">
							<i />
							<p>学堂</p>
						</li>
						<li className="links" title="链接" onClick={this.turnLinks.bind(this)}>
							<i />
							<p>链接</p>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

export default MainMenu;
