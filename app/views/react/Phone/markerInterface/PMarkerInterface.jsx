/**详情界面*/
import React, { Component } from 'react';
import './PMarkerInterface.css';
import * as constants from '../../../../src/tool/SWConstants';
const external = require('../../../../src/tool/SWExternalConst.js');

class PMarkerInterface extends Component {
	constructor() {
		super();
		this.state = {
			audioOff: false,
			oldAudioOff: false,
			oldAudioUrl: '',
			nowItem: 0, //第几页
			slidesToShow: 1, //每次动几个
			translateX: 0,
			animationTime: 500,
			imgWidth: 0,
			imgHeight: 0
		};

		this.interval = -280;

		this.markerImgList = [];
		this.markerthumbs = [];
	}

	/**关闭界面 */
	closeMarkerInterface() {
		if (this.state.audioOff) {
			this.props.open_close_Audio({
				closeYourself: this.state.oldAudioOff,
				audioUrl: this.state.oldAudioUrl
			});

			this.setState({
				audioOff: false,
				nowItem: 0,
				translateX: 0
			});
		}

		this.props.markerInterfaceState({
			off: false
		});
	}

	/**弹出三维 */
	onShanWei() {
		let url = `${constants.sw_getService.resourcesUrl}/BusinessData/ExhibitDetails/3DModel/${this.props.d3}.html`;
		this.props.showIframe({
			iframeOff: true,
			iframeUrl: url
		});
	}

	/**弹出视频 */
	onShiPing() {
		this.props.showVideo({
			off: true,
			videoUrl: this.props.video
		});
	}

	/**弹出书籍 */
	onBooks() {
		let url = `${constants.sw_getService.resourcesUrl}/BusinessData/ExhibitDetails/Book/${this.props
			.book}/index.html`;
		this.props.showIframe({
			iframeOff: true,
			iframeUrl: url
		});
	}

	/**播放音频 */
	onYinPin() {
		if (!this.state.audioOff) {
			this.setState({
				audioOff: true,
				oldAudioOff: this.props.closeYourself,
				oldAudioUrl: this.props.audioUrl
			});
			let url = `${constants.sw_getService.resourcesUrl}/BusinessData/ExhibitDetails/Audio/${this.props.audio}`;
			this.props.open_close_Audio({
				closeYourself: true,
				audioUrl: url
			});
		} else {
			this.setState({
				audioOff: false
			});
			this.props.open_close_Audio({
				closeYourself: this.state.oldAudioOff,
				audioUrl: this.state.oldAudioUrl
			});
		}
	}

	/**喜欢点赞 */
	onLike() {
		constants.sw_getService.SetLikesForExhibitID(this.props.exhibitID);
	}

	/**介绍文本解析 */
	markerContent() {
		let arr = this.props.content.split('&P&');

		let str = '';

		arr.forEach((obj) => {
			if (obj != '' && obj.indexOf('<right>') != -1) {
				//右对齐
				obj = obj.split('<right>')[1].split('</right>')[0];

				str += '<p style="float: right;padding-right: 22px;">' + obj + '</p>';
			} else {
				str += '<p>' + obj + '</p>';
			}
		});

		return str;
	}

	/**左箭头 */
	leftArrow(event) {
		let num = this.state.nowItem - this.state.slidesToShow;
		num = num < 0 ? 0 : num;
		this.setState({
			nowItem: num,
			translateX: num * this.interval * -1,
			animationTime: 500
		});
	}

	/**右箭头 */
	rightArrow(event) {
		let num = this.state.nowItem + this.state.slidesToShow;
		num = num >= this.props.imglist.length - 1 ? this.props.imglist.length - 1 : num;
		this.setState({
			nowItem: num,
			translateX: num * this.interval * -1,
			animationTime: 500
		});
	}

	/**图片列表 */
	imageList() {
		if (this.interval < 0) {
			let listTime = setTimeout(() => {
				clearTimeout(listTime);
				let imgboxDiv = document.getElementsByClassName('imgbox');
				let w = imgboxDiv[0].offsetWidth;
				let h = imgboxDiv[0].offsetHeight;
				this.setState({
					imgWidth: w,
					imgHeight: h
				});
				this.interval = w;
			}, 500);
			return '';
		}

		let imgArr = [];

		this.markerImgList = [];

		this.markerthumbs = [];

		this.props.imglist.forEach((item, idx) => {
			this.markerImgList.push(
				constants.c_currentState == constants.c_currentStateEnum.phoneStatus ? item.phoneMax : item.PCMax
			);

			this.markerthumbs.push(item.thumbnail);

			imgArr.push(
				<li key={`markerImg${idx}`} style={{ width: this.state.imgWidth, height: this.state.imgHeight }}>
					<img draggable={false} src={item.thumbnail} onClick={this.enlargeImage.bind(this, idx)} />
				</li>
			);
		});

		return imgArr;
	}

	/**查看大图 */
	enlargeImage(idx) {
		this.props.show_ViewPicture({
			off: true,
			idx: idx,
			imageList: this.markerImgList,
			thumbs: this.markerthumbs
		});
	}

	/**显示评论输入界面 */
	showCommentInput() {
		this.props.show_ReviewInput({
			off: true,
			exhibitID: this.props.exhibitID
		});
	}

	/**显示评论输出界面 */
	showCommentOutput() {
		this.props.markerInterfaceState({
			phoneCommnetOff: true
		});
	}

	render() {
		let boo = false;
		if (external.server_json.features.like || (this.props.links != '' && this.props.links)) {
			boo = true;
		}

		return this.props.off ? (
			<div className="MarkerInterface">
				<div className="UIBG" onClick={this.closeMarkerInterface.bind(this)} />
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeMarkerInterface.bind(this)} />

				<div className="PDetailbox">
					<div className="imgbox">
						<div
							className="num"
							style={{
								bottom:
									(this.props.d3 != '' && this.props.d3 != undefined) ||
									(this.props.video != '' && this.props.video != undefined) ||
									(this.props.book != '' && this.props.book != undefined) ||
									(this.props.audio != '' && this.props.audio != undefined)
										? 20
										: 5
							}}
						>
							<span className="current">{this.state.nowItem + 1}</span>/<span className="count">{this.props.imglist.length}</span>
						</div>
						<div className="iconfont icon-zuo wwimglistLeft" onClick={this.leftArrow.bind(this)} />
						<div className="wwimglist">
							<ul
								style={{
									textAlign: `left`,
									width: `20000px`,
									transform: `translateX(${this.state.translateX}px)`,
									transition: `-webkit-transform ${this.state.animationTime}ms ease 0s`
								}}
							>
								{this.imageList()}
							</ul>
						</div>
						<div className="iconfont icon-gengduo wwimglistRight" onClick={this.rightArrow.bind(this)} />

						<ul className="quickmenu">
							{this.props.d3 != '' && this.props.d3 != undefined ? (
								<li className="iconfont icon-sanweimoxing" onClick={this.onShanWei.bind(this)}>
									<span> 三维</span>
								</li>
							) : (
								''
							)}
							{this.props.video != '' && this.props.video != undefined ? (
								<li className="iconfont icon-iconfontshipin" onClick={this.onShiPing.bind(this)}>
									<span> 视频</span>
								</li>
							) : (
								''
							)}
							{this.props.book != '' && this.props.book != undefined ? (
								<li className="iconfont icon-shu" onClick={this.onBooks.bind(this)}>
									<span> 书籍</span>
								</li>
							) : (
								''
							)}
							{this.props.audio != '' && this.props.audio != undefined ? (
								<li
									className={`iconfont ${this.state.audioOff
										? 'icon-yinpin_audio'
										: 'icon-guanbiyinpin'}`}
									onClick={this.onYinPin.bind(this)}
								>
									<span> 音频</span>
								</li>
							) : (
								''
							)}
						</ul>
					</div>

					<div className="detail">
						<div className="title">{this.props.title}</div>
						<div
							className="cont"
							style={
								boo ? (
									{ height: 'calc(100% - 4.4rem)' }
								) : external.server_json.features.comment ? (
									{ height: 'calc(100% - 4.4rem)' }
								) : (
									{ height: 'calc(100% - 2.4rem)' }
								)
							}
							dangerouslySetInnerHTML={{ __html: this.markerContent() }}
						/>
						<ul className="detailQuickmenu">
							{external.server_json.features.like ? (
								<li
									title="喜欢"
									className="iconfont icon-xihuan dianzhan1"
									onClick={this.onLike.bind(this)}
								>
									<p>{parseInt(this.props.likeNum) >= 99 ? '99+' : this.props.likeNum}</p>
								</li>
							) : (
								''
							)}
							{external.server_json.features.comment ? (
								<li
									title="评论"
									className="iconfont icon-pinglun gengduo1"
									onClick={this.showCommentInput.bind(this)}
								/>
							) : (
								''
							)}
							{external.server_json.features.comment ? (
								<li
									title="查看评论"
									className="iconfont icon-pinglunliebiao gengduo1"
									onClick={this.showCommentOutput.bind(this)}
								/>
							) : (
								''
							)}
							{this.props.links != '' && this.props.links ? (
								<a href={this.props.links} target="_blank">
									<li title="想了解更多" className="iconfont icon-gengduo-2 gengduo1" />
								</a>
							) : (
								''
							)}
						</ul>
					</div>
				</div>
			</div>
		) : (
			''
		);
	}
}
export default PMarkerInterface;
