/** 弹窗 用于三维、环拍、内嵌网页 */
import React, { Component } from 'react';
import './POpenIframe.css';

class POpenIframe extends Component {
	constructor() {
		super();
	}
	
	closeIframe() {
        this.props.openIframe({
            iframeOff: !this.props.iframeOff,
            iframeUrl: ""
        });
    }

	
	render() {
		return this.props.iframeOff ? (
			<div className="threeiframe">
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeIframe.bind(this)} />
				<iframe src={this.props.iframeUrl} scrolling="no"/>
			</div>
		) : (
			''
		);
	}

}
export default POpenIframe;
