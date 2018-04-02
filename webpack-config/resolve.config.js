//这些选项能设置模块如何被解析。webpack 提供合理的默认值，但是还是可能会修改一些解析的细节。
const path = require('path');
module.exports = {
    alias: { //创建 import 或 require 的别名，来确保模块引入变得更简单。
        web_data: path.resolve(__dirname, '../src/scripts/data/'),
        web_modules: path.resolve(__dirname, '../src/scripts/modules/')
    },
    // 当require的模块找不到时，尝试添加这些后缀后进行寻找
    extensions: ['.js', '.css', '.less']
};