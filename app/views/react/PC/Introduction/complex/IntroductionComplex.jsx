/**复杂版简介 */
import React, { Component } from 'react';
import './IntroductionComplex.css';
import Slider from 'react-slick';
const external = require('../../../../../src/tool/SWExternalConst.js');

class IntroductionComplex extends Component {
	constructor() {
		super();
		this.state = {
			showIndex: 0
		};
		this.picurl = 1;
		this.pitemNum = 1;
		this.suffix = 1;
	}

	/**关闭复杂界面 */
	closeIntroductionComplex() {
		this.onShowState(0);
		this.props.IntroductionState({
			off: false
		});
		this.props.open_close_Audio({
			bgMusicOff: true
		});
	}

	/**显示那个状态 */
	onShowState(index) {
		this.setState({
			showIndex: index
		});
	}

	createTable() {
		let table = [];
		for (let i = 0; i < this.pitemNum; i++) {
			table.push(
				<div key={`IntroductionComplex${i}`}>
					<img src={`${external.server_json.data.resourcePath}${this.picurl}${i + 1}${this.suffix}`} />
				</div>
			);
		}
		return table;
	}

	render() {
		this.picurl =
			this.state.showIndex == 1
				? external.server_json.data.ComplexIntroduction.picUrl
				: this.state.showIndex == 3
					? external.server_json.data.ComplexIntroduction.birdUrl
					: this.state.showIndex == 4 ? external.server_json.data.ComplexIntroduction.mapPicUrl : '';
		this.pitemNum =
			this.state.showIndex == 1
				? external.server_json.data.ComplexIntroduction.picNum
				: this.state.showIndex == 3
					? external.server_json.data.ComplexIntroduction.birdNum
					: this.state.showIndex == 4 ? external.server_json.data.ComplexIntroduction.mapPicNum : 0;
		this.suffix =
			this.state.showIndex == 1
				? external.server_json.data.ComplexIntroduction.picSuffix
				: this.state.showIndex == 3
					? external.server_json.data.ComplexIntroduction.birdSuffix
					: this.state.showIndex == 4 ? external.server_json.data.ComplexIntroduction.mapPicSuffix : '';

		const settings = {
			dots: true,
			lazyLoad: true,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1,
			initialSlide: 0
		};

		if(this.props.off){
			this.props.open_close_Audio({
				bgMusicOff: false
			});
		}

		return this.props.off ? (
			<div className="IntroductionComplex">
				<div className="bg">
					<img
						src={
							external.server_json.data.resourcePath + external.server_json.data.ComplexIntroduction.bgUrl
						}
					/>
				</div>
				<div
					className="iconfont icon-guanbi closeIcon closecolor"
					onClick={this.closeIntroductionComplex.bind(this)}
				/>
				<ul className="listUl">
					<li className="wenbenjieshao" onClick={this.onShowState.bind(this, 0)}>
						<i />
						<p>介绍简介</p>
					</li>
					<li className="shipinjieshao" onClick={this.onShowState.bind(this, 2)}>
						<i />
						<p>介绍视频</p>
					</li>
					<li className="tupianjieshao" onClick={this.onShowState.bind(this, 1)}>
						<i />
						<p>馆内图片</p>
					</li>
					<li className="niaokanjieshao" onClick={this.onShowState.bind(this, 3)}>
						<i />
						<p>鸟瞰图</p>
					</li>
					<li className="guanneijieshao" onClick={this.onShowState.bind(this, 4)}>
						<i />
						<p>馆内地图</p>
					</li>
					<li className="zaixianditu" onClick={this.onShowState.bind(this, 5)}>
						<i />
						<p>在线地图</p>
					</li>
					<li className="jinruquanjing" onClick={this.closeIntroductionComplex.bind(this)}>
						<i />
						<p>进入全景</p>
					</li>
				</ul>

				{this.state.showIndex == 0 ? (
					<div className="wenbenjieshaoBox">
						<div className="title">{external.server_json.data.ComplexIntroduction.title}</div>
						<div
							className="cont"
							dangerouslySetInnerHTML={{ __html: external.server_json.data.ComplexIntroduction.content }}
						/>//html标签转义
					</div>
				) : this.state.showIndex == 1 ? (
					<div className="tupianjieshaoBox">
						<div className="ReactSlickBox">
							<Slider {...settings}>{this.createTable()}</Slider>
						</div>
					</div>
				) : this.state.showIndex == 2 ? (
					<div className="shipinjieshaoBox">
						<video
							ref={this.myVideoRef}
							src={
								external.server_json.data.resourcePath +
								external.server_json.data.ComplexIntroduction.videos
							}
							autoPlay="autoPlay"
							controls="true"
							controlsList="nodownload"
						/>
					</div>
				) : this.state.showIndex == 3 ? (
					<div className="tupianjieshaoBox">
						<div className="ReactSlickBox">
							<Slider {...settings}>{this.createTable()}</Slider>
						</div>
					</div>
				) : this.state.showIndex == 4 ? (
					<div className="tupianjieshaoBox">
						<div className="ReactSlickBox">
							<Slider {...settings}>{this.createTable()}</Slider>
						</div>
					</div>
				) : (
					<div className="zaixiandituBox">
						<iframe src={external.server_json.data.ComplexIntroduction.baiduMap} />
					</div>
				)}
			</div>
		) : (
			''
		);
	}
}

export default IntroductionComplex;
