const path = require('path');
let packageName = getArgv('package');
let entry = './src/log/index.js';
let outputPath = path.join(__dirname, 'dist', 'log');
let library = 'GCBLog';
if(packageName) {
    entry = `./src/${packageName}/index.js`;
    outputPath = path.join(__dirname, 'dist', packageName);
    library = packageName;
}
module.exports = {
    entry: {
        index:entry
    },
    output: {
        filename: 'index.js',
        path: outputPath,
        // export to AMD, CommonJS, or window
        libraryTarget: 'umd',
        // the name exported to window
        library: library,
        libraryExport: "default",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/, // 排除不处理的目录
            },
        ],
    },
};
function getArgv(str){
    const argv = process.argv
    const result = argv.find(item => item.match(str));
    if (result) {
        return result.split('=')[1]
    }
    return null
}
