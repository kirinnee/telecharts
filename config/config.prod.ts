import {RuleSetQuery} from "webpack";

let prodFileOpts: RuleSetQuery = {
	name: '[path][name].[ext]',
	publicPath: '',
	context: './src'
};

export {
	prodFileOpts
}
