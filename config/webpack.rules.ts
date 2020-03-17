import {RuleSetRule, RuleSetUseItem} from "webpack";
import * as path from "path";
import {prodFileOpts} from "./config.prod";
import {devFileOpts} from "./config.dev";

/*===================
 STYLE LOADER
 ===================== */
let preCSSLoaders: RuleSetUseItem[] = [
    {loader: 'postcss-loader', options: {config: {path: `${__dirname}/postcss.config.js`}}},
    "sass-loader"
];

let use: RuleSetUseItem[] = [
    "style-loader",
    {loader: "css-loader", options: {importLoaders: preCSSLoaders.length}}
];

let cssRule: RuleSetRule = {
    test: /\.s?css/,
    use: use.concat(preCSSLoaders)
};


/*===================
 BABEL LOADER
 ===================== */
let babelUse: RuleSetUseItem[] = [
    {loader: 'babel-loader', options: {configFile: path.resolve(__dirname, "./babel.config.js")}}
];
let babel: RuleSetRule = {
    test: /\.jsx?$/,
    use: babelUse
};

/*===================
 TS LOADER
 ===================== */

let uses: RuleSetUseItem[] = [
    {loader: 'ts-loader', options: {transpileOnly: true, appendTsSuffixTo: [/\.vue$/]}}
];

let scripts: RuleSetRule = {
    test: /\.tsx?$/,
    exclude: /(node_modules|bower_components)/,
    use: uses
};
/*===================
 Vue LOADER
 ===================== */

let vue: RuleSetRule = {
    test: /\.vue$/, loader: 'vue-loader',
    options: {hotReload: true}
};

/*===================
 File LOADER
 ===================== */

function file(env: "production" | "development" | "none"): RuleSetRule {
    return {
        exclude: [/\.vue$/, /\.(js|jsx|mjs)$/, /\.(ts|tsx)$/, /\.(scss|css)$/, /\.html$/, /\.json$/],
        loader: 'file-loader',
        options: env === "production" ? prodFileOpts : devFileOpts
    }
}

/* ==============
 Combining
 ================= */

function rules(env: "production" | "development" | "none"): RuleSetRule[] {
    return [

        vue,
        scripts,
        babel,
        cssRule,
        {
            test: /\.txt$/i,
            use: [
                {
                    loader: 'raw-loader',
                    options: {
                        esModule: false,
                    },
                },
            ],
        },
        file(env)
    ];
}

export {rules};
