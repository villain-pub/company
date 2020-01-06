const plugins = [];
plugins.push('transform-remove-console');
module.exports = {
    presets: [
        "@babel/preset-env"
    ],
    plugins,
};
