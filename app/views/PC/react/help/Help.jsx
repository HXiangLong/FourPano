/**帮助 */

import React, { Component } from 'react';
import './Help.pcss';

class Help extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			allpage: this.props.helpList.length,
			display: true
		};

		this.nextLeft = this.nextLeft.bind(this);
		this.nextRight = this.nextRight.bind(this);
		this.closeHelp = this.closeHelp.bind(this);
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
		this.props.closeHelp()
	}

	render() {
		return this.props.openHelp ? (
			<div className="helpshade">
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeHelp} />
				<div className="helpbox">
					<div className="iconfont icon-zuo helpLeft" onClick={this.nextLeft} />
					<div className="iconfont icon-gengduo helpRight" onClick={this.nextRight} />
					<div className="helpboximgs">
						<div
							className="helpboxlist"
							style={{ transform: `translateX(${(this.state.page - 1) * -590}px)` }}
						>
							{this.props.helpList.map((items, idx) => {
								return (
									<div className="helpitem">
										<img src={items} />
									</div>
								);
							})}
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
