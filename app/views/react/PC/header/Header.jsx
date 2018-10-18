/**头部菜单 */

import React, { Component } from 'react';
import './Header.css';
import ShareButtons from '../share';
const external = require('../../../../src/tool/SWExternalConst.js');

class Header extends Component {
	constructor() {
		super();

		this.state = {
			//检测全屏状态
			isFullScreen: false
		};
		this.myRef = React.createRef();
	}

	componentWillMount() {
		this.props.open_close_Audio({
			audioUrl: external.server_json.data.bgMusic
		});
	}

	componentDidMount() {
		this.watchFullScreen();
	}

	/**播放背景音乐 */
	playBackAudio() {
		this.props.open_close_Audio({
			closeYourself: !this.props.closeYourself
		});
	}

	/**帮助界面 */
	showHelp() {
		this.props.openHelp(true);
	}

	/**全屏 */
	fullScreen() {
		console.log('fullscreen:', this.state.isFullScreen);

		if (!this.state.isFullScreen) {
			this.requestFullScreen();
		} else {
			this.exitFullscreen();
		}
	}

	//进入全屏
	requestFullScreen() {
		console.log('requestFullScreen');
		let de = document.documentElement;
		if (de.requestFullscreen) {
			de.requestFullscreen();
		} else if (de.mozRequestFullScreen) {
			de.mozRequestFullScreen();
		} else if (de.webkitRequestFullScreen) {
			de.webkitRequestFullScreen();
		}
	}

	//退出全屏
	exitFullscreen() {
		console.log('exitFullscreen');
		var de = document;
		if (de.exitFullscreen) {
			de.exitFullscreen();
		} else if (de.mozCancelFullScreen) {
			de.mozCancelFullScreen();
		} else if (de.webkitCancelFullScreen) {
			de.webkitCancelFullScreen();
		}
	}

	//监听fullscreenchange事件
	watchFullScreen() {
		const _self = this;
		document.addEventListener(
			'fullscreenchange',
			function() {
				_self.setState({
					isFullScreen: document.fullscreen
				});
			},
			false
		);

		document.addEventListener(
			'mozfullscreenchange',
			function() {
				_self.setState({
					isFullScreen: document.mozFullScreen
				});
			},
			false
		);

		document.addEventListener(
			'webkitfullscreenchange',
			function() {
				_self.setState({
					isFullScreen: document.webkitIsFullScreen
				});
			},
			false
		);
	}

	/**显示设置界面 */
	showSetting(){
		this.props.show_Setting();
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
			<div className="header">
				<ul className="quickmenu">
					<li className="headerLi share_share">
						<i />
						<span>分享</span>
						<ShareButtons
							sites={[ 'weibo', 'qzone', 'qq', 'douban', 'wechat' ]}
							title="全景"
							description="一键分享到各大社交网站的react组件"
						/>
					</li>
					<li
						className={
							'headerLi BGMusic' + (this.props.closeYourself && this.props.bgMusicOff ? '' : ' closed')
						}
						title={this.props.closeYourself && this.props.bgMusicOff ? '关闭声音' : '开启声音'}
						onClick={this.playBackAudio.bind(this)}
					>
						<i />
						<span>音频</span>
						{this.props.closeYourself && this.props.bgMusicOff ? (
							<audio ref={this.myRef} src={this.props.audioUrl} autoPlay="autoplay" loop="loop" />
						) : (
							''
						)}
					</li>
					<li className="headerLi help" onClick={this.showHelp.bind(this)}>
						<i />
						<span>帮助</span>
					</li>
					<li
						className={`headerLi ${!this.state.isFullScreen ? 'full' : 'half'}`}
						onClick={this.fullScreen.bind(this)}
						title={!this.state.isFullScreen ? '开启全屏' : '退出全屏'}
					>
						<i />
						<span>全屏</span>
					</li>
					<li className="headerLi setup" onClick={this.showSetting.bind(this)}>
						<i />
						<span>设置</span>
					</li>
				</ul>
			</div>
		);
	}
}

export default Header;
