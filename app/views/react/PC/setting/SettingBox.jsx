/**漫游类型选择界面 */
import * as constants from '../../../../src/tool/SWConstants';
import React, { Component } from 'react';
import InputRange from 'react-input-range';
import './SettingBox.css';
// import 'react-input-range/lib/css/index.css'

class SettingBox extends Component {
	constructor() {
		super();
		this.state = {
			lightValue: 9,
			roamingValue: 5
		};
		this.lightDiv = document.getElementsByClassName('lightDiv');
	}

	/**关闭界面 */
	closeRoamingBox() {
		this.props.OpenSettingFun();
	}

	render() {
		return this.props.boxOff ? (
			<div className="settingScene">
				<div
					className="UIBG"
					style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
					onClick={this.closeRoamingBox.bind(this)}
				/>
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeRoamingBox.bind(this)} />
				<div className="settingBox">
					<ul>
						<li>
							<p>灯光亮度：</p>
							<InputRange
								maxValue={10}
								minValue={1}
								value={this.state.lightValue}
								onChange={(value) => this.setState({ lightValue: value })}
								onChangeComplete={(value) => {
									this.props.setBrightness({
										brightness: 1 - value / 10
									});
								}}
							/>
							<span>{this.state.lightValue}</span>
						</li>
						<li>
							<p>漫游速度：</p>
							<InputRange
								maxValue={10}
								minValue={1}
								value={this.state.roamingValue}
								onChange={(value) => this.setState({ roamingValue: value })}
								onChangeComplete={(value) => {
									// console.log(value);
									constants.c_roamingMultiple = value;
								}}
							/>
							<span>{this.state.roamingValue}</span>
						</li>
					</ul>
				</div>
			</div>
		) : (
			''
		);
	}
}
export default SettingBox;
