module.exports = function (api) {
    api.cache.never();

    const presets = ['@babel/preset-env'];
    const plugins = ['@babel/plugin-proposal-object-rest-spread'];

    return {
        presets,
        plugins
    };
};