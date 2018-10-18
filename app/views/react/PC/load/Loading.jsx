/**loading界面 */
import React, { Component } from 'react';
import './Loading.css';

class Loading extends Component {
	constructor() {
		super();

		this.state = {
			schedule: 0,
			show: false,
			point: 0
		};
	}

	componentWillMount() {
		let rad, num;
		let time = setInterval(() =>{
			rad = Math.random() * 3;
			num = parseInt(this.state.schedule + rad);
			if (num >= 100) {
				num = 100;
			}
			this.setState({
				schedule: num,
				point: -14 + 340 * num / 100
			});
			if (num == 100) {
				clearInterval(time);
				this.setState({
					show: false
				});
			}
		}, 60);
	}

	render() {
		return this.state.show ? (
			<div className="loadbox">
				<img />
				<div className="loading">
					<div className="load">
						<i className="num" style={{ transform: `translateX(${(15+this.state.point)}px)` }}>
							{this.state.schedule}%
						</i>
						<div className="loadbar">
							<i />
                            <span style={{ transform: `translateX(${(15+this.state.point)}px)` }} /> 
                            
						</div>
					</div>
					<p>正在加载中...</p>
				</div>
			</div>
		) : (
			''
		);
	}
}

export default Loading;
