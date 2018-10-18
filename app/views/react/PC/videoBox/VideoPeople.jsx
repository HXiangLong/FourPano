/**人物讲解需要的 */
import React, { Component } from 'react';
import './Video.css';

class VideoPeople extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div id="videosBox" style={{display:"none"}}>
				{/* <video
					id="obj.videoName"
					style={{
						display: none
					}}
				>
					<source src="" type="video/webm;" codecs="vp8,vorbis" />
				</video> */}
			</div>
		);
	}
}

export default VideoPeople;
