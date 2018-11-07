/**评论输入界面 */
import React, { Component } from 'react';
import * as constants from '../../../../src/tool/SWConstants';
import './ReviewInput.css';

class ReviewInput extends Component {
	constructor() {
		super();
		this.state = {
			content: ''
		};
	}

	/**关闭界面 */
	closeReviewInput() {
		this.props.changeViewPicture({
			off: false
		});
	}

	/**评论内容录入 */
	handleInputChange(event) {
		this.setState({
			content: event.target.value
		});
	}

	/**发布按钮点击事件 */
	handleSubmit() {
		constants.sw_getService.AddComment(this.props.exhibitID,this.state.content);
		this.setState({
			content: ""
		});
	}

	render() {
		return this.props.off ? (
			<div className="layerboxwrap">
				<div className="UIBG" onClick={this.closeReviewInput.bind(this)} />
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeReviewInput.bind(this)} />
				<div className="comment-input">
					<div className="comment-field">
						<span className="comment-field-name">评论内容：</span>
						<div className="comment-field-input">
							<textarea
								name="content"
								value={this.state.content}
								onChange={this.handleInputChange.bind(this)}
								placeholder="请输入评论，限制50字符"
								maxLength={50}
							/>
							<div className="characters"><span>{`${this.state.content.length}/50`}</span></div>
						</div>
					</div>
					<div className="comment-field-button">
						<button onClick={this.handleSubmit.bind(this)}>发布</button>
					</div>
				</div>
			</div>
		) : (
			''
		);
	}
}
export default ReviewInput;
