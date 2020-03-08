import {RuleSetQuery} from "webpack";

let devFileOpts: RuleSetQuery = {
    name: '[path][name].[ext]',
    publicPath: '',
    context: './src/pages'
};

export {
    devFileOpts
}