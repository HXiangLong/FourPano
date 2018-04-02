var webpack = require('webpack');
var pluginsConfig = require('./plugins.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/* webpack1下，用了压缩插件会导致所有loader添加min配置，而autoprefixser也被定格到某个browers配置 */
pluginsConfig.plugin.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false,
    },
}));

pluginsConfig.plugin.push(new webpack.DefinePlugin({
    IS_PRODUCTION: true,
}));

//单独使用link标签加载css并设置路径，相对于output配置中的publickPath
pluginsConfig.plugin.push(new ExtractTextPlugin('./css/[name].css'));

module.exports = pluginsConfig;