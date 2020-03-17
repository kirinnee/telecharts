<template>
    <div class="container" :style="{width: HolderWidth, height: HolderHeight}">

        <h1>{{title}}</h1>
        <div class="stats">
            <div class="canvas-holder" :style="{width: ChartWidth, height: ChartHeight}">
                <canvas ref="key" style="{position: absolute}"/>
            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .container {
        h1 {
            font-size: 20px;
            padding: 10px 20px;
            margin: 0;
        }

        box-shadow: 1px 1px 4px 4px rgba(136, 136, 136, 0.1);
        background-color: white;
        position: relative;
        flex-direction: row;
        border-radius: 5px;

        .stats {
            display: flex;
        }

        div {
            overflow: hidden;
        }
    }

    .canvas-holder {
        margin: 0 5px;
        position: relative;

    }

</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {Updatable} from "../../../classLibrary/Updatable";
    import Chart, {ChartDataSets, ChartXAxe} from "chart.js";
    import {LineStyle} from "../../../classLibrary/LineStyle";

    @Component({
        props: {
            title: String,
            data: Object,
            keys: Array,

            xAxis: Array,

            lineStyle: Object,
            width: Number,
            height: Number,
            bar: Boolean,
        }
    })
    export default class PieChart extends Vue {

        title?: string;
        data?: Updatable;
        keys?: string[];

        xAxis?: any[];

        lineStyle?: { [s: string]: LineStyle };

        width?: number;
        height?: number;

        bar?: boolean;

        chart?: Chart;


        get EffectiveHeight(): number {
            return this.height! - 40;
        }

        get EffectiveWidth(): number {
            return this.width!;
        }

        get ChartWidth(): string {
            return (this.EffectiveWidth).toString() + "px";
        }

        get ChartHeight(): string {
            return (this.EffectiveHeight).toString() + "px";

        }

        get HolderWidth(): string {
            return this.width!.toString() + "px";
        }

        get HolderHeight(): string {
            return (this.height!).toString() + "px";
        }


        Rerender() {
            this.DataSet.Each((e, i) => {
                const set = this.chart!.data!.datasets![i];
                set.label = e.label;
                set.data = e.data;
                set.borderWidth = 1;

            });
            this.chart!.data!.labels! = this.xAxis! as any[];
            this.chart!.update({duration: 500})
        }

        get DataSet(): ChartDataSets [] {
            return this.keys!.Map(e => {
                const ls = this.lineStyle![e];
                return {
                    label: ls.label,
                    yAxisID: ls.label,
                    data: this.data!.Updated[e] as number[],
                    backgroundColor: ls.areaColor,
                    borderColor: ls.color,
                    borderDash: ls.borderDash,
                    fill: ls.fill,
                    lineTension: ls.straight ? 0 : undefined,
                }
            })
        }

        get YAxes(): ChartXAxe[] {
            return this.DataSet.Map((e, i) => {
                return {
                    gridLines: {
                        drawTicks: false,
                        drawOnChartArea: i == 0,
                    },
                    id: e.label,
                    display: true,
                    position: i % 2 == 0 ? 'left' : 'right',
                    type: 'linear'
                }
            })
        }

        mounted() {
            const pie1 = this.$refs["key"]! as HTMLCanvasElement;
            this.chart = new Chart(pie1, {
                type: this.bar ? 'bar' : 'line',
                data: {
                    labels: this.xAxis,
                    datasets: this.DataSet,
                },
                options: {

                    legend: {
                        display: true
                    },
                    responsive: true,
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        bodySpacing: 10,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                drawTicks: true,
                                drawOnChartArea: false,
                            },
                            // type: 'time',
                            // time: {
                            //     parser: 'DD/MM/YYYY',
                            //     tooltipFormat: 'DD/MM/YYYY',
                            // },
                            ticks: {
                                autoSkipPadding: 40,
                                maxRotation: 0,
                            },
                            scaleLabel: {
                                display: true,
                            }
                        }],
                        yAxes: this.YAxes,
                    },
                }
            });
        }


    }
</script>
