/**头部菜单 */

import React, { Component } from 'react';
import './Header.pcss';
import ShareButtons from '../share';

class Header extends Component {
	constructor() {
		super();
		this.state = {
			audioUrl: 'http://localhost:8096/NodeAllProject/FourPano/app/commons/img/backmusic.mp3',
			audioOff: true,
			audioTitle: '关闭声音'
		};
		this.playBackAudio = this.playBackAudio.bind(this);
		this.myRef = React.createRef();
	}

	playBackAudio() {
		const audioNode = this.myRef.current;

		this.setState((prestate) => {
			return {
				audioOff: !prestate.audioOff,
				audioTitle: !prestate.audioOff ? '关闭声音' : '开启声音'
			};
		});

		if (!this.state.audioOff) {
			audioNode.play();
		} else {
			audioNode.pause();
		}
	}

	componentDidMount() {
		console.log('componentDidMount');

	}
  
	componentWillUnmount() {
		console.log('componentWillUnmount');
	}

	render() {
		// console.log('render');
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
						className={'headerLi BGMusic' + (this.state.audioOff ? '' : ' closed')}
						title={this.state.audioTitle}
						onClick={this.playBackAudio}
					>
						<i />
						<span>音频</span>
						<audio ref={this.myRef} src={this.state.audioUrl} autoPlay="autoplay" loop="loop" />
					</li>
					<li className="headerLi help">
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
