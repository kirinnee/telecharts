<template>
    <div class="c-holder" :style="{width:Width, height: Height} ">
        <div class="title">{{title}}</div>
        <div class="compare-holder">
            <div class="flex">
                <div class="val left" :style="{width: HalfWidth}">
                    <div :style="{opacity: ShowLeftAdditional? 1: 0}" class="perc left">+{{LeftAdditional}}%</div>
                    <div>{{Value1}}</div>
                </div>
                <div>vs</div>
                <div class="val right" :style="{width:HalfWidth}">
                    <div>{{Value2}}</div>
                    <div :style="{opacity: ShowRightAdditional? 1: 0}" class="perc right">+{{RightAdditional}}%</div>
                </div>

            </div>
            <div class="flex">
                <div class="bar left" :style=" {width:HalfWidth}">
                    <div class="fill left" :style="LeftBar"></div>
                </div>
                <div class="bar right" :style="{width:HalfWidth}">
                    <div class="fill right" :style="RightBar"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .c-holder {


        .compare-holder {
            position: relative;
            font-family: "Roboto Light", sans-serif;

            .flex {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .bar {
                position: relative;
                width: 100%;
                height: 4px;

                .fill {
                    position: relative;
                    width: 80%;
                    height: 100%;
                    transition: width 0.5s, left 0.5s;

                    &.left {
                        left: 20%;
                        border-top-left-radius: 3px;
                        border-bottom-left-radius: 3px;
                    }

                    &.right {
                        border-top-right-radius: 3px;
                        border-bottom-right-radius: 3px;
                    }
                }
            }


            .perc {
                position: relative;
                font-size: 12px;
                color: #2eb039;
                background: #2eb03930;
                padding: 5px 8px;
                border-radius: 4px;
                margin: 5px;
            }

            .val {
                position: relative;
                margin: 10px;
                font-size: 30px;
                display: flex;
                align-items: center;

                justify-content: space-between;

                &.left {
                    text-align: right;
                }
            }

        }

        .title {
            font-size: 16px;
            text-transform: uppercase;
            margin: 10px 20px;
            text-align: center;
        }

        position: relative;
        background-color: white;
        border-radius: 5px;
        box-shadow: 1px 1px 4px 4px rgba(136, 136, 136, 0.1);
    }
</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {Commarize} from "../init";
    import {SafeNumber} from "../../../classLibrary/Utility";

    @Component({
        props: {
            h: Number,
            w: Number,
            title: String,
            leftColor: String,
            rightColor: String,
            v1: Number,
            v2: Number,
            display1: String,
            display2: String,
        }
    })
    export default class Comparison extends Vue {
        w?: number;
        h?: number;
        leftColor?: string;
        rightColor?: string;
        v1?: number;
        v2?: number;

        title?: string;

        display1?: string;
        display2?: string;

        get V1(): number {
            return this.v1 ?? 0;
        }

        get V2(): number {
            return this.v2 ?? 0;
        }

        get Value1(): string {
            return this.display1 ?? Commarize(this.V1.toFixed(2).ToFloat())
        }

        get Value2(): string {
            return this.display2 ?? Commarize(this.V2.toFixed(2).ToFloat())
        }

        get LeftAdditional(): number {

            const v = (this.V1 / this.V2);
            const p = v.Finite() ? v : 0;
            return (p * 100 - 100).toFixed(1).ToFloat();

        }

        get RightAdditional(): number {

            const v = this.V2 / this.V1;
            const p = v.Finite() ? v : 0;
            return (p * 100 - 100).toFixed(1).ToFloat();
        }

        get ShowLeftAdditional(): boolean {
            return this.LeftAdditional > this.RightAdditional;
        }

        get ShowRightAdditional(): boolean {
            return this.RightAdditional > this.LeftAdditional;
        }

        get Total(): number {
            return this.V1 + this.V2;
        }

        get LeftPercentage(): number {
            return SafeNumber(this.V1 / this.Total * 100);
        }

        get RightPercentage(): number {
            return SafeNumber(this.V2 / this.Total * 100);
        }

        get LeftBar(): object {
            return {
                background: this.leftColor ?? '#5a8dee',
                left: (100 - this.LeftPercentage).toString() + "%",
                width: this.LeftPercentage.toString() + "%",

            }
        }


        get RightBar(): object {
            return {
                background: this.rightColor ?? '#ff5b5c',
                width: this.RightPercentage.toString() + "%",
            }
        }

        get W(): number {
            return this.w ?? 400;
        }

        get H(): number {
            return this.h ?? 120;
        }

        get Width(): string {
            return this.W.toString() + "px";
        }

        get HalfWidth(): string {
            return (this.W / 2).toString() + "px";
        }

        get Height(): string {
            return this.H.toString() + "px";
        }


    }
</script>
