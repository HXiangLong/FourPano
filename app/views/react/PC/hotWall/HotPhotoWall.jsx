/**热点文物墙 */
import React, { Component } from 'react';
import Exhiblistbox from '../exhiblistBox';
import * as constants from '../../../../src/tool/SWConstants';
import { jumpSite, JumpLookMarker } from '../../../../src/tool/SWInitializeInstance';
import './HotPhotoWall.css';

class HotPhotoWall extends Component {
	constructor() {
		super();
		this.state = {
			content: '',

			judgeName: '',

			slidesToShow: 1, //每次动几个

			translateX: 0, //移动像素值

			animationTime: 500 //动画时间
		};

		this.amountNum = 0; //可以动弹的数量

		this.interval = -800; //间隔

		this.pageArr = [];

		this.tableudateBoo = false; //是否可以更新列表

		this.nowItem = 1; //第几页

		this.allPageNum = 1; //总页数

		this.inputRef = React.createRef();
	}

	/**关闭界面 */
	closeHotPhotoWall() {
		this.props.closeHotPhotoWall();
	}

	/**列表更新 */
	tableUpdate() {
		if ((this.pageArr.length == 0 && constants.c_StationInfo) || this.tableudateBoo) {
			let showArr = [];
			this.pageArr = [];
			this.tableudateBoo = false;

			let buildingArr = constants.c_allExhibitsForBuildingTable.getValues();

			let panoID = constants.c_StationInfo.panoID.split('-')[0];

			buildingArr.forEach((item) => {
				if (this.fuzzyQuery(item.name, this.state.judgeName)) {
					if (this.props.allShow) {
						showArr.push(item);
					} else {
						if (item.panoID.split('-')[0] == panoID) {
							showArr.push(item);
						}
					}
				}
			});

			this.allPageNum =
				showArr.length == 0 ? 1 : parseInt(showArr.length / 12) + (parseInt(showArr.length % 12) == 0 ? 0 : 1);

			for (let i = 0; i < this.allPageNum; i++) {
				this.pageArr.push(showArr.slice(i * 12, (i + 1) * 12));
			}
		}
	}

	/**
	 * 模糊查询
	 * @param {*} namestr 查询语句
	 * @param {*} keyWord 关键字
	 */
	fuzzyQuery(namestr, keyWord) {
		var reg = new RegExp(keyWord);
		if (reg.test(namestr)) {
			return true;
		}
		return false;
	}

	/**左箭头 */
	leftArrow() {
		let num = this.nowItem - 1;
		num = num < 1 ? 1 : num;
		this.setState({
			translateX: (num - 1) * this.interval
		});
		this.nowItem = num;
	}

	/**右箭头 */
	rightArrow() {
		let num = this.nowItem + 1;
		num = num >= this.allPageNum ? this.allPageNum : num;
		this.setState({
			translateX: (num - 1) * this.interval
		});
		this.nowItem = num;
	}

	/**文物跳转 */
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

	/**点击搜索 */
	handleSubmit() {
		this.tableudateBoo = this.inputRef.current.value != this.state.judgeName;

		this.nowItem = 1;

		this.setState({
			judgeName: this.inputRef.current.value,
			translateX: 0
		});

		this.inputRef.current.value = '';
	}

	/**创建列表 */
	createTable() {
		this.tableUpdate();

		let table = [];
		this.pageArr.map((itemArr, idx) => {
			table.push(
				<div className="item" key={`HotPhotoWall${idx}`}>
					<ul>
						{itemArr.map((items, index) => {
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
				<div className="wallBox">
					<div className="HotPhotoSearch">
						<input className="form_input" ref={this.inputRef} type="text" placeholder="请输入文物名称" />
						<i className="SearchButton" onClick={this.handleSubmit.bind(this)} />
					</div>

					<div
						className={`iconfont icon-zuo left ${this.nowItem <= 1 ? 'hui' : ''}`}
						onClick={this.leftArrow.bind(this)}
					/>
					<div className="wwlistbox">
						<div
							className="wwlist"
							style={{
								transform: `translateX(${this.state.translateX}px)`,
								transition: `-webkit-transform ${this.state.animationTime}ms ease 0s`
							}}
						>
							{this.createTable()}
						</div>
					</div>
					<div className="num">
						<span className="current">{this.nowItem}</span>/
						<span className="count">{this.allPageNum}</span>
					</div>
					<div
						className={`iconfont icon-gengduo right ${this.nowItem >= this.allPageNum ? 'hui' : ''}`}
						onClick={this.rightArrow.bind(this)}
					/>
				</div>
			</div>
		) : (
			''
		);
	}
}

export default HotPhotoWall;
