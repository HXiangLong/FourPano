var path = require('path');
var moduleExports = {};

// 源文件目录
moduleExports.staticRootDir = path.resolve(__dirname, '../'); // 项目根目录
moduleExports.srcRootDir = path.resolve(moduleExports.staticRootDir, './src'); // 项目业务代码根目录
moduleExports.libsDir = path.resolve(moduleExports.srcRootDir, './libs'); // 存放所有不能用npm管理的第三方库
moduleExports.cssDir = path.resolve(moduleExports.srcRootDir, './css'); // 存放css
moduleExports.imgDir = path.resolve(moduleExports.srcRootDir, './img'); // 存放各种图标
moduleExports.scriptsDir = path.resolve(moduleExports.srcRootDir, './scripts'); //存放js
moduleExports.viewsDir = path.resolve(moduleExports.srcRootDir, './views'); //存放各个页面
moduleExports.rearServerDir = path.resolve(moduleExports.srcRootDir, './server'); //存放node服务中间件

moduleExports.pagesDir = path.resolve(moduleExports.scriptsDir, './page'); // 存放各个页面独有的部分，如入口文件
moduleExports.dataDir = path.resolve(moduleExports.scriptsDir, './data'); // 存放各个功能服务器穿来的数据
moduleExports.modulesDir = path.resolve(moduleExports.scriptsDir, './modules'); // 存放各个功能模块
moduleExports.frontServerDir = path.resolve(moduleExports.scriptsDir, './server'); // 存放前端链接后端服务数据
moduleExports.toolsDir = path.resolve(moduleExports.scriptsDir, './tools'); // 存放自定义的工具模块

// 生成文件目录
moduleExports.publicDir = path.resolve(moduleExports.staticRootDir, './public'); // 存放编译后生成的所有代码、资源（图片、字体等，虽然只是简单的从源目录迁移过来）

module.exports = moduleExports;