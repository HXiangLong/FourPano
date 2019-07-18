/**设置界面*/
import React, { Component } from 'react';
import './PSettingBox.css';
import InputRange from 'react-input-range';
import * as constants from '../../../../src/tool/SWConstants';

class PSettingBox extends Component {
	constructor() {
		super();
		this.state = {
			movingSpeed: 5,
			lightValue: 10,
			roamingValue: 5
		};
	}

	/**关闭界面 */
	closeRoamingBox() {
		this.props.OpenSettingFun();
	}

	render() {
		return this.props.boxOff ? (
			<div className="PSettingScene">
				<div
					className="UIBG"
					style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
					onClick={this.closeRoamingBox.bind(this)}
				/>
				<div className="PSettingBox">
					<ul>
						<li>
							<p>移动速度：</p>
							<InputRange
								maxValue={10}
								minValue={1}
								value={this.state.movingSpeed}
								onChange={(value) => this.setState({ movingSpeed: value })}
								onChangeComplete={(value) => {
									constants.c_movingSpeedMultiple = value;
								}}
							/>
							<span>{this.state.movingSpeed}</span>
						</li>
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
export default PSettingBox;
