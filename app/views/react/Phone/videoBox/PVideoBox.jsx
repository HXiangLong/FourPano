/**视频播放界面*/
import React, { Component } from 'react';
import * as constants from '../../../../src/tool/SWConstants';

class PVideoBox extends Component {
	constructor() {
		super();
		this.myVideoRef = React.createRef();
    }

	closeVideoBoxs() {
		this.props.closeVideoBox({
			off: false
		});

		let vboo = false;

		constants.c_smallVideoArr.forEach((obj) => {
			if (obj.panoID == constants.c_StationInfo.panoID) {
				vboo = true;

				obj.playVideo();
			}
		});

		if (!vboo) {
			this.props.open_close_Audio({
				bgMusicOff: true
			});
		}
	}

	render() {
		if (this.props.off) {
			this.props.open_close_Audio({
				bgMusicOff: false
			});
		}

		const videoNode = this.myVideoRef.current;
		if (videoNode) {
			if (this.props.videoOff) {
				videoNode.play();
			} else {
				videoNode.pause();
			}
		}

		return this.props.off ? (
			<div className="videos">
				<div className="UIBG" onClick={this.closeVideoBoxs.bind(this)} />
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeVideoBoxs.bind(this)} />
				{/* <div className="videobox"> */}
				<video
					ref={this.myVideoRef}
					src={`${constants.sw_getService.resourcesUrl}/BusinessData/ExhibitDetails/Video/${this.props
						.videoUrl}`}
					autoPlay="autoPlay"
					controls="true"
					controlsList="nodownload"
				/>
				{/* </div> */}
			</div>
		) : (
			''
		);
	}
}
export default PVideoBox;