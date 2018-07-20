/**头部菜单 */

import React, {Component} from 'react';
import './Header.pcss'

class Header extends Component {
    constructor() {
        super();
        this.state = {
            musicOff: true
        };
        this.addShare = this.addShare.bind(this);
    }

    addShare(){
        let $config1 = {
            url: window.location.href, // 网址，默认使用 window.location.href
            site: 'http://www.cncis.com.cn/', // 来源（QQ空间会用到）, 默认读取head标签：<meta name="site" content="http://overtrue" />
            title: document.title, // 标题，默认读取 document.title
            description: '中国共产党是按照马克思列宁主义建党思想建立的具有严格纪律的无产阶级政党。在近百年领导中国人民进行革命、建设、改革的伟大实践中， 中国共产党始终坚持从严治党理念，把加强纪律作为自身建设伟大工程的重要组成部分，常抓不懈，不断取得新的成就。', // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
            iamge: '', // 图片, 默认取网页中第一个img标签
            sites: ['qzone', 'qq', 'weibo', 'wechat'], // 启用的站点
            disabled: ['douban', 'google', 'facebook', 'twitter'], // 禁用的站点
            wechatQrcodeTitle: "微信扫一扫：分享", // 微信二维码提示文字
            wechatQrcodeHelper: '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>',
            target: '_blank' //打开方式
        };

        $('.social-share').share($config1);
    }

    render() {
        return <div className="header">
            <ul className="quickmenu">
                <li className="share jiathis_style_24x24">
                    <i></i>
                    <span>分享</span>
                    <div className="social-share" data-wechat-qrcode-title="请打开微信扫一扫"></div>
                </li>
                <li className="BGMusic" title="关闭音乐">
                    <i></i>
                    <span>音频</span>
                    <audio src="../../../../commons/img/backmusic.mp3" id="backaudio" autoPlay="autoplay" loop="loop"></audio>
                </li>
                <li className="help">
                    <i></i>
                    <span>帮助</span>
                </li>
                <li className="setup">
                    <i></i>
                    <span>设置</span>
                </li>
            </ul>
        </div>

    }
}

export default Header;