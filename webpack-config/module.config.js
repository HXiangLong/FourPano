//这些选项决定了如何处理项目中的不同类型的模块。
module.exports = {
    rules: [{
            test: /\.(scss|css)$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            use: [{
                // loader: 'babel-loader?cacheDirectory=true',
                loaders: ['react-hot', 'babel'],
                options: {
                    presets: ['env', "react"]
                }
            }]
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 20480,
                    name: './img/[name][hash].[ext]'
                }
            }]
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        },
        {
            test: /\.(csv|tsv)$/,
            use: [
                'csv-loader'
            ]
        },
        {
            test: /\.xml$/,
            use: [
                'xml-loader'
            ]
        },
        {
            test: /\.html$/,
            use: ['html-loader']
        },
        {
            test: /\.json$/,
            use: ['json-loader']
        }
    ]
};