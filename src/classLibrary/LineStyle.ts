interface LineStyle {
    label: string;
    color: string;
    areaColor: string;
    borderDash?: [number, number];
    fill: boolean;
    straight: boolean;
}

export {LineStyle}