'use strict'
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack'); //引入webpack
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});

const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //CSS文件单独提取出来

var CSSLoader = [
    'css-loader?sourceMap&-minimize',
    'modules',
    'importLoaders=1',
    'localIdentName=[name]__[local]__[hash:base64:5]'
].join('&');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

function assetsPath(_path_) {
    let assetsSubDirectory;
    if (process.env.NODE_ENV === 'production') {
        assetsSubDirectory = 'static'; //可根据实际情况修改
    } else {
        assetsSubDirectory = 'static';
    }
    return path.posix.join(assetsSubDirectory, _path_);
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        index: './app/views/index.js',
    },
    output: {
        path: resolve('dist'),
        filename: '[name].[hash].js'
    },
    resolve: {
        extensions: [".js", ".jsx", ".css", ".json"],
        alias: {} //配置别名可以加快webpack查找模块的速度
    },
    module: {
        // 多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换的
        rules: [{
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: require.resolve('postcss-loader')
                    }
                ]
            },
            {
                test: /\.less$/,
                use: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
                include: [resolve('app')],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                include: [resolve('app')],
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'happypack/loader?id=happy-babel-js',
                include: [resolve('app')],
                exclude: /node_modules/
            },
            { //file-loader 解决css等文件中引入图片路径的问题
                // url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: assetsPath('images/[name].[hash:7].[ext]'), // 图片输出的路径
                        limit: 8192
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }

        ]
    },

    optimization: { //用于提取公共代码
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    name: "common",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
                }
            }
        }
    },

    plugins: [
        new HappyPack({
            id: 'happy-babel-js',
            loaders: ['cache-loader', 'babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            THREE: 'three'
        }),
    ]
}