/**展厅列表 */
import React, { Component } from 'react';
import './PThumbnails.css';
import PExhiblistBox from '../exhiblistBox';
import Slider from 'react-slick';
import * as constants from '../../../../src/tool/SWConstants';
import { jumpSite } from '../../../../src/tool/SWInitializeInstance';
const external = require('../../../../src/tool/SWExternalConst.js');

class PThumbnails extends Component {
	constructor() {
		super();
		this.slider;
		this.gotoindex = 0;
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
				let boo =
					item.displayPriority == 1 ? exhibID == item.floorID : item.panoID == constants.c_StationInfo.panoID;
				table.push(
					<PExhiblistBox
						key={`thumbnails${idx}`}
						active={boo} //另一种极端情况 把当前楼层（展厅）的所有站点列举出来了，这个时候就要对应Thumbnail的DisplayPriority，当DisplayPriority=2时
						getPhotoWall={this.itemOnClick.bind(this)}
						markerID={item.panoID}
						name={item.name}
						sanwei={false}
						imgUrl={`${constants.sw_getService.resourcesUrl}/${item.filePath}`}
					/>
				);
				if (boo) {
					this.gotoindex = idx;
				}
			}
		});
		return table;
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
		return external.server_json.features.exhibithall ? this.props.off ? (
			<div className="PThumbnailsBox">
				<div className="exhiblistItem">
					<Slider
						ref={(slider) => {
							slider && slider.slickGoTo(this.gotoindex);
						}}
						{...settings}
					>
						{this.createTable()}
					</Slider>
				</div>
			</div>
		) : (
			''
		):"";
	}
}

export default PThumbnails;
