/**查看大图界面 */

import React, { Component } from 'react';
import './ViewPicture.pcss';

class ViewPicture extends Component {
	constructor(props) {
		super(props);

		this.imgDeg = 0; // 图片旋转的角度
		this.minZoom = 0.5; //最小缩放值
		this.maxZoom = 3; //最大缩放值
		this.zoomNum = 0.2; //每次缩放值
		this.imgScale = 0.5; // 图片缩放的比例
		this.dragDrop = false; // 图片是否被拖动中
		this.apartX = 0; // 鼠标在图片中与图片左上角的X轴的距离
		this.apartY = 0; //鼠标在图片中与图片左上角的Y轴的距离
		this.top = 0;
		this.left = 0;

		this.state = {
            touchORmouse:('ontouchstart' in window),//是否是触屏
			off: true,
			title: '查看大图界面',
			imgs: this.props.imgs,
			page: 1,
			imgStyle: {
				transform: `rotate(${this.imgDeg}deg) translate3d(${this.top}px, ${this.left}px, 0px) scale(${this
					.imgScale})`,
				display: 'inline-block'
			}
		};
	}

	/** 关闭界面*/
	closeViewPicture() {
		this.setState({
			off: false
		});
	}

	/**图像滚轮事件 */
	mouseWheelRotateImg(event) {
		event.preventDefault();
		event.stopPropagation();

		if (event.deltaY > 0) {
			this.minusRotateImg();
		} else {
			this.plusRotateImg();
		}
	}

	/**放大图像 */
	plusRotateImg() {
		this.imgScale = this.imgScale + this.zoomNum;
		this.imgScale = this.imgScale >= this.maxZoom ? this.maxZoom : this.imgScale;
		this.setState({
			imgStyle: { transform: `rotate(${this.imgDeg}deg) scale(${this.imgScale})` }
		});
	}

	/**缩小图像 */
	minusRotateImg() {
		this.imgScale = this.imgScale - this.zoomNum;
		this.imgScale = this.imgScale <= this.minZoom ? this.minZoom : this.imgScale;
		this.setState({
			imgStyle: { transform: `rotate(${this.imgDeg}deg) scale(${this.imgScale})` }
		});
	}

	/**逆时针旋转 */
	leftToRotateImg() {
		this.imgDeg = this.imgDeg - 90;
		if (this.imgDeg < -360) {
			this.imgDeg = -90;
		}
		this.setState({
			imgStyle: { transform: `rotate(${this.imgDeg}deg) scale(${this.imgScale})` }
		});
	}

	/**顺时针旋转 */
	rightToRotateImg() {
		this.imgDeg = this.imgDeg + 90;
		if (this.imgDeg > 360) {
			this.imgDeg = 90;
		}
		this.setState({
			imgStyle: { transform: `rotate(${this.imgDeg}deg) scale(${this.imgScale})` }
		});
	}

	/**鼠标按下 */
	_mouseDown(event) {
        event.preventDefault();
        event.stopPropagation();

		this.dragDrop = true;

		const imgWrap = this.refs.showPreviewImageWrap;
		this.apartX = event.pageX - imgWrap.offsetLeft; // 鼠标在图片中与图片左上角的X轴的距离
		this.apartY = event.pageY - imgWrap.offsetTop;
	}

	/**鼠标弹起 */
	_mouseUp(event) {
        event.preventDefault();
        event.stopPropagation();

		this.dragDrop = false;
	}

	/**鼠标移动 */
	_mouseMove(event) {
        event.preventDefault();
        event.stopPropagation();
		
		if (!this.dragDrop) {
			return;
		}

		const imgWrap = this.refs.showPreviewImageWrap;
		imgWrap.style.left = event.pageX - this.apartX + 'px';
		imgWrap.style.top = event.pageY - this.apartY + 'px';
    }
    
    _touchDown(){

    }

    _touchUp(){
        
    }

    _touchMove(){
        
    }

	render() {
		return this.state.off ? (
			<div className="ViewPicture">
				<div className="iconfont icon-guanbi closeIcon" onClick={this.closeViewPicture.bind(this)} />
				<div className="titleName">{this.state.title}</div>
				<div className="imageShow">
					{this.state.touchORmouse ?
					<img
						ref="showPreviewImageWrap"
						src={this.state.imgs[this.state.page - 1]}
						style={this.state.imgStyle}
						onTouchEnd={this._touchUp.bind(this)}
						onTouchStart={this._touchDown.bind(this)}
						onTouchMove={this._touchMove.bind(this)}
					/>:<img
						ref="showPreviewImageWrap"
						src={this.state.imgs[this.state.page - 1]}
						style={this.state.imgStyle}
						onWheel={this.mouseWheelRotateImg.bind(this)}
						onMouseUp={this._mouseUp.bind(this)}
						onMouseDown={this._mouseDown.bind(this)}
						onMouseMove={this._mouseMove.bind(this)}
					/>}
				</div>
				<div className="pageNum">
					<span>{this.state.page}</span>/<span>{this.state.imgs.length}</span>
				</div>
				<div className="operating">
					<ul>
						<li className="iconfont icon-suoxiao" title="缩小" onClick={this.minusRotateImg.bind(this)} />
						<li className="iconfont icon-fangda" title="放大" onClick={this.plusRotateImg.bind(this)} />
						<li className="iconfont icon-zuozhuan-" title="左旋" onClick={this.leftToRotateImg.bind(this)} />
						<li className="iconfont icon-youzhuan-" title="右旋" onClick={this.rightToRotateImg.bind(this)} />
						<li className="iconfont icon-zuo1" title="上一张" onClick={this.minusRotateImg.bind(this)} />
						<li className="iconfont icon-you" title="下一张" onClick={this.minusRotateImg.bind(this)} />
					</ul>
				</div>
			</div>
		) : (
			''
		);
	}
}

export default ViewPicture;
