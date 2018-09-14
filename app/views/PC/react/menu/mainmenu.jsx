/**界面下方主菜单 */
import React, { Component } from 'react';
import './MainMenu.pcss';

class MainMenu extends Component {
	constructor() {
		super();
	}

	/**显示简介界面 */
	showIntroduction() {
		this.props.IntroductionState({
			off: true
		});
		this.props.closeThumbnails();
	}

	/**显示展厅列表 */
	showThumbnails() {
		this.props.OpenThumbnails ? this.props.closeThumbnails() : this.props.showThumbnails();
	}

	/**显示文物界面 */
	showHotPhotoWall(){
		this.props.closeThumbnails();
		this.props.showHotPhotoWall({
			off: true
		});
	}

	showPanoMap(){
		
		this.props.showPanoMap({
			off:!this.props.openPanoMapOff
		});
	}

	render() {
		return (
			<div className="mainmenu" url="">
				<ul>
					<li className="exhibithall" title="展厅" onClick={this.showThumbnails.bind(this)}>
						<i />
						<p>展厅</p>
					</li>
					<li className="summary" title="简介" onClick={this.showIntroduction.bind(this)}>
						<i />
						<p>简介</p>
					</li>
					<li className="collect" title="文物" onClick={this.showHotPhotoWall.bind(this)}>
						<i />
						<p>文物</p>
					</li>
					<li className="measure" title="测量">
						<i />
						<p>测量</p>
					</li>
					<li className="roam" title="漫游">
						<i />
						<p>漫游</p>
					</li>
					<li className="map" title="地图" onClick={this.showPanoMap.bind(this)}>
						<i />
						<p>地图</p>
					</li>
					<li className="school" title="学堂">
						<i />
						<p>学堂</p>
					</li>
					<li className="links" title="链接">
						<i />
						<p>链接</p>
					</li>
				</ul>
			</div>
		);
	}
}

export default MainMenu;
