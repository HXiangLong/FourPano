/**头部菜单 */

import React, { Component } from 'react';
import './PHeader.css';

class PHeader extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div className="PPanoName">
				<div className="titles">当前位置：</div>
				<div className="conts">{this.props.panoNames}</div>
			</div>
		);
	}
}

export default PHeader;
