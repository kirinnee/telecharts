import {Options} from "webpack";
import TerserPlugin from "terser-webpack-plugin";


let opti: Options.Optimization = {
    minimize: true,
    minimizer: [
        new TerserPlugin({
            parallel: true,
            terserOptions: {
                output: {
                    comments: false,
                },
                compress: {
                    drop_console: true,
                    unsafe: true,
                },
                toplevel: true,
                mangle: {
                    toplevel: true,
                }
            },
            extractComments: false,
        }),
    ],
    splitChunks: {
        name: true,
        cacheGroups: {
            commons: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all'
            }
        }
    }
};

export {opti};