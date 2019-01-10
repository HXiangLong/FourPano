/**简介*/
import React, { Component } from 'react';
import './PIntroductionSimple.css';

class PIntroductionSimple extends Component {
	constructor() {
		super();
	}

	closeIntroductionSimple() {
		this.props.IntroductionState({
			off: !this.props.off
		});
	}

	render() {
		return this.props.off ? (
			<div className="phoneIntroductionShade">
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
						<div className="cont" dangerouslySetInnerHTML={{ __html: this.props.content }} />//html标签转义
					</div>
				</div>
			</div>
		) : (
			''
		);
	}
}
export default PIntroductionSimple;
