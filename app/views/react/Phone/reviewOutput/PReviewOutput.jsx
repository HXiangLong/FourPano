/**评论输出界面 */
import React, { Component } from 'react';
import './PReviewOutput.css';

class PReviewOutput extends Component {
	constructor() {
		super();
		this.state = {
			content: ''
		};
	}

	/**关闭界面 */
	closeReviewOutput() {
		this.props.markerInterfaceState({
			phoneCommnetOff: false
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

	render() {
		return this.props.phoneCommnetOff ? (
			<div className="layerboxwrap">
				<div className="UIBG" onClick={this.closeReviewOutput.bind(this)} />
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeReviewOutput.bind(this)} />
				<div className="comment-output">
					<p>最新评论：</p>
					<ul>{this.onComment()}</ul>
				</div>
			</div>
		) : (
			''
		);
	}
}
export default PReviewOutput;
