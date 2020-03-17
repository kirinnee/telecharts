<template>
    <div class="c-holder" :style="{width:w, height: h} ">
        <div class="title" :style="{fontSize: TitleFS}">{{title}}</div>
        <div class="value" :style="{fontSize: MainFS}">{{Display}}</div>
    </div>
</template>

<style lang='scss' scoped>
    .c-holder {
        position: relative;
        background-color: white;
        border-radius: 5px;
        box-shadow: 1px 1px 4px 4px rgba(136, 136, 136, 0.1);

        .title {
            position: relative;
            padding: 20px;
            font-family: Raleway, sans-serif;
            color: rgba(0, 0, 0, 0.7);
            text-transform: uppercase;
        }

        .value {
            text-align: center;
            position: absolute;
            top: 50%;
            width: 100%;
            transform: translateY(-50%);
            margin: auto;
            font-family: Roboto, sans-serif;
            font-size: 40px;
        }
    }
</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {Commarize} from "../init";

    @Component({
        props: {
            title: String,
            value: Number,
            textVal: String,
            w: String,
            h: String,
            fs: Number,
        }
    })
    export default class NumberStats extends Vue {
        value?: number;
        textVal?: string;
        fs?: number;

        get MainFS(): string {
            return this.fs!.toString() + "px";
        }


        get TitleFS(): string {
            return (this.fs! / 2.5).toString() + "px";
        }

        get Display(): string {
            return this.textVal || Commarize(this.value!.toFixed(2).ToFloat());

        }
    }
</script>
