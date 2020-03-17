<template>
    <div class="container" :style="{width: HolderWidth, height: HolderHeight}">

        <h1>{{title}}</h1>
        <div class="stats">
            <div class="canvas-holder" :style="{width: ChartWidth, height: ChartHeight}">
                <div class="emoji-holder" v-for="(e,i) in EmojiTop">
                    <div class="front-holder">
                        <div class="emoji">{{e.emoji}}</div>
                        <div class="value">{{e.value}}</div>

                    </div>
                    <div class="progress-bar">
                        <div class="fill"
                             :style="{width: e.percentage.toString() + '%', backgroundColor: Colors[i]}"></div>
                    </div>
                    <div class="percentage" :style="{ backgroundColor: ColorsFaded[i], color: Colors[i]}">
                        {{e.percentage.toFixed(1)}}%
                    </div>

                </div>
                <div class="emoji-holder bottom">
                    <div :style='{opacity: FirstPage ? 0 : 1}' @click="Prev" class="but">Prev</div>
                    <div :style='{opacity: LastPage ? 0 : 1}' @click="Next" class="but">Next</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .container {

        .but {
            font-family: "Raleway", sans-serif;
            text-transform: uppercase;
            padding: 12px 25px;
            border: 1px solid #00000088;
            border-radius: 5px;
            cursor: pointer;
            user-select: none;

            transition: background-color 0.2s;

            &:hover {
                background-color: #9c9c9c30;
            }
        }

        h1 {
            font-size: 20px;
            padding: 10px 20px;
            margin: 0;
        }


        .bottom {
            margin-bottom: 20px;
        }

        .emoji-holder {
            display: flex;
            align-items: center;
            position: relative;
            width: 85%;
            margin: 5px auto;
            justify-content: space-between;
            font-family: "Roboto Light", sans-serif;

            .progress-bar {
                background-color: #00000010;
                overflow: hidden;
                border-radius: 2px;
                height: 7px;
                width: 150px;
                margin-right: 10px;
                position: relative;

                .fill {
                    transition: width 0.2s;
                    position: relative;
                    height: 100%;
                    background-color: aqua;
                }
            }

            .front-holder {
                width: 110px;
                padding: 5px;
                display: flex;
                align-items: center;
            }

            .emoji {
                font-size: 30px;

            }

            .value {
                color: #00000088;
                font-size: 20px;
                margin: 10px;
            }

            .percentage {
                width: 50px;
                font-size: 15px;
                text-align: center;
                padding: 7px 13px;
                border-radius: 5px;
            }


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
        padding-bottom: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

    }

</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {EmojiData, EmojiDataSet} from "../../../classLibrary/EmojiDataSet";

    @Component({
        props: {
            title: String,

            width: Number,
            height: Number,
            emoji: EmojiDataSet,
        }
    })
    export default class EmojiChart extends Vue {

        title?: string;

        width?: number;
        height?: number;

        bar?: boolean;

        emoji?: EmojiDataSet;

        page: number = 0;

        get Colors(): string[] {
            return ['#5a8dee', '#00cfdd', '#3adb8b', '#ff5b5c', '#fdac41', '#475f7b', '#9771e3']
        }

        get ColorsFaded(): string[] {
            return ['#5a8dee30', '#00cfdd30', '#3adb8b30', '#ff5b5c30', '#fdac4130', '#475f7b30', '#9771e330']
        }

        get EffectiveHeight(): number {
            return this.height! - 70;
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

        get EmojiTop(): EmojiData[] {
            return this.emoji!.LeaderBoard.Skip(this.page * 5).Take(5);
        }

        get LastPage(): boolean {
            return this.page == (this.emoji!.LeaderBoard.length / 5).Floor();
        }

        get FirstPage(): boolean {
            return this.page == 0;
        }

        Next() {
            if (!this.LastPage) {
                this.page++;
            }
        }

        Prev() {
            if (!this.FirstPage) {
                this.page--;
            }
        }

    }
</script>
