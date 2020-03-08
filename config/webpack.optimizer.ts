import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import {Options} from "webpack";


let opti: Options.Optimization = {
    minimizer: [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    drop_console: false,
                    unsafe: true
                },
                output: {comments: false},
                toplevel: true
            }
        })
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