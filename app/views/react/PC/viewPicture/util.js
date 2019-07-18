/**
 * 占位符用于将来的翻译功能
 */
export function translate(str, replaceStrings = null) {
    if (!str) {
        return '';
    }

    let translated = str;
    if (replaceStrings) {
        Object.keys(replaceStrings).forEach(placeholder => {
            translated = translated.replace(placeholder, replaceStrings[placeholder]);
        });
    }

    return translated;
}

export function getWindowWidth() {
    return typeof global.window !== 'undefined' ? global.window.innerWidth : 0;
}

export function getWindowHeight() {
    return typeof global.window !== 'undefined' ? global.window.innerHeight : 0;
}

//获取非跨域的最高窗口上下文
//（在iframe中时）
export function getHighestSafeWindowContext(self = global.window.self) {
    // 如果我们达到顶级水平，那就回归自我
    if (self === global.window.top) {
        return self;
    }

    const getOrigin = href => href.match(/(.*\/\/.*?)(\/|$)/)[1];

    //如果父是同一个来源，我们可以向上移动一个上下文
    // 参考: https://stackoverflow.com/a/21965342/1601953
    if (getOrigin(self.location.href) === getOrigin(self.document.referrer)) {
        return getHighestSafeWindowContext(self.parent);
    }

    //如果是不同的起源，我们会考虑当前的水平
    //作为顶部可到达的一个
    return self;
}