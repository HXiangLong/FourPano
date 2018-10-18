/**展厅列表 */

import React, { Component } from 'react';
import './Thumbnails.css';
import Exhiblistbox from '../exhiblistBox';
import * as constants from '../../../../src/tool/SWConstants';
import { jumpSite } from '../../../../src/tool/SWInitializeInstance';

class Thumbnails extends Component {
	constructor() {
		super();
		this.state = {
			controlArrow: false,
			nowItem: 0, //往前进几个
			slidesToShow: 5, //每次动几个
			translateX: 0,
			animationTime: 500
		};
		this.amountNum = 0; //可以动弹的数量
		this.interval = -199;
		this.mouseX = 0;
		this.mouseDownBoo = false;
	}

	componentWillUpdate() {
		this.amountNum =
			constants.c_thumbnailsForMuseum.length - 6 < 0 ? 0 : constants.c_thumbnailsForMuseum.length - 6;
		this.controlArrow = this.amountNum > 0;
	}

	itemOnClick(panoID) {
        this.props.closeThumbnails();
        if(panoID != constants.c_StationInfo.panoID){
            jumpSite(panoID);
        }
    }

	createTable() {
		let museumID, exhibID;
		for (let i = 0; i < constants.c_FloorsMapTable.getValues().length; i++) {
			let floormap = constants.c_FloorsMapTable.getValue(i + 1);
			let mapmarker = floormap.rasterMapMarkers.getValues();
			$.each(mapmarker, (idx, obj) => {
				if (obj.panoID == constants.c_StationInfo.panoID) {
					museumID = floormap.displayPriority;
					exhibID = floormap.floorID;
				}
			});
		}

		let table = [];
		constants.c_thumbnailsForMuseum.forEach((item, idx) => {
			if (museumID == item.sceneID || item.sceneID == '') {
				table.push(
					<Exhiblistbox
						key={`thumbnails${idx}`}
						active={exhibID == item.floorID}
						getPhotoWall={this.itemOnClick.bind(this)}
						markerID={item.panoID}
						name={item.name}
						sanwei={false}
						imgUrl={`${constants.sw_getService.resourcesUrl}/${item.filePath}`}
					/>
				);
			}
		});
		return table;
	}

	leftArrow(event) {
		let num = this.state.nowItem - this.state.slidesToShow;
		num = num < 0 ? 0 : num;
		this.setState({
			nowItem: num,
			translateX: num * this.interval,
			animationTime: 500
		});
	}

	rightArrow(event) {
		let num = this.state.nowItem + this.state.slidesToShow;
		num = num > this.amountNum ? this.amountNum : num;
		this.setState({
			nowItem: num,
			translateX: num * this.interval,
			animationTime: 500
		});
	}

	mouseDown(event) {
		event.preventDefault();
		event.stopPropagation();
		this.mouseX = event.clientX;
		this.mouseDownBoo = true;
		this.setState({
			animationTime: 0
		});
	}

	mouseMove(event) {
		event.preventDefault();
		event.stopPropagation();
		if (this.mouseDownBoo && this.controlArrow) {
			let mouseMoveX = event.clientX - this.mouseX;
			let num = this.state.translateX + mouseMoveX;
			let num1 = num < this.amountNum * this.interval ? this.amountNum * this.interval : num > 0 ? 0 : num;
			this.setState({
				translateX: num1
			});

			this.mouseX = event.clientX;
		}
	}

	mouseUp(event) {
		event.preventDefault();
		event.stopPropagation();
		if (this.mouseDownBoo && this.controlArrow) {
			this.mouseDownBoo = false;

			let rounding = Math.round(this.state.translateX / this.interval);
			this.setState({
				nowItem: rounding,
				translateX: rounding * this.interval,
				animationTime: 500
			});
		}
	}

	render() {
		return this.props.off ? (
			<div className="ThumbnailsBox">
				{this.controlArrow ? (
					<div className="iconfont icon-zuo left" onClick={this.leftArrow.bind(this)} />
				) : (
					''
				)}
				<div
					className="exhiblistItem"
					onMouseDown={this.mouseDown.bind(this)}
					onMouseMove={this.mouseMove.bind(this)}
					onMouseUp={this.mouseUp.bind(this)}
					onTouchStart={this.mouseDown.bind(this)}
					onTouchMove={this.mouseMove.bind(this)}
					onTouchEnd={this.mouseUp.bind(this)}
				>
					<ul
						style={{
							textAlign: `${this.controlArrow ? 'left' : 'center'}`,
							width: `${this.controlArrow ? '20000px' : '1195px'}`,
							transform: `translateX(${this.state.translateX}px)`,
							transition: `-webkit-transform ${this.state.animationTime}ms ease 0s`
						}}
					>
						{this.createTable()}
					</ul>
				</div>
				{this.controlArrow ? (
					<div className="iconfont icon-gengduo right" onClick={this.rightArrow.bind(this)} />
				) : (
					''
				)}
			</div>
		) : (
			''
		);
	}
}

export default Thumbnails;
