/**底下一排按钮*/
import React, { Component } from 'react';
import './PBottom.css';
import * as constants from '../../../../src/tool/SWConstants';

class PBottom extends Component {
	constructor() {
		super();
	}

	showIntroduction() {
		this.props.closeThumbnails();
		this.props.showHotPhotoWall({off: false});
		this.props.showIntroduction({
			off: true
		});
	}

	/**显示展厅列表 */
	showThumbnails() {
		this.props.showHotPhotoWall({off: false});
		this.props.OpenThumbnails ? this.props.closeThumbnails() : this.props.showThumbnails();
	}

	/**开启漫游 */
	turnRoaming() {
		this.props.closeThumbnails();
		this.props.showHotPhotoWall({off: false});
		//直接开启漫游 根据不同项目来开启
		// this.props.openRoamingOff ? constants.sw_roamingModule.EndRoaming() : constants.sw_roamingModule.StartRoaming();
		this.props.openRoamingOff ? constants.sw_roamingModule.EndRoaming() : this.props.showroamingBox();
	}

	/**显示文物界面 */
	showHotPhotoWall() {
		this.props.closeThumbnails();
		this.props.showHotPhotoWall({off: !this.props.hotWallOff});
	}

	render() {
		return (
			<div>
				<div className="lightDiv" style={{ backgroundColor: `rgba(0,0,0,${this.props.brightness})` }} />
				<div className="PMainMenu">
					<ul>
						<li className="exhibithall" onClick={this.showThumbnails.bind(this)}>
							<p>展厅</p>
						</li>
						<li className="summary" onClick={this.showIntroduction.bind(this)}>
							<p>简介</p>
						</li>
						<li
							className={`roam ${this.props.openRoamingOff ? 'close' : ''}`}
							onClick={this.turnRoaming.bind(this)}
						>
							<p>漫游</p>
						</li>
						<li className="collect" onClick={this.showHotPhotoWall.bind(this)}>
							<p>藏品</p>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}
export default PBottom;
