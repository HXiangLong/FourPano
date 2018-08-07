/**头部菜单 */

import React, {Component} from 'react';
import './Header.pcss';
import ShareButtons from '../share'

class Header extends Component {
    constructor() {
        super();
        this.state = {
            musicOff: true
        };
    }

    render() {
        return <div className="header">
            <ul className="quickmenu">
                <li className="share jiathis_style_24x24">
                    <i></i>
                    <span>分享</span>
                    <ShareButtons 
                        sites = {["weibo","qzone", "qq", "douban", "wechat"]}
                        title = "全景"
                        description = "一键分享到各大社交网站的react组件"
                    />
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