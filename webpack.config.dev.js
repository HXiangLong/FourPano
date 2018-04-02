//开发环境
const getEntry = require('./webpack-config/entry.config');
const outputs = require('./webpack-config/output.config');
const modules = require('./webpack-config/module.config');
const pluguns = require('./webpack-config/plugins.config');
const resolves = require('./webpack-config/resolve.config');
const devserver = require('./webpack-config/devServer.config');

module.exports = {
    entry: getEntry(pluguns.globPath, pluguns.pathDir),
    output: outputs,
    module: modules,
    plugins: pluguns.plugin,
    resolve: resolves,
    devServer: devserver,
    devtool: 'inline-source-map'
}

// console.log(getEntry(pluguns.globPath, pluguns.pathDir));