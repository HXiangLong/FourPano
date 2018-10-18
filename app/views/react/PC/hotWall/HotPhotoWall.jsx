/**热点文物墙 */
import React, { Component } from 'react';
import Exhiblistbox from '../exhiblistBox';
import * as constants from '../../../../src/tool/SWConstants';
import { jumpSite,JumpLookMarker } from '../../../../src/tool/SWInitializeInstance';
import './HotPhotoWall.css';

class HotPhotoWall extends Component {
	constructor() {
		super();
		this.state = {
			allPage: 1, //所有页数

			nowItem: 1, //第几页

			slidesToShow: 1, //每次动几个

			translateX: 0, //移动像素值

			animationTime: 500 //动画时间
		};

		this.amountNum = 0; //可以动弹的数量

		this.interval = -800; //间隔

		this.pageArr = [];
	}

	closeHotPhotoWall() {
		this.props.closeHotPhotoWall();
	}

	componentWillUpdate() {
		if (this.pageArr.length == 0 && constants.c_StationInfo) {
			let showArr = [];

			let buildingArr = constants.c_allExhibitsForBuildingTable.getValues();

			let panoID = constants.c_StationInfo.panoID.split('-')[0];

			buildingArr.forEach((item) => {
				if (this.props.allShow) {
					showArr.push(item);
				} else {
					if (item.panoID.split('-')[0] == panoID) {
						showArr.push(item);
					}
				}
			});

			let allpage = parseInt(showArr.length / 12) + (parseInt(showArr.length % 12) == 0 ? 0 : 1);

			for (let i = 0; i < allpage; i++) {
				this.pageArr.push(showArr.slice(i * 12, (i + 1) * 12));
			}

			this.setState({
				allPage: allpage
			});
		}
	}

	leftArrow() {
		let num = this.state.nowItem - 1;
		num = num < 1 ? 1 : num;
		this.setState({
			nowItem: num,
			translateX: (num - 1) * this.interval
		});
	}

	rightArrow() {
		let num = this.state.nowItem + 1;
		num = num >= this.state.allPage ? this.state.allPage : num;
		this.setState({
			nowItem: num,
			translateX: (num - 1) * this.interval
		});
	}

	itemOnClick(markerArr) {
        this.closeHotPhotoWall();
        let obj = constants.c_allExhibitsForBuildingTable.getValue(markerArr[0]);
        if (obj.panoID == constants.c_StationInfo.panoID) { //在当前站点的文物
            constants.c_markerInfoArr.forEach((objs) =>{
                if (markerArr.indexOf(objs.markerID) != -1 && objs.markerID == markerArr[0]) {
                    JumpLookMarker(objs);
                }
            });
        } else { //非当前站点，需要先跳转到指定站点，然后再转向
            jumpSite(obj.panoID);
            constants.c_JumpMarkerID = markerArr[0];
        }
    }

	createTable() {
		let table = [];
		this.pageArr.map((itemArr,idx) => {
			table.push(
				<div className="item" key={`HotPhotoWall${idx}`}>
					<ul>
						{itemArr.map((items,index) => {
							return (
								<Exhiblistbox
									key={`HotPhotoWallExhiblistbox${index}`}
									active={false}
									getPhotoWall={this.itemOnClick.bind(this)}
									markerID={items.markerID}
									name={items.name}
									sanwei={items.have3D}
									imgUrl={`${constants.sw_getService.resourcesUrl}/${items.filePath}`}
								/>
							);
						})}
					</ul>
				</div>
			);
		});

		return table;
	}

	render() {
		return this.props.off ? (
			<div className="HotPhotoWall">
				<div className="UIBG" onClick={this.closeHotPhotoWall.bind(this)} />
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeHotPhotoWall.bind(this)} />
				<div className="iconfont icon-zuo left" onClick={this.leftArrow.bind(this)} />
				<div className="wwlistbox">
					<div className="wwlist"
						style={{
							transform: `translateX(${this.state.translateX}px)`,
							transition: `-webkit-transform ${this.state.animationTime}ms ease 0s`
						}}
					>
						{this.createTable()}
					</div>
				</div>
				<div className="num">
					<span className="current">{this.state.nowItem}</span>/
					<span className="count">{this.state.allPage}</span>
				</div>
				<div className="iconfont icon-gengduo right" onClick={this.rightArrow.bind(this)} />
			</div>
		) : (
			''
		);
	}
}

export default HotPhotoWall;
