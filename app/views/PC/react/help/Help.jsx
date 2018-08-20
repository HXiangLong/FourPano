/**帮助 */

import React, { Component } from 'react';
import './Help.pcss';

class Help extends Component {
	constructor() {}

	render() {
		return (
			<div class="allshade" id="helpshade">
				<div class="iconfont shadeclose" onclick="hideShade()">
					&#xe611;
				</div>
				<div class="helpbox">
					<div class="helpitembox">
						<div class="item">
							<img src="../../../../commons/img/help/help1.png" />
						</div>
						<div class="item">
							<img src="../../../../commons/img/help/help2.png" />
						</div>
						<div class="item">
							<img src="../../../../commons/img/help/help3.png" />
						</div>
						<div class="item">
							<img src="../../../../commons/img/help/help4.png" />
						</div>
						<div class="item">
							<img src="../../../../commons/img/help/help5.png" />
						</div>
						<div class="item">
							<img src="../../../../commons/img/help/help6.png" />
						</div>
						<div class="item">
							<img src="../../../../commons/img/help/help7.png" />
						</div>
						<div class="item">
							<img src="../../../../commons/img/help/help8.png" />
						</div>
					</div>
					<div class="num">
						<span class="current">1</span>/<span class="count">6</span>
					</div>
				</div>
			</div>
		);
	}
}

export default Help;
