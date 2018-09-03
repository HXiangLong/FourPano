/**界面下方主菜单 */
import React, { Component } from 'react';
import './MainMenu.pcss';

class MainMenu extends Component {
	constructor() {
        super();

        this.showIntroduction = this.showIntroduction.bind(this);
    }

    showIntroduction(){
        this.props.IntroductionState({
            off:true
        });
    }

	render() {
		return (
			<div className="mainmenu" url=''>
				<ul>
					<li className="exhibithall" title="展厅">
						<i />
						<p>展厅</p>
					</li>
					<li className="summary" title="简介" onClick={this.showIntroduction}>
						<i />
						<p>简介</p>
					</li>
					<li className="collect" title="文物">
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
					<li className="map" title="地图">
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
