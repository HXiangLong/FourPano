const eslintFormatter = require('react-dev-utils/eslintFormatter');
const webpack = require('webpack'); //引入webpack
const opn = require('opn'); //打开浏览器
const merge = require('webpack-merge'); //webpack配置文件合并
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const baseWebpackConfig = require("./webpack.base.PC"); //基础配置
const webpackFile = require("./webpack.file.PC"); //一些路径配置

let config = merge(baseWebpackConfig, {
    /*设置开发环境*/
    mode: 'development',
    output: {
        path: path.resolve(webpackFile.devDirectory),
        filename: 'js/[name].js',
        chunkFilename: "js/[name].js",
        publicPath: ''
    },
    optimization: {
        //包清单
        runtimeChunk: {
            name: "manifest"
        },
        //拆分公共包
        splitChunks: {
            cacheGroups: {
                //项目公共组件
                common: {
                    chunks: "initial",
                    name: "common",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                //第三方组件
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                use: [
                    'cache-loader',
                    'babel-loader',
                ],
                include: [
                    path.resolve(__dirname, "../../app")
                ],
                exclude: [
                    path.resolve(__dirname, "../../node_modules")
                ]
            },
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                use: [{
                    options: {
                        formatter: eslintFormatter,
                        eslintPath: require.resolve('eslint'),
                        // @remove-on-eject-begin
                        baseConfig: {
                            extends: [require.resolve('eslint-config-react-app')],
                        },
                        //ignore: false,
                        useEslintrc: false,
                        // @remove-on-eject-end
                    },
                    loader: require.resolve('eslint-loader'),
                }, ],
                include: [
                    path.resolve(__dirname, "../../app")
                ],
                exclude: [
                    path.resolve(__dirname, "../../node_modules")
                ],
            },
            {
                test: /\.(css|pcss)$/,
                loader: 'style-loader?sourceMap!css-loader?sourceMap!postcss-loader?sourceMap',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|ttf|eot|woff|woff2|svg|swf)$/,
                loader: 'file-loader?limit=8192&name=[name].[ext]&outputPath=' + webpackFile.resource + '/'
            }
        ]
    },

    plugins: [
        //设置热更新
        new webpack.HotModuleReplacementPlugin(),
        //全局引入模块 ，这样其他模块就可以直接使用无需引入
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', THREE: 'three' }),
        new webpack.NamedModulesPlugin()
    ],
    /*设置api转发*/
    devServer: {
        host: '0.0.0.0',
        port: 8081,
        hot: true,
        inline: true,
        contentBase: path.resolve(webpackFile.devDirectory),
        historyApiFallback: true,
        disableHostCheck: true,
        proxy: [{
            context: ['/api/**', '/u/**'],
            target: 'http://192.168.10.63:8080/',
            secure: false
        }],
        /*打开浏览器 并打开本项目网址*/
        after() {
            opn('http://localhost:' + this.port);
        }
    }
});
module.exports = config;