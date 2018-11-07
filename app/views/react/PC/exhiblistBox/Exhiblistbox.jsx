/**图文标签页 */
import React, { Component } from 'react';
import './Exhiblistbox.css';

class Exhiblistbox extends Component {
	constructor() {
		super();
		this.intervalTime = 0;
		this.downTime = 0;
    }
    
    mouseClick(){
		if(this.intervalTime < 200){
			this.props.getPhotoWall(this.props.markerID);
		}
	}

	mouseDown(){
		this.downTime = new Date().getTime();
	}
	
	mouseUp(){
		this.intervalTime = new Date().getTime() - this.downTime;
	}

	render() {
		return (
			<li
				className={'exhiblistBox' + (this.props.active ? ' active' : '')}
				onClick={this.mouseClick.bind(this)}
				name={this.props.markerID}
				title={this.props.name}
				onMouseDown={this.mouseDown.bind(this)}
				onMouseUp={this.mouseUp.bind(this)}
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
