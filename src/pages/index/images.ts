import logo from "./assets/logo.png"
import {Rimage, Rimager} from "@kirinnee/rimage";
import {SortType} from "@kirinnee/core";
import {core} from "./init";

core.AssertExtend();

let images: any = {
	logo
};

declare var PRODUCTION: boolean;
let imageDeployConfig: any = require("../../../config/image.deploy.config.json")[0];

let config: Rimage = {
	key: imageDeployConfig.key,
	width: imageDeployConfig.width,
	sizes: imageDeployConfig.sizes
};

let rimager: Rimager = new Rimager(core, config, new SortType(), !PRODUCTION);
rimager.ExtendPrimitives();

images = rimager.RegisterImages(images);

export {
	images,
	rimager
}
