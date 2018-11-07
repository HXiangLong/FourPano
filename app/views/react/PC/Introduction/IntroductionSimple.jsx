/**简单版简介 */
import React, { Component } from 'react';
import './IntroductionSimple.css';
const external = require('../../../../src/tool/SWExternalConst.js');

class IntroductionSimple extends Component {
	constructor() {
		super();
	}

	componentWillMount() {
		this.props.IntroductionState({
			imgurl:  external.server_json.data.resourcePath + external.server_json.data.Introduction.imgUrl,
			title: external.server_json.data.Introduction.title,
			content: external.server_json.data.Introduction.content
		});
	}

	closeIntroductionSimple() {
		this.props.IntroductionState({
			off: !this.props.off
		});
	}

	render() {
		return this.props.off ? (
			<div className="introductionShade">
				<div className="UIBG" onClick={this.closeIntroductionSimple.bind(this)} />
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeIntroductionSimple.bind(this)} />
				<div className="detailbox">
					<div className="imgbox">
						<div className="imgstyle">
							<img src={this.props.imgurl} />
						</div>
					</div>
					<div className="detail">
						<div className="title">{this.props.title}</div>
						<div className="cont" dangerouslySetInnerHTML={{ __html: this.props.content }}></div>//html标签转义
					</div>
				</div>
			</div>
		) : (
			''
		);
	}
}

export default IntroductionSimple;
