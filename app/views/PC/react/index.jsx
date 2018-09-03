/**初始化react,所有组件在这里集合 */

import React, { Component } from 'react';
import './index.pcss';
import '../../common_img/font_icon/iconfont.css';
import Header from './header';
import Help from './help';
import MapTipBox from './mapTip';
import MainMenu from './menu';
import Loading from './load';
import OpenIframe from './iframe';
import IntroductionSimple from './Introduction';
import ViewPicture from './viewPicture';

const helpImgs = [
	require('../../../commons/img/help/help1.png'), //操作
	require('../../../commons/img/help/help2.png'), //操作
	require('../../../commons/img/help/help3.png'), //展厅
	require('../../../commons/img/help/help4.png'), //简介
	require('../../../commons/img/help/help5.png'), //文物
	require('../../../commons/img/help/help6.png'), //测量
	require('../../../commons/img/help/help7.png'), //漫游
	require('../../../commons/img/help/help8.png') //地图
];

class Index extends Component {
	render() {
		return (
			<div className="reactApp">
				<Header />
				<MainMenu />
				<Help helpList={helpImgs} />
				<MapTipBox />
				<Loading />
				<OpenIframe />
				<IntroductionSimple />
				<ViewPicture imgs={helpImgs} />
			</div>
		);
	}
}

export default Index;
