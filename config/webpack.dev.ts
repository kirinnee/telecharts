import {Entry} from "webpack";
import {Kore} from "@kirinnee/core";
import "webpack-dev-server";
import {pages} from "./pages";
import {GenerateConfig} from "./webpack.base";

let core = new Kore();
core.ExtendPrimitives();

let entry: Entry = new Map(pages.chunks)
	.MapValue(v => core.WrapArray(v))
	.AsObject() as Entry;

export default GenerateConfig(entry, '[name].js', 'development');
