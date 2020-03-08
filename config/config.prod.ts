import {RuleSetQuery} from "webpack";

let prodFileOpts: RuleSetQuery = {
	name: '[path][name].[ext]',
	publicPath: './public',
	context: './src'
};

export {
	prodFileOpts
}
