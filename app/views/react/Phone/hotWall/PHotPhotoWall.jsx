/** */
import React, { Component } from 'react';
import Slider from 'react-slick';
import './PHotPhotoWall.css';
import PExhiblistbox from '../exhiblistBox';
import * as constants from '../../../../src/tool/SWConstants';
import { jumpSite, JumpLookMarker } from '../../../../src/tool/SWInitializeInstance';

class PHotPhotoWall extends Component {
	constructor() {
		super();
		this.pageArr = [];
		this.lastStop = 1;
		this.exhibID;
		this.slider;
	}

	closeHotPhotoWall() {
		this.props.closeHotPhotoWall();
	}

	createTable() {
		
		if(!constants.c_StationInfo) return;

		let mapmarker = constants.c_panoIDTable.getValue(constants.c_StationInfo.panoID);

		if (this.exhibID != mapmarker.rasterMapID) {
			this.pageArr.length = 0;

			this.exhibID = mapmarker.rasterMapID;

			this.lastStop = 0;
		}

		if (this.pageArr.length == 0) {
			let buildingArr = constants.c_allExhibitsForBuildingTable.getValues();

			buildingArr.forEach((item) => {
				if (constants.c_collectAll) {
					this.pageArr.push(item);
				} else {
					if (item.floorID == this.exhibID) {
						this.pageArr.push(item);
					}
				}
			});
		}

		let table = [];
		this.pageArr.map((items, idx) => {
			table.push(
				<PExhiblistbox
					key={`HotPhotoWallExhiblistbox${idx}`}
					active={false}
					getPhotoWall={this.itemOnClick.bind(this)}
					markerID={items.markerID}
					name={items.name}
					sanwei={items.have3D}
					imgUrl={`${constants.sw_getService.resourcesUrl}/${items.filePath}`}
				/>
			);
		});
		return table;
	}

	itemOnClick(markerArr) {
		this.closeHotPhotoWall();
		let obj = constants.c_allExhibitsForBuildingTable.getValue(markerArr[0]);
		if (obj.panoID == constants.c_StationInfo.panoID) {
			//在当前站点的文物
			constants.c_markerInfoArr.forEach((objs) => {
				if (markerArr.indexOf(objs.markerID) != -1 && objs.markerID == markerArr[0]) {
					JumpLookMarker(objs);
				}
			});
		} else {
			//非当前站点，需要先跳转到指定站点，然后再转向
			jumpSite(obj.panoID);
			constants.c_JumpMarkerID = markerArr[0];
		}
	}

	render() {
		const settings = {
			arrows: false,
			dots: false,
			infinite: false,
			lazyLoad: true,
			speed: 500,
			slidesToShow: 6,
			slidesToScroll: 6,
			afterChange: (index) => {
				this.lastStop = index;
			},
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 5,
						slidesToScroll: 5
					}
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4
					}
				},
				{
					breakpoint: 425,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3
					}
				},
				{
					breakpoint: 320,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 150,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		};
		return this.props.off ? (
			<div className="PHotPhotoWall">
				<div className="Pwwlistbox">
					<Slider ref={(slider) => slider && slider.slickGoTo(this.lastStop)} {...settings}>
						{this.createTable()}
					</Slider>
				</div>
			</div>
		) : (
			''
		);
	}
}
export default PHotPhotoWall;
