/**图文标签页 */
import React, { Component } from 'react';
import './PExhiblistbox.css';

class PExhiblistbox extends Component {
	constructor() {
		super();
	}

	mouseClick() {
		this.props.getPhotoWall(this.props.markerID);
	}

	render() {
		return (
			<div
				className={'PExhiblistBox' + (this.props.active ? ' active' : '')}
				onClick={this.mouseClick.bind(this)}
				name={this.props.markerID}
				title={this.props.name}
			>
				{this.props.sanwei ? <div className="sanwei" /> : ''}
				<div className="imgstyle">
					<img draggable={false} src={this.props.imgUrl} />
				</div>
				<p>{this.props.name}</p>
			</div>
		);
	}
}
export default PExhiblistbox;
