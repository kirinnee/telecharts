<template>
    <div class="container" :style="{width: HolderWidth, height: HolderHeight}">

        <h1>{{title}}</h1>
        <div class="stats">
            <div class="canvas-holder" :style="{width: ChartWidth, height: ChartHeight}">
                <div v-if='!pie' class="main-stats">
                    <div class="number">{{DisplayTotalValue}}</div>
                    <div class="stat">{{total}}</div>
                </div>
                <canvas ref="key" style="{position: absolute}"/>
            </div>
            <div class="legend" :style="{width: LegendWidth, height: LegendHeight}">

                <div v-for="(k,i) in labels" class="data-holder">
                    <div class="outer-circle" @click="Invert(i)" :style="{border: 'solid ' + colors[i] + ' 3px'}">
                        <div v-show="check[i]" class="inner-circle" :style="{backgroundColor: colors[i]}"></div>
                    </div>
                    <div class="data">
                        <div class="type">{{labels[i]}}</div>
                        <div class="value">{{Percentage[i]}} - {{UsableDataSet[i]}}</div>
                    </div>
                </div>
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
        margin: 0 20px;
        position: relative;

        .number {
            text-transform: uppercase;
            font-family: Roboto, sans-serif;
            font-weight: 900;
            font-size: 35px;
        }

        .main-stats {
            position: absolute;
            text-align: center;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }


    .legend {
        margin: 0 20px;
        position: relative;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .data-holder {
            display: flex;
            margin: 5px;
            align-items: center;
        }


        .outer-circle {
            position: relative;
            border-radius: 50%;
            margin: 0 15px 0 5px;
            width: 20px;
            height: 20px;
            cursor: pointer;

            .inner-circle {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                cursor: pointer;
            }
        }


        .type {
            font-weight: 900;
            font-family: Roboto, sans-serif;
        }

        .value {
            font-weight: lighter;
            font-family: "Roboto Light", sans-serif;
        }


    }

</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {Updatable} from "../../../classLibrary/Updatable";
    import Chart from "chart.js";
    import {Commarize} from "../init";

    @Component({
        props: {
            title: String,
            data: Object,
            labels: Array,
            colors: Array,
            keys: Array,
            total: String,
            width: Number,
            height: Number,
            pie: Boolean,
        }
    })
    export default class PieChart extends Vue {
        data?: Updatable;
        labels?: string[];
        colors?: string[];
        keys?: string[];
        total?: string;
        width?: number;
        height?: number;
        chart?: Chart;
        pie?: boolean;

        check: boolean[] = this.labels!.Map(e => true);


        Invert(i: number): void {
            this.$set(this.check, i, !this.check[i]);
            this.Rerender();
        }

        get EffectiveHeight(): number {
            return this.height! - 44 - 20;
        }

        get EffectiveWidth(): number {
            return this.width! - 65;
        }

        get ChartWidth(): string {
            return (this.EffectiveHeight).toString() + "px";
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

        get LegendWidth(): string {
            return (this.EffectiveWidth - this.EffectiveHeight!).toString() + "px";
        }

        get LegendHeight(): string {
            return (this.EffectiveHeight).toString() + "px";
        }


        Rerender() {
            this.chart!.data!.datasets![0]!.data = this.UsedDataSet;
            this.chart!.data!.labels = this.UsedLabels;
            this.chart!.data!.datasets![0]!.backgroundColor = this.UsedColors;

            this.chart?.update({duration: 500})
        }

        mounted() {
            const pie1 = this.$refs["key"]! as HTMLCanvasElement;
            this.chart = new Chart(pie1, {
                type: this.pie ? 'doughnut' : 'pie',
                data: {
                    labels: this.UsedLabels,
                    datasets: [{
                        data: this.UsedDataSet,
                        backgroundColor: this.UsedColors,
                        borderWidth: 0,
                    }],
                },
                options: {
                    legend: {
                        display: false
                    },
                    responsive: true,
                    responsiveAnimationDuration: 1000,
                    maintainAspectRatio: false,
                    cutoutPercentage: this.pie ? 0 : 70,
                    animation: {
                        animateRotate: false,
                        animateScale: false,
                    }
                }
            });
        }

        get DataSet(): number[] {
            const updated = this.data!.Updated;
            return this.keys!.Map(e => updated[e]!);
        }

        get UsableDataSet(): string[] {
            return this.DataSet.Map(Commarize);
        }

        get UsedDataSet(): number[] {
            return this.DataSet.Where((e, i) => e > 0 && this.check[i]);
        }

        get UsedLabels(): string[] {
            return this.labels?.WithoutIndex(this.UsedIndex.Add(this.check.Indexes(false)))!;
        }

        get UsedColors(): string[] {
            return this.colors?.WithoutIndex(this.UsedIndex.Add(this.check.Indexes(false)))!;
        }

        get UsedIndex(): number[] {
            return this.DataSet
                .Map((e, i) => [e, i])
                .Where(([e, _]) => e == 0)
                .Map(([_, i]) => i)
        }

        get TotalValue(): number {
            return this.DataSet.Sum();
        }

        get DisplayTotalValue(): string {
            return Commarize(this.TotalValue);
        }

        get Percentage(): string[] {
            return this.DataSet.Map(e => ((e / this.TotalValue || 0) * 100)
                .toFixed(1).toString() + "%")

        }


    }
</script>
