const presetEnv = require('postcss-preset-env');

module.exports = {
    plugins: [
        presetEnv({
            autoprefixer: {grid: true}
        })
    ]
};