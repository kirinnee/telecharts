import {Entry} from "webpack";
import {Kore} from "@kirinnee/core";
import {polyfill} from "./webpack.polyfill";
import "webpack-dev-server";
import {pages} from "./pages";
import {GenerateConfig} from "./webpack.base";


let core = new Kore();
core.ExtendPrimitives();


//Add polyfill to each chunk if there is polyfill! 
let entry: Entry = new Map(pages.chunks)
	.MapValue(v => core.WrapArray(v))
	.MapValue(v => polyfill.concat(v as string[]))
	.AsObject() as Entry;

export default GenerateConfig(entry, '[name].[contenthash].js', 'production');
