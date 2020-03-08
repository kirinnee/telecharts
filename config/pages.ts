import {IPage} from "./Helper";

let pages: IPage = {
    chunks: [
        ["index", "./src/pages/index/index.ts"]
    ],
    pages: [
        {
            template: "index.html",
            output: "index.html",
            chunks: ['index'],
            title: 'TeleCharts'
        }
    ],
};

export {pages};