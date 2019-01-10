/**帮助 */

import React, { Component } from 'react';
import './Help.css';
const external = require('../../../../src/tool/SWExternalConst');

const helpImgs = [
	require('../../../../commons/img/help/help1.png'), //操作
	require('../../../../commons/img/help/help2.png'), //操作
	require('../../../../commons/img/help/help3.png'), //展厅
	require('../../../../commons/img/help/help4.png'), //简介
	require('../../../../commons/img/help/help5.png'), //文物
	require('../../../../commons/img/help/help6.png'), //测量
	require('../../../../commons/img/help/help7.png'), //漫游
	require('../../../../commons/img/help/help8.png') //地图
];

class Help extends Component {
	constructor() {
		super();
		this.helpImgArr = [];
		this.helpImgArr.push(helpImgs[0]);
		this.helpImgArr.push(helpImgs[1]);

		if(external.server_json.features.exhibithall){//展厅
			this.helpImgArr.push(helpImgs[2]);
		}
		if(external.server_json.features.summary){//简介
			this.helpImgArr.push(helpImgs[3]);
		}
		if(external.server_json.features.collect){//文物
			this.helpImgArr.push(helpImgs[4]);
		}
		if(external.server_json.features.measure){//测量
			this.helpImgArr.push(helpImgs[5]);
		}
		if(external.server_json.features.roam != 0){//漫游
			this.helpImgArr.push(helpImgs[6]);
		}
		if(external.server_json.features.map){//地图
			this.helpImgArr.push(helpImgs[7]);
		}

		this.state = {
			page: 1,
			allpage: this.helpImgArr.length,
			display: true
		};
	}

	nextLeft() {
		this.setState((prestate) => {
			return {
				page: prestate.page - 1 < 1 ? prestate.allpage : prestate.page - 1
			};
		});
	}

	nextRight() {
		this.setState((prestate) => {
			return {
				page: prestate.page + 1 > prestate.allpage ? 1 : prestate.page + 1
			};
		});
	}

	closeHelp() {
		this.props.closeHelp();
	}

	showPic() {
		let list = [];
		this.helpImgArr.forEach((items, idx) => {
			list.push(
				<div key={`help${idx}`} className="helpitem">
					<img src={items} />
				</div>
			);
		});
		return list;
	}

	render() {
		return this.props.openHelp ? (
			<div className="helpshade">
				<div className="UIBG" onClick={this.closeHelp.bind(this)} />
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeHelp.bind(this)} />
				<div className="helpbox">
					<div className="iconfont icon-zuo helpLeft" onClick={this.nextLeft.bind(this)} />
					<div className="iconfont icon-gengduo helpRight" onClick={this.nextRight.bind(this)} />
					<div className="helpboximgs">
						<div
							className="helpboxlist"
							style={{ transform: `translateX(${(this.state.page - 1) * -590}px)` }}
						>
							{this.showPic()}
						</div>
					</div>
					<div className="helpnum">
						<span className="helpcurrent">{this.state.page}</span>/<span className="helpcount">{this.state.allpage}</span>
					</div>
				</div>
			</div>
		) : (
			''
		);
	}
}

export default Help;
