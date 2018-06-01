/**
 * 文字字体
 */
class SWDrawFont {
    constructor() {}

    /**
     * 获取字体
     * @param {string} fontUrl 字体地址 '../../../commons/font/optimer_regular.typeface.json'
     * @param {Function} callFun 回调函数
     */
    getFont(fontUrl, callFun) {
        let loader = new THREE.FontLoader();
        loader.load(fontUrl, (response) => {
            callFun(response);
        });
    }
}

export default SWDrawFont;