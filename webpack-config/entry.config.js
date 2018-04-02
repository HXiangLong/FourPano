//入口文件
//利用glob模块可以很方便的获取../src/scripts/pages/路径下的所有js入口文件。
//同理，可以实现自动的进行与入口文件相对应的模板配置。
const glob = require('glob');
const path = require('path');

function getEntry(globPath, pathDir) {
    let files = glob.sync(globPath);
    let entries = {},
        entry, basename, extname;

    for (let i = 0; i < files.length; i++) {
        entry = files[i];
        extname = path.extname(entry); //方法返回 path 的扩展名，即从 path 的最后一部分中的最后一个 .（句号）字符到字符串结束。
        basename = path.basename(entry, extname); //方法返回一个 path 的最后一部分，类似于 Unix 中的 basename 命令。
        entries[basename] = entry;
    }
    // console.log(entries);
    return entries;
}

module.exports = getEntry;