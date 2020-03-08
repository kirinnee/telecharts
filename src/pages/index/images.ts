import logo from "./assets/logo.jpg"
import one from "./assets/install1.png"
import two from "./assets/install1.png"
import three from "./assets/install3.png"
import four from "./assets/install4.png"
import five from "./assets/install5.png"
import six from "./assets/install6.png"
import seven from "./assets/install7.png"
import eight from "./assets/install8.png"

import {Rimage, Rimager} from "@kirinnee/rimage";
import {SortType} from "@kirinnee/core";
import {core} from "./init";

core.AssertExtend();

let images: any = {
    logo,
    install: {
        one,
        two,
        three,
        four,
        five,
        six,
        seven,
        eight,
    }
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
