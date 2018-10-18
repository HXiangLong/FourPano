/**查看大图界面 */

import React, { Component } from 'react';
import ReactImageLightbox from './react-image-lightbox';
import './ViewPicture.css';

class ViewPicture extends Component {
	static onImageLoadError(imageSrc, _srcType, errorEvent) {
		console.error(`Could not load image at ${imageSrc}`, errorEvent); // eslint-disable-line no-console
	}

	constructor() {
		super();
		this.state = {
			index: 0
		};

		this.closeViewPicture = this.closeViewPicture.bind(this);
		this.nextImage = this.nextImage.bind(this);
		this.previousImage = this.previousImage.bind(this);
	}

	/** 关闭界面*/
	closeViewPicture() {
		this.props.closeViewPicture({
			off: false
		});
	}

	/**上一张 */
	previousImage() {
		this.setState({
			index: (this.state.index + this.props.imageList.length - 1) % this.props.imageList.length
		});
	}

	/**下一张 */
	nextImage() {
		this.setState({ index: (this.state.index + 1) % this.props.imageList.length });
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			index: nextProps.idx
		});
	}

	lightbox() {
		return (
			<ReactImageLightbox
				mainSrc={this.props.imageList[this.state.index]}
				nextSrc={this.props.imageList[(this.state.index + 1) % this.props.imageList.length]}
				prevSrc={
					this.props.imageList[
						(this.state.index + this.props.imageList.length - 1) % this.props.imageList.length
					]
				}
				mainSrcThumbnail={this.props.thumbs[this.state.index]}
				nextSrcThumbnail={this.props.thumbs[(this.state.index + 1) % this.props.imageList.length]}
				prevSrcThumbnail={
					this.props.thumbs[
						(this.state.index + this.props.imageList.length - 1) % this.props.imageList.length
					]
				}
				onCloseRequest={this.closeViewPicture}
				onMovePrevRequest={this.previousImage}
				onMoveNextRequest={this.nextImage}
				onImageLoadError={ViewPicture.onImageLoadError}
				imageTitle={this.props.titles[this.state.index]}
				imageCaption={this.props.captions[this.state.index]}
				page={this.state.index}
				allpage={this.props.imageList.length}
			/>
		);
	}

	render() {
		return this.props.off ? <div className="ViewPicture">{this.lightbox()}</div> : '';
	}
}

export default ViewPicture;
