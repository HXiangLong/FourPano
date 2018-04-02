/*
 * @Author: hxl 
 * @Date: 2018-02-28 17:46:34 
 * @Last Modified by: hxl
 * @Last Modified time: 2018-04-02 10:01:23
 */

//打包环境
const fs = require('fs');
const rimraf = require('rimraf');
const dirVars = require('./webpack-config/path.config');
const getEntry = require('./webpack-config/entry.config');
const outputs = require('./webpack-config/output.config');
const modules = require('./webpack-config/module.product.config');
const pluguns = require('./webpack-config/plugins.product.config');
const resolves = require('./webpack-config/resolve.config');

rimraf(dirVars.publicDir, fs, function cb() {
    console.log('public目录已清空');
});

module.exports = {
    entry: getEntry(pluguns.globPath, pluguns.pathDir),
    output: outputs,
    module: modules,
    resolve: resolves,
    plugins: pluguns.plugin
}