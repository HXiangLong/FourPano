let config = {
    entry: { // 这里应用程序开始执行
        'index': './app/views/PC/index.js'
    },
    resolve: { // 解析模块请求的选项
        // modules: [ // 用于查找模块的目录
        //     "node_modules",
        //     path.resolve(__dirname, "../../app")
        // ],
        extensions: [".js", ".json", ".jsx", ".css", ".pcss"], // 使用的扩展名
    }
};
module.exports = config;