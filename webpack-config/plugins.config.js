//该plugins选项用于以各种方式定制webpack构建过程。webpack附带有各种内置的插件可供选择webpack.[plugin-name]。
const me = require('./path.config');
const getEntry = require('./entry.config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


const globPath = me.pagesDir + "/**/*.js";
const pathDir = "src/page/";
const entries = getEntry(globPath, pathDir);
const plugin = [];
const debug = process.env.NODE_ENV !== 'production';
const chunks = Object.keys(entries);

plugin.push(new CleanWebpackPlugin(['public'])); //删除重复的文件
plugin.push(new webpack.ProvidePlugin({ //加载jq
    $: 'jquery',
    jQuery: 'jquery',
    TWEEN: 'tween',
    THREE: 'three'
}));
plugin.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
    chunks: chunks,
    minChunks: chunks.length // 提取所有entry共同依赖的模块
}));
plugin.push(debug ? function() {} : new UglifyJsPlugin({ //压缩代码
    compress: {
        warnings: false
    },
    except: ['$super', '$', 'exports', 'require'] //排除关键字
}));
var pages = Object.keys(getEntry(me.viewsDir + '/*.html', 'src/views/'));
pages.forEach(function(pathname) {
    var conf = {
        filename: pathname + '.html', //生成的html存放路径
        template: 'src/views/' + pathname + '.html', //html模板路径
        inject: false, //js插入的位置，true/'head'/'body'/false
    };
    if (pathname in entries) {
        // conf.favicon = me.imgDir + '/favicon.ico';
        conf.inject = 'body';
        conf.chunks = ['vendors', pathname];
        // conf.hash = true;
    }
    plugin.push(new HtmlWebpackPlugin(conf));
});
plugin.push(new webpack.NamedModulesPlugin());
plugin.push(new webpack.HotModuleReplacementPlugin());

module.exports = { plugin, globPath, pathDir };