const extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    rules: [{
            test: /\.css$/,
            exclude: /(node_modules)/,
            use: extractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader'
                }]
            })
        }, {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            use: [{
                loader: 'babel-loader?cacheDirectory=true',
                options: {
                    presets: ['env']
                }
            }]
        },
        {
            test: /\.png|jpg|gif$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 20480,
                    name: 'image/[name][hash].[ext]'
                }
            }]
        },
        {
            test: /\.html$/,
            use: ['html-loader']
        }

    ]
};