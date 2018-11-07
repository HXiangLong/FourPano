import React, { Component } from 'react';
import * as constants from '../../../../src/tool/SWConstants';
import './MarkerInterface.css';

/**标注介绍界面 */
class MarkerInterface extends Component {
	constructor() {
		super();
		this.state = {
			audioOff: false,
			oldAudioOff: false,
			oldAudioUrl: '',
			nowItem: 0, //第几页
			slidesToShow: 1, //每次动几个
			translateX: 0,
			animationTime: 500
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
			translateX: num * this.interval,
			animationTime: 500
		});
	}

	/**右箭头 */
	rightArrow(event) {
		let num = this.state.nowItem + this.state.slidesToShow;
		num = num >= this.props.imglist.length - 1 ? this.props.imglist.length - 1 : num;
		this.setState({
			nowItem: num,
			translateX: num * this.interval,
			animationTime: 500
		});
	}

	/**图片列表 */
	imageList() {
		let imgArr = [];

		this.markerImgList = [];

		this.markerthumbs = [];

		this.props.imglist.forEach((item, idx) => {
			let imgUrl = `${constants.sw_getService.resourcesUrl}/${item.filePath}`;

			this.markerImgList.push(imgUrl);

			let arr1 = item.filePath.split('/');

			let pp = `${constants.sw_getService.resourcesUrl}/${arr1[0]}/${arr1[1]}/${arr1[2]}/phone/${arr1[3]}`;

			this.markerthumbs.push(pp);

			imgArr.push(
				<li key={`markerImg${idx}`}>
					<img draggable={false} src={pp} onClick={this.enlargeImage.bind(this, idx)} />
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

	/**显示评论列表 */
	onComment() {
		let commentList = [];

		if (this.props.commentList.length == 0) {
			commentList.push(<li key={`comment0`}>{'还没有评论，快来抢沙发啦~~~~'}</li>);
		} else {
			this.props.commentList.forEach((item, idx) => {
				commentList.push(
					<li key={`comment${idx}`}>
						<p className="userName">{item.UserID == '' ? '游客：' : item.UserID}</p>
						<p className="content">{item.Contents}</p>
						<p className="timers">{item.AddTime}</p>
					</li>
				);
			});
		}

		return commentList;
	}

	showComment() {
		this.props.show_ReviewInput({
			off: true,
			exhibitID: this.props.exhibitID
		});
	}

	render() {
		return this.props.off ? (
			<div className="MarkerInterface">
				<div className="UIBG" onClick={this.closeMarkerInterface.bind(this)} />
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeMarkerInterface.bind(this)} />

				<div className="detailbox">
					<div className="imgbox">
						<div className="num">
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
						<div className="cont" dangerouslySetInnerHTML={{ __html: this.markerContent() }} />
						<ul className="detailQuickmenu">
							<li title="喜欢" className="iconfont icon-xihuan dianzhan" onClick={this.onLike.bind(this)}>
								<p>{parseInt(this.props.likeNum) >= 99 ? '99+' : this.props.likeNum}</p>
							</li>
							{/* <li title="收藏" className="iconfont icon-shoucang1">
							</li> */}
							<li
								title="评论"
								className="iconfont icon-pinglun gengduo"
								onClick={this.showComment.bind(this)}
							/>
							{/* <li title="分享" className="iconfont icon-fenxiang">
							</li> */}
							{this.props.links != '' ? (
								<a href={this.props.links} target="_blank">
									<li title="想了解更多" className="iconfont icon-gengduo-2 gengduo" />
								</a>
							) : (
								''
							)}
						</ul>
					</div>

					<div className="commentbox">
						<p>最新评论：</p>
						<ul>{this.onComment()}</ul>
					</div>
				</div>
			</div>
		) : (
			''
		);
	}
}

export default MarkerInterface;
