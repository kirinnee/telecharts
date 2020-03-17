import {PointStyle} from "chart.js";

interface LineStyle {
    label: string;
    color: string;
    areaColor: string;
    yAxis: string;
    borderDash?: [number, number];
    fill: boolean;
    straight: boolean;
    type?: string;
    pointStyle?: PointStyle;
}

export {LineStyle}