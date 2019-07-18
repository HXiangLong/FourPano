const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const baseWebpackConfig = require("./webpack.base.PC");
const webpackFile = require('./webpack.file.PC');

let config = merge(baseWebpackConfig, {
    /*设置生产环境*/
    mode: 'production',
    output: {
        path: path.resolve(__dirname,webpackFile.proDirectory),
        filename: 'js/[name].[chunkhash:8].js',
        publicPath: './' // 输出解析文件的目录，url 相对于 HTML 页面
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
    plugins: [
        // 将css提取到它自己的文件中
        new ExtractTextPlugin('css/[name].[md5:contenthash:hex:8].css'),
        // 使用这个插件压缩提取的CSS
        // 可以从不同组件复制CSS
        new OptimizeCSSPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {removeAll: true},
                // 避免 cssnano 重新计算 z-index
                safe: true
            },
            canPrint: true
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(css|pcss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!postcss-loader"
                })
            },
            {
                test: /\.(png|jpg|gif|ttf|eot|woff|woff2|svg|swf)$/,
                loader: 'file-loader?name=[name].[ext]&outputPath=./'
            },
            {
                test: /\.swf$/,
                loader: 'file?name=js/[name].[ext]'
            }
        ]
    }
});

let conf = {
    template:"./app/views/PC/index.html",
    filename: 'PC.html',
    inject: true,
    title:"全景电脑版",
    minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
    },
    chunks: ['manifest', 'vendor', 'common', 'index'],
    hash: false,
    chunksSortMode: 'dependency'
};
config.plugins.push(new HtmlWebpackPlugin(conf));

/* 清除 dist */
config.plugins.push(new CleanWebpackPlugin([webpackFile.proDirectory], {root: path.resolve(__dirname, '../../'), verbose: true, dry: false}));

let copyObj = [
    /*    {from: './app/public/plugin', to: './plugin'},//一些不需要走webpack的插件
        {from: './app/public/versionTips', to: './versionTips'},//固定不变的浏览器版本提示文件
        {from: './app/public/file', to: './resource'},//一些固定的文件，如下载文件*/
        {from: './app/commons/img', to: './img'},//复制图片
    ];
    
    let copyArr = [];
    copyObj.map((data) => {
        copyArr.push(
            new CopyWebpackPlugin([{from: data.from, to: data.to, ignore: ['.*']}])
        )
    });
    
    /* 拷贝静态资源  */
    copyArr.map(function (data) {
        return config.plugins.push(data)
    });
    
    module.exports = config;