/**图文标签页 */
import React, { Component } from 'react';
import './Exhiblistbox.pcss';

class Exhiblistbox extends Component {
	constructor() {
		super();
    }
    
    mouseClick(){
        this.props.getPhotoWall(this.props.markerID);
    }

	render() {
		return (
			<li
				className={'exhiblistBox' + (this.props.active ? ' active' : '')}
				onClick={this.mouseClick.bind(this)}
				name={this.props.markerID}
				title={this.props.name}
			>
				{this.props.sanwei ? <div className="sanwei" /> : ''}
				<div className="imgstyle">
					<img draggable={false} src={this.props.imgUrl} />
				</div>
				<p>{this.props.name}</p>
			</li>
		);
	}
}
export default Exhiblistbox;
