/**小地图提示界面 */
import React, { Component } from 'react';
import './MapTipBox.pcss';

const markingImgArr = [
	require('../../../../commons/img/lv.png'),
	require('../../../../commons/img/lan.png'),
	require('../../../../commons/img/hong.png'),
	require('../../../../commons/img/zi.png'),
	require('../../../../commons/img/huang.png'),
	require('../../../../commons/img/sb.png')
];

class MapTipBox extends Component {
	constructor() {
		super();
	}

	closeMapTip(){
		this.props.closeMapTip();
	}

	render() {
		return this.props.openMapTip?(
			<div className="maptip">
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeMapTip.bind(this)} />
				<div className="UIBG" onClick={this.closeMapTip.bind(this)}/>
				<div className="maptipbox">
					<ul>
						<li>
							<i>
								<img src={markingImgArr[0]} />
							</i>
							<span>过渡站点</span>
						</li>
						<li>
							<i>
								<img src={markingImgArr[1]} />
							</i>
							<span>天空站点</span>
						</li>
						<li>
							<i>
								<img src={markingImgArr[2]} />
							</i>
							<span>文物、视频站点</span>
						</li>
						<li>
							<i>
								<img src={markingImgArr[3]} />
							</i>
							<span>讲解视频站点</span>
						</li>
						<li>
							<i>
								<img src={markingImgArr[4]} />
							</i>
							<span>多点聚集站点</span>
						</li>
						<li>
							<i>
								<img src={markingImgArr[5]} />
							</i>
							<span>左键按下拖拽、中键滚轮缩放</span>
						</li>
					</ul>
				</div>
			</div>
		):"";
	}
}

export default MapTipBox;
