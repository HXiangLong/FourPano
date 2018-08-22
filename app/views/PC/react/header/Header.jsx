/**头部菜单 */

import React, { Component } from 'react';
import './Header.pcss';
import ShareButtons from '../share';
const external = require('../../../../src/tool/SWExternalConst.js');


class Header extends Component {
	constructor() {
		super();
		this.playBackAudio = this.playBackAudio.bind(this);
		this.showHelp = this.showHelp.bind(this);
		this.myRef = React.createRef();
	}

	componentWillMount(){
		this.props.open_close_Audio({
			audioUrl:external.server_json.data.bgMusic
		});
	}

	playBackAudio() {
		const audioNode = this.myRef.current;

		this.props.open_close_Audio({
			bgMusicOff: !this.props.bgMusicOff
		});

		if (!this.props.bgMusicOff) {
			audioNode.play();
		} else {
			audioNode.pause();
		}
	}

	showHelp() {
		this.props.openHelp(true);
	}

	render() {
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
						className={'headerLi BGMusic' + (this.props.bgMusicOff ? '' : ' closed')}
						title={this.props.bgMusicOff ? '关闭声音' : '开启声音'}
						onClick={this.playBackAudio}
					>
						<i />
						<span>音频</span>
						<audio ref={this.myRef} src={this.props.audioUrl} autoPlay="autoplay" loop="loop" />
					</li>
					<li className="headerLi help" onClick={this.showHelp}>
						<i />
						<span>帮助</span>
					</li>
					<li className="headerLi setup">
						<i />
						<span>设置</span>
					</li>
				</ul>
			</div>
		);
	}
}

export default Header;
