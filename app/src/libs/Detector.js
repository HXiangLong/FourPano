/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

export default class Detector {
	constructor() {
		this.detector = {
			canvas: !!window.CanvasRenderingContext2D,
			webgl: (function () {

				try {

					var canvas = document.createElement('canvas');
					return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));

				} catch (e) {

					return false;

				}

			})(),
			workers: !!window.Worker,
			fileapi: window.File && window.FileReader && window.FileList && window.Blob
		}
	}

	getWebGLErrorMessage() {

		var element = document.createElement('div');
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = window.innerWidth;
		element.style.margin = '5em auto 0';

		if (!this.webgl) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'您的显卡似乎不支持 <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'了解详情，请点击 <a href="http://get.webgl.org/" style="color:#000">这里</a>.'
			].join('\n') : [
				'<div class="failure" style="display: block;"> <i></i><p>您当前浏览器不支持WebGL全景浏览，请更换IE11以上、chrome55以上、firefox30以上版本浏览器进行查看。</p><p><a href="http://sw.bos.baidu.com/sw-search-sp/software/5fdb87edfe7cb/ChromeStandalone_60.0.3112.113_Setup.exe">点击下载chrome</a></p></div>'
			].join('\n');

		}

		return element;

	}

	addGetWebGLMessage(parameters) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = this.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild(element);

	}

}