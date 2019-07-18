/**弹窗 用于三维、环拍、内嵌网页 */

import React, { Component } from 'react';
import './OpenIframe.css';
import ShareButtons from '../share';
const external = require('../../../../src/tool/SWExternalConst.js');

class OpenIframe extends Component {
	constructor() {
		super();

		this.closeIframe = this.closeIframe.bind(this);
	}

	closeIframe() {
		this.props.openIframe({
			iframeOff: !this.props.iframeOff,
			iframeUrl: ''
		});
	}

	render() {
		return this.props.iframeOff ? (
			<div className="threeiframe">
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeIframe} />
				<div className="iconfont icon-fenxiang iframeFengXiang">
					<ShareButtons
						url={this.props.iframeUrl}
						sites={[ 'weibo', 'qq', 'wechat' ]}
						title={this.props.iframeName}
						site={external.server_json.projectName}
						description=""
					/>
				</div>
				<iframe src={this.props.iframeUrl} />
			</div>
		) : (
			''
		);
	}
}

export default OpenIframe;
