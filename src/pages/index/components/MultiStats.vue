<template>
    <div class="c-holder" :style="{width:Width, height: Height} ">
        <div class="title" :style="{fontSize : TitleFS}"> {{title}}</div>
        <div class="data">
            <div class='data-holder' v-for="(e,i) in DataSet"
                 :style="{backgroundColor: e.color + '30', width: BoxWidth}">
                <div class='label' :style="{fontSize : LabelFS, color: '#00000088'}">{{e.title}}</div>
                <div class='value' :style="{fontSize : ValueFS, color: e.color}">{{e.value}}</div>
            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .c-holder {
        position: relative;
        background-color: white;
        border-radius: 5px;
        box-shadow: 1px 1px 4px 4px rgba(136, 136, 136, 0.1);

        .title {
            margin: 15px;
            text-align: center;
            text-transform: uppercase;
            font-family: "Roboto Light", sans-serif;
            color: #9c9c9c;
        }

        .data {
            display: flex;
            justify-content: space-evenly;
            width: 100%;
        }

        .data-holder {
            text-align: center;
            box-sizing: border-box;
            padding: 10px 18px;
            border-radius: 5px;

            .label {
                text-transform: uppercase;
                font-family: "Raleway", sans-serif;

            }

            .value {
                text-align: center;
                font-family: "Roboto Light", sans-serif;
            }
        }
    }
</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {Commarize} from "../init";

    @Component({
        props: {
            w: String,
            h: String,
            title: String,
            titleFS: Number,
            labelFS: Number,
            valueFS: Number,
            data: Array,
        }
    })
    export default class MultiStats extends Vue {
        data?: [string, string | number, string] [];
        titleFS?: number;
        labelFS?: number;
        valueFS?: number;
        w?: number;
        h?: number;

        get Width(): string {
            return (this.w ?? 400).toString() + "px";
        }

        get Height(): string {
            return (this.h ?? 120).toString() + "px";
        }

        get BoxWidth(): string {
            const w = (this.w ?? 400) - ((this.data?.length ?? 0) - 1) * 12 - 40;
            return (w / (this.data?.length ?? 1)).toString() + "px";
        }

        get TitleFS(): string {
            return (this.titleFS ?? 16).toString() + "px";
        }

        get LabelFS(): string {
            return (this.labelFS ?? 14).toString() + "px";
        }

        get ValueFS(): string {
            return (this.valueFS ?? 30).toString() + "px";
        }

        get DataSet(): { title: string, value: string, color: string }[] {
            return this.data?.Map(([title, v, color]) => {
                if (typeof (v) == "string") {
                    const value = v as string;
                    return {title, value, color}
                } else {
                    const value = Commarize((v as number).toFixed(1).ToFloat());
                    return {title, value, color}
                }
            }) ?? [];
        }
    }
</script>
