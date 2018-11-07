/**右边按钮*/
import React, { Component } from 'react';
import './PRight.css';
const external = require('../../../../src/tool/SWExternalConst.js');

class PRight extends Component {
	constructor() {
		super();
		this.myRef = React.createRef();
	}

	componentWillMount() {
		this.props.open_close_Audio({
			audioUrl:external.server_json.data.resourcePath +  external.server_json.data.bgMusic
		});
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

	/**显示小地图 */
	showPanoMap() {
		this.props.openPanoMapOff ? this.props.showPanoMap({ phoneOff: false }) : this.props.showPanoMap({ phoneOff: true });
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
				<li className="map" onClick={this.showPanoMap.bind(this)} />
				<li className="ar" />
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
				<li className="set" onClick={this.showSetting.bind(this)} />
			</ul>
		);
	}
}
export default PRight;
