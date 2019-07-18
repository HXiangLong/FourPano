const eslintFormatter = require('react-dev-utils/eslintFormatter');
const webpack = require('webpack'); //引入webpack
const opn = require('opn'); //打开浏览器
const merge = require('webpack-merge'); //webpack配置文件合并
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const baseWebpackConfig = require("./webpack.base.PC"); //基础配置
const webpackFile = require("./webpack.file.PC"); //一些路径配置

let config = merge(baseWebpackConfig, {

    mode: 'development', //设置开发环境

    output: {
        // 所有输出文件的目标路径 
        //必须是绝对路径（使用 Node.js 的 path 模块）
        path: path.resolve(__dirname, webpackFile.devDirectory),

        filename: 'js/[name].js', // 用于多个入口点

        publicPath: '/' // 输出解析文件的目录，url 相对于 HTML 页面

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

    module: { // 关于模块配置
        // 模块规则（配置 loader、解析器等选项）
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
                loader: 'file-loader?name=[name].[ext]&outputPath=' + webpackFile.resource + '/'
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ]
    },

    // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
    // 牺牲了构建速度的 `source-map' 是最详细的。
    devtool: "source-map",

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