const webpack = require('webpack'); //引入webpack
const merge = require('webpack-merge'); //webpack配置文件合并
const eslintFormatter = require('react-dev-utils/eslintFormatter'); //eslint代码检测机制
const ExtractTextWebapckPlugin = require('extract-text-webpack-plugin'); //CSS文件单独提取出来
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清空打包目录的插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html的插件
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制静态资源的插件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');//css提取、压缩插件
const opn = require('opn'); //打开浏览器
const path = require("path"); //node路径处理
const fs = require('fs'); //node文件处理

//开发模式
const modes = (process.env.NODE_ENV) ? 'production' : 'development';
console.log(modes);
//单页面
const single_page = './app/views/PC/index.js';

const config = merge({
    mode: modes, //设置开发环境

    entry: single_page, //每个HTML页面都有一个入口起点。

    output: { //出口

        filename: '[name].[hash].js', //入口分块(entry chunk)的文件名模板

        path: path.resolve(__dirname, 'dist'), // 所有输出文件的目标路径，必须是绝对路径（使用 Node.js 的 path 模块）

        publicPath: './' // 输出解析文件的目录，url 相对于 HTML 页面

    },

    resolve: { // 解析模块请求的选项
        extensions: [".js", ".json", ".jsx", ".css", ".pcss"], // 使用的扩展名
    },

    //实现公共代码抽取
    optimization: {
        splitChunks: {
            chunks: "all", //设置为 all，使得 async 异步加载的代码和 initial 初始化的代码都会被抽取。
            cacheGroups: {
                commons: { //实现公共代码抽取
                    name: "commons", //指定将抽取出来的 js 的重新命名
                    test: /src[\/]/, //用来筛选你要匹配的代码
                    chunks: "initial",
                    priority: 2,
                    minChunks: 2 //表示代码被引用 2 次及以上就会被抽取出来
                },
                vendors: { //则用于抽取 node_modules 下的公共库
                    name: "vendors",
                    test: /node_modules/,
                    chunks: "initial",
                    priority: 10,
                    minChunks: 2
                }
            }
        }
    },

    module: { // 关于模块配置
        rules: [ // 模块规则（配置 loader、解析器等选项）
            {
                test: /\.(js|jsx)$/, //匹配规则
                use: [ //数组，里面放一个个的loader，执行顺序从右到左
                    'cache-loader',
                    'babel-loader',
                ],
                include: [ //包含什么文件夹
                    path.resolve(__dirname, './app')
                ],
                exclude: [ //排除什么文件夹
                    path.resolve(__dirname, './node_modules')
                ]
            },
            {
                test: /\.(js|jsx)$/, //加入eslint语法检查
                enforce: 'pre',
                use: [{
                    options: {
                        formatter: eslintFormatter,
                        eslintPath: require.resolve('eslint'),
                        baseConfig: {
                            extends: [require.resolve('eslint-config-react-app')],
                        },
                        useEslintrc: false,
                    },
                    loader: require.resolve('eslint-loader'),
                }, ],
                include: [
                    path.resolve(__dirname, "./app")
                ],
                exclude: [
                    path.resolve(__dirname, "./node_modules")
                ],
            },
            {
                test: /\.css$/,
                use: ExtractTextWebapckPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader'] // 不再需要style-loader放到html文件内
                }),
                include: path.join(__dirname, './app'), //限制范围，提高打包速度
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: ExtractTextWebapckPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'less-loader']
                }),
                include: path.join(__dirname, './app'),
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ExtractTextWebapckPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                }),
                include: path.join(__dirname, './app'),
                exclude: /node_modules/
            },

            // {
            //     test: /\.(css|pcss)$/,
            //     loader: 'style-loader?sourceMap!css-loader?sourceMap!postcss-loader?sourceMap',
            //     exclude: /node_modules/
            // },

            // file-loader 解决css等文件中引入图片路径的问题
            // url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                // test: /\.(png|jpe?g|gif|swf)$/,
                // loader: 'url-loader?limit=8192&name=imgs/[name]-[hash].[ext]'
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'images/', // 图片输出的路径
                        limit: 8192
                    }
                }
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        interpolate: 'require'
                    }
                }],
            }
        ]
    },

    // 附加插件列表
    plugins: [],

    devServer: {},

    watch: true, // 开启监听文件更改，自动刷新
    
    watchOptions: {
        ignored: /node_modules/, //忽略不用监听变更的目录
        aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
        poll:1000 //每秒询问的文件变更的次数
    },

});

(() => {
    if (modes == 'development') {
        //设置热更新
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
        //当开启 HMR 的时候使用该插件会显示模块的相对路径
        config.plugins.push(new webpack.NamedModulesPlugin());

        config.plugins.push(new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./app/views/PC/index.html"),
            filename: 'index.html',
            chunks: ['vendors', 'commons', 'index'],
            title: "全景电脑版", //网页title
            hash: true, //防止缓存
            minify: {
                removeAttributeQuotes: true //压缩 去掉引号
            }
        }));

        config.devServer = {
            contentBase: path.resolve(__dirname, './app/views/PC'), //TODO 注意，推荐使用绝对路径。告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。
            port: 8081, //指定要监听请求的端口号
            host: 'localhost', //指定使用一个 host。默认是 localhost。
            hot: true, //启用 webpack 的模块热替换特性
            overlay: true,
            compress: false // 服务器返回浏览器的时候是否启动gzip压缩

            // host: '0.0.0.0', 
            // port: 8081, 
            // hot: true, //启用 webpack 的模块热替换特性
            // inline: true, //在 dev-server 的两种不同模式之间切换。默认情况下，应用程序启用内联模式(inline mode)。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。
            // contentBase: path.resolve(__dirname, './app/views/PC'), 
            // historyApiFallback: true, //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
            // disableHostCheck: true, //设置为true时，此选项会绕过主机检查。不建议这样做，因为不检查主机的应用程序容易受到DNS重新绑定攻击。
            // proxy: [{
            //     context: ['/api/**', '/u/**'],
            //     target: 'http://192.168.10.63:8080/',
            //     secure: false
            // }],
            // //提供在服务器内部的所有其他中间件之后执行自定义中间件的能力。
            // after() {
            //     opn('http://localhost:' + this.port);
            // }
        };
    } else {
        //清理dist文件夹
        config.plugins.push(new CleanWebpackPlugin([path.join(__dirname, 'dist')]));

        //它会将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件。
        config.plugins.push(new ExtractTextWebapckPlugin('css/[name].[hash].css'));

        //对 css 进行压缩处理 isSafe = true，避免 z-index 被修改的问题
        config.plugins.push(new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
                isSafe: true
            }
        }));

        config.plugins.push(new HtmlWebpackPlugin({
            template: "./app/views/PC/index.html", // html模板路径
            filename: 'index.html', // 生成的html存放路径，相对于path
            inject: true, // js插入的位置，true-'body'
            title: "全景电脑版", //网页title
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true, //删除空白符与换行符
                removeAttributeQuotes: true //删除属性引号
            },
            chunks: ['manifest', 'vendor', 'common'], //允许您只添加一些块（例如只有单元测试块）
            hash: true, //如果为true，则将唯一的webpack编译哈希附加到所有包含的脚本和CSS文件中。这对缓存清除非常有用
            chunksSortMode: 'none' //允许控制在将块包含到HTML之前应如何对块进行排序。允许的值为'none'|'auto'|'dependency'|'manual'|{Function}
        }));
    }
    //全局引入模块 ，这样其他模块就可以直接使用无需引入
    config.plugins.push(new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        THREE: 'three'
    }));

    config.plugins.push(new webpack.BannerPlugin('版权所有，翻版必究'));


})();
console.log(config);
module.exports = config;