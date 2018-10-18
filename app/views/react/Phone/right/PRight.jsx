/** */
import React, { Component } from 'react';
import './PRight.css';

class PRight extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<ul className="index-quickmenu">
				<li className="map" />
				<li className="ar" />
				<li className="music" />
			</ul>
		);
	}
}
export default PRight;
