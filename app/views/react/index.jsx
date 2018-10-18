/**初始化react,所有组件在这里集合 */

import React, { Component } from 'react';
import './index.css';
import '../common_img/font_icon/iconfont.css';
//PC版
import Header from './PC/header';
import Help from './PC/help';
import MapTipBox from './PC/mapTip';
import MainMenu from './PC/menu';
import Loading from './PC/load';
import OpenIframe from './PC/iframe';
import IntroductionSimple from './PC/Introduction';
import ViewPicture from './PC/viewPicture';
import Thumbnails from './PC/thumbnails';
import HotPhotoWall from './PC/hotWall';
import PanoMap from './PC/map';
import MarkerInterface from './PC/markerInterface';
import ReviewInput from './PC/review';
import VideoBox from './PC/videoBox';
import VideoPeople from './PC/videoBox/VideoPeople';
import OtherLinks from './PC/links';
import RoamingBox from './PC/roaming';
import SettingBox from './PC/setting';
//手机版
import PBottom from './Phone/bottom';
import PHotPhotoWall from './Phone/hotWall';
import POpenIframe from './Phone/iframe';
import PIntroductionSimple from './Phone/Introduction';
import PLoading from './Phone/load';
import PPanoMap from './Phone/map';
import PMarkerInterface from './Phone/markerInterface';
import PRight from './Phone/right';
import PSettingBox from './Phone/setting';
import PThumbnails from './Phone/thumbnails';
import PVideoBox from './Phone/videoBox';

class Index extends Component {
	render() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (//手机版UI界面
			<div className="reactApp">
				<PBottom />
				<PRight />
				<PIntroductionSimple />
				{/* <PHotPhotoWall />
				<POpenIframe />
				
				<PLoading />
				<PPanoMap />
				<PMarkerInterface />
				<PSettingBox />
				<PThumbnails />
				<PVideoBox /> */}
			</div>
		) : (//PC版UI界面
			<div className="reactApp">
				<Header />
				<MainMenu />
				<Help />
				<MapTipBox />
				<Loading />
				<OpenIframe />
				<IntroductionSimple />
				<ViewPicture />
				<Thumbnails />
				<HotPhotoWall />
				<PanoMap />
				<MarkerInterface />
				<ReviewInput />
				<VideoBox />
				<VideoPeople />
				<OtherLinks />
				<RoamingBox />
				<SettingBox />
			</div>
		);
	}
}

export default Index;
