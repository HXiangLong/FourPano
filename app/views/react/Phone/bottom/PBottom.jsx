/** */
import React, { Component } from 'react';
import './PBottom.css';

class PBottom extends Component {
	constructor() {
		super();
	}

	showIntroduction(){
		this.props.showIntroduction({
			off:true
		});
	}

	render() {
		return (
			<div className="PMainMenu">
				<ul>
					<li className="exhibithall">
						<p>展厅</p>
					</li>
					<li className="summary" onClick={this.showIntroduction.bind(this)}>
						<p>简介</p>
					</li>
					<li className="roam">
						<p>漫游</p>
					</li>
					<li className="collect">
						<p>藏品</p>
					</li>
				</ul>
			</div>
		)
	}
}
export default PBottom;
