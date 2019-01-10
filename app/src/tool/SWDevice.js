/**检测苹果CPU */
class SWDevice {
    constructor() {
        this.canvas;
        this.gl;
        this.glRenderer;
        this.models;
        this.devices = {
            "Apple A7 GPU": {
                1136: ["iPhone 5", "iPhone 5s"],
                2048: ["iPad Air", "iPad Mini 2", "iPad Mini 3"]
            },

            "Apple A8 GPU": {
                1136: ["iPod touch (6th generation)"],
                1334: ["iPhone 6"],
                2001: ["iPhone 6 Plus"],
                2048: ["iPad Air 2", "iPad Mini 4"]
            },

            "Apple A9 GPU": {
                1136: ["iPhone SE"],
                1334: ["iPhone 6s"],
                2001: ["iPhone 6s Plus"],
                2224: ["iPad Pro (9.7-inch)"],
                2732: ["iPad Pro (12.9-inch)"]
            },

            "Apple A10 GPU": {
                1334: ["iPhone 7"],
                2001: ["iPhone 7 Plus"]
            }
        };
    }
    getCanvas() {
        if (this.canvas == null) {
            this.canvas = document.createElement('canvas');
        }

        return this.canvas;
    }

    getGl() {
        if (this.gl == null) {
            this.gl = this.getCanvas().getContext('experimental-webgl');
        }

        return this.gl;
    }

    getScreenWidth() {
        return Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1);
    }

    /**获得手机GPU */
    getGlRenderer() {
        if (this.glRenderer == null) {
            let debugInfo = this.getGl().getExtension('WEBGL_debug_renderer_info');
            this.glRenderer = debugInfo == null ? 'unknown' : this.getGl().getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }

        return this.glRenderer;
    }

    /**根据GUP获取手机型号 */
    getModels() {
        if (this.models == null) {
            let device = this.devices[this.getGlRenderer()];

            if (device == undefined) {
                this.models = ['unknown'];
            } else {
                this.models = device[this.getScreenWidth()];

                if (this.models == undefined) {
                    this.models = ['unknown'];
                }
            }
        }

        return this.models;
    }

    /**获取ios系统版本号 */
    get_ios_version() {
        let ua = navigator.userAgent.toLowerCase();
        let version = null;
        if (ua.indexOf("like mac os x") > 0) {
            let reg = /os [\d._]+/gi;
            let v_info = ua.match(reg);
            version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号9.3.2或者9.0
            version = parseInt(version.split('.')[0]); // 得到版本号第一位
        }

        return version;
    }

    /**获取安卓系统版本号 */
    get_android_version() {
        let ua = navigator.userAgent.toLowerCase();
        let version = null;
        if (ua.indexOf("android") > 0) {
            let reg = /android [\d._]+/gi;
            let v_info = ua.match(reg);
            version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号4.2.2
            version = parseInt(version.split('.')[0]); // 得到版本号第一位
        }

        return version;
    }

    /**
     * 微信微博QQ
     */
    getBrowser() {
        let weixinQQWeibo = false;
        let browser = {
            versions: function () {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return { //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        };


        if (browser.versions.mobile) { //判断是否是移动设备打开。browser代码在下面
            let ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                //在微信中打开
                weixinQQWeibo = true;
            }
            if (ua.match(/WeiBo/i) == "weibo") {
                //在新浪微博客户端打开
                weixinQQWeibo = true;
            }
            if (ua.match(/QQ/i) == "qq") {
                //在QQ空间打开
                weixinQQWeibo = true;
            }
        }
        return weixinQQWeibo;
    }

}
export default SWDevice;