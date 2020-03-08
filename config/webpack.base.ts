import * as path from "path";
import {opti} from "./webpack.optimizer";
import webpack, {Entry, Plugin} from "webpack";
import {rules} from "./webpack.rules";
import {Kore} from "@kirinnee/core";
import "webpack-dev-server";
import {pages} from "./pages";
import {ConvertToOption, Page} from "./Helper";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {VueLoaderPlugin} from "vue-loader";

let core = new Kore();
core.ExtendPrimitives();

let plugins: Plugin[] = pages.pages
	.Map(s => ConvertToOption(s as Page))
	.Map(s => new HtmlWebpackPlugin(s))
	.Add(new VueLoaderPlugin());

function GenerateConfig(entry: Entry, filename: string, mode: "development" | "production" | "none"): webpack.Configuration {
	let outDir = path.resolve(__dirname, "../dist");
	plugins = mode === "production" ? plugins : plugins.Add(new webpack.HotModuleReplacementPlugin());
	plugins = plugins.Add(new webpack.DefinePlugin({
		PRODUCTION: JSON.stringify(mode === "production")
	}));
	let config: webpack.Configuration = {
		entry: entry,
		output: {
			path: outDir,
			filename: filename,
			libraryTarget: "umd",
			publicPath: '/',
			globalObject: "(typeof window !== 'undefined' ? window : this)"
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.vue'],
			alias: {'vue$': 'vue/dist/vue.esm.js'}
		},
		mode: mode,
		devtool: "source-map",
		module: {rules: rules(mode)},
		plugins: plugins
	};
	config.target = "web";
	if (mode === "production") config.optimization = opti;
	else if (mode === "development") {
		config.devServer = {
			contentBase: path.resolve(__dirname, '../dist'),
			hot: true,
			historyApiFallback: true,
		}
	}
	return config;
}

export {GenerateConfig};
