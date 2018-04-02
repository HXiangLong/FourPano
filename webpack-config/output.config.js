//output 位于对象最顶级键(key)，包括了一组选项，指示 webpack 如何去输出、以及在哪里输出你的
//「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容」。
const path = require('path');
const me = require('./path.config');

module.exports = {
    path: me.publicDir, //目录对应一个绝对路径。
    // publicPath: './', //对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。
    filename: 'page/[name].js', //此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。对于单个入口起点，filename 会是一个静态名称。
    chunkFilename: '[id].bundle.js' //此选项决定了非入口(non-entry) chunk 文件的名称。有关可取的值的详细信息，请查看 output.filename 选项。
};