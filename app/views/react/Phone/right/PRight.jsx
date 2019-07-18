/**右边按钮*/
import React, { Component } from 'react';
import * as constants from '../../../../src/tool/SWConstants';
import { VRShow, VRHide, gyroStatus } from '../../../../src/tool/SWInitializeInstance';
import './PRight.css';
const external = require('../../../../src/tool/SWExternalConst.js');

class PRight extends Component {
	constructor() {
		super();
		this.state = {
			shakeOff: false,
			vrOff: false,
			gyroOff: false
		};
		this.myRef = React.createRef();
	}

	/**播放背景音乐 */
	playBackAudio() {
		this.props.open_close_Audio({
			closeYourself: !this.props.closeYourself
		});
	}

	/**显示设置界面 */
	showSetting() {
		this.props.show_Setting();
	}

	shakeClick() {
		if (this.state.shakeOff) {
			constants.sw_mouseControl.deleteShakeEvent();
			this.props.OpenPrompt('关闭摇一摇');
		} else {
			this.props.OpenPrompt('开启摇一摇');
			constants.sw_mouseControl.addShakeEvent();
		}
		this.setState({
			shakeOff: !this.state.shakeOff
		});
	}

	vrClick() {
		if (this.state.vrOff) {
			VRHide();
			this.props.OpenPrompt('关闭VR模式');
		} else {
			this.props.OpenPrompt('开启VR模式');
			VRShow();
		}

		this.setState({
			vrOff: !this.state.vrOff
		});
	}

	gyroClick() {
		if (this.state.gyroOff) {
			this.props.OpenPrompt('关闭陀螺仪模式');
			gyroStatus(false);
		} else {
			this.props.OpenPrompt('开启陀螺仪模式');
			gyroStatus(true);
		}

		this.setState({
			gyroOff: !this.state.gyroOff
		});
	}

	render() {
		const audioNode = this.myRef.current;
		if (audioNode) {
			if (this.props.closeYourself) {
				if (this.props.bgMusicOff) {
					audioNode.play();
				} else {
					audioNode.pause();
				}
			} else {
				audioNode.pause();
			}
		}

		return (
			<ul className="index-quickmenu">
				{external.server_json.features.setup ? (
					<li className="set" onClick={this.showSetting.bind(this)} />
				) : (
					''
				)}
				{external.server_json.features.music ? (
					<li
						className={this.props.closeYourself && this.props.bgMusicOff ? 'music close' : 'music'}
						title={this.props.closeYourself && this.props.bgMusicOff ? '关闭声音' : '开启声音'}
						onClick={this.playBackAudio.bind(this)}
					>
						{this.props.closeYourself && this.props.bgMusicOff ? (
							<audio ref={this.myRef} src={this.props.audioUrl} autoPlay="autoplay" loop="loop" />
						) : (
							''
						)}
					</li>
				) : (
					''
				)}
				{external.server_json.features.vr ? (
					<li className={`ar${this.state.vrOff ? ' active' : ''}`} onClick={this.vrClick.bind(this)} />
				) : (
					''
				)}
				{external.server_json.features.gyro ? (
					<li className={`gyro${this.state.gyroOff ? ' active' : ''}`} onClick={this.gyroClick.bind(this)} />
				) : (
					''
				)}
				{external.server_json.features.shake ? (
					<li
						className={`shake${this.state.shakeOff ? ' active' : ''}`}
						onClick={this.shakeClick.bind(this)}
					/>
				) : (
					''
				)}
			</ul>
		);
	}
}
export default PRight;
