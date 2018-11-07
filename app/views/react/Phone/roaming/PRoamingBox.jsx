/**漫游类型选择界面 */
import * as constants from '../../../../src/tool/SWConstants';
import React, { Component } from 'react';
import './PRoamingBox.css';

class PRoamingBox extends Component {
	constructor() {
		super();
	}

	/**关闭界面 */
	closeRoamingBox() {
		this.props.OpenRoamingFun({
			boxOff: false
		});
	}

	openRoaming(index) {
        this.closeRoamingBox();
        constants.sw_roamingModule.StartRoaming(index);
    }

	render() {
		return this.props.boxOff ? (
			<div className="roaming">
				<div className="UIBG" onClick={this.closeRoamingBox.bind(this)} />
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeRoamingBox.bind(this)} />
				<div className="PRoamingBox">
					<ul>
						<li onClick={this.openRoaming.bind(this, 0)}>
							<h3>快速浏览</h3>
							<p>浏览视频、文物站点，大约耗时15分钟</p>
							<i />
						</li>
						<li onClick={this.openRoaming.bind(this, 1)}>
							<h3>详细浏览</h3>
							<p>浏览主要站点，大约耗时45分钟</p>
							<i />
						</li>
						<li onClick={this.openRoaming.bind(this, 2)}>
							<h3>沉浸浏览</h3>
							<p>浏览全部站点，大约耗时2小时以上</p>
							<i />
						</li>
					</ul>
				</div>
			</div>
		) : (
			''
		);
	}
}
export default PRoamingBox;
