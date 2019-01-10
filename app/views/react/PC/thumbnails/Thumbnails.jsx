/**展厅列表 */

import React, { Component } from 'react';
import './Thumbnails.css';
import Exhiblistbox from '../exhiblistBox';
import * as constants from '../../../../src/tool/SWConstants';
import { jumpSite } from '../../../../src/tool/SWInitializeInstance';
const external = require('../../../../src/tool/SWExternalConst.js');

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
			constants.c_thumbnailsForMuseum.length - 5 < 0 ? 0 : constants.c_thumbnailsForMuseum.length - 5;
		this.controlArrow = this.amountNum > 0;
	}

	itemOnClick(panoID) {
		this.props.closeThumbnails();
		if (panoID != constants.c_StationInfo.panoID) {
			jumpSite(panoID);
		}
	}

	createTable() {
		let museumID, exhibID;

		let mapmarker = constants.c_panoIDTable.getValue(constants.c_StationInfo.panoID);

		for (let i = 0; i < constants.c_FloorsMapTable.getValues().length; i++) {

			let floormap = constants.c_FloorsMapTable.getValue(i + 1);

			if (mapmarker.rasterMapID == floormap.floorID) {

				museumID = floormap.displayPriority;

				exhibID = floormap.floorID;

				break;
			}
		}

		let table = [];

		constants.c_thumbnailsForMuseum.forEach((item, idx) => {
			
			if (museumID == item.sceneID || item.sceneID == '') {
				//同一楼层需要分展厅列表展示时用到floorInfo的DisplayPriority与Thumbnail的SceneID
				table.push(
					<Exhiblistbox
						key={`thumbnails${idx}`}
						active={
							item.displayPriority == 1 ? (
								exhibID == item.floorID
							) : (
								item.panoID == constants.c_StationInfo.panoID
							)
						} //另一种极端情况 把当前楼层（展厅）的所有站点列举出来了，这个时候就要对应Thumbnail的DisplayPriority，当DisplayPriority=2时
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
		if (event.type == 'touchstart') {
			this.mouseX = event.changedTouches[0].clientX;
		} else {
			event.preventDefault();
			event.stopPropagation();
			this.mouseX = event.clientX;
		}
		this.mouseDownBoo = true;
		this.setState({
			animationTime: 0
		});
	}

	mouseMove(event) {
		if (event.type == 'touchmove') {
			if (this.mouseDownBoo && this.controlArrow) {
				let mouseMoveX = event.changedTouches[0].clientX - this.mouseX;
				let num = this.state.translateX + mouseMoveX;
				let num1 = num < this.amountNum * this.interval ? this.amountNum * this.interval : num > 0 ? 0 : num;
				this.setState({
					translateX: num1
				});
				this.mouseX = event.changedTouches[0].clientX;
			}
		} else {
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
	}

	mouseUp(event) {
		if (event.type == 'mouseup') {
			event.preventDefault();
			event.stopPropagation();
		}

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
		return external.server_json.features.exhibithall ? this.props.off ? (
			<div className="ThumbnailsBox">
				<div className="itemBox">
					{this.controlArrow ? (
						<div
							className={`iconfont icon-zuo left ${this.state.nowItem <= 0 ? 'hui' : ''}`}
							onClick={this.leftArrow.bind(this)}
						/>
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
								width: `${this.controlArrow ? '20000px' : '994px'}`,
								transform: `translateX(${this.state.translateX}px)`,
								transition: `-webkit-transform ${this.state.animationTime}ms ease 0s`
							}}
						>
							{this.createTable()}
						</ul>
					</div>
					{this.controlArrow ? (
						<div
							className={`iconfont icon-gengduo right ${this.state.nowItem >= this.amountNum
								? 'hui'
								: ''}`}
							onClick={this.rightArrow.bind(this)}
						/>
					) : (
						''
					)}
				</div>
			</div>
		) : (
			''
		) : (
			''
		);
	}
}

export default Thumbnails;
