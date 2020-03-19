<template>
    <div class="c-holder" :style="{width: Width, height: Height}">
        <div class="title">Comparison of</div>
        <div class="top">
            <div class="box left">
                <div class="color left" :style="{background: Col1}"></div>
                <div class="value left">
                    <div class="name left">{{user1}}</div>
                    <div class="handle left">@{{handle1}}</div>
                </div>
            </div>
            <div class="and">AND</div>
            <div class="box right">
                <div class="value right">
                    <div class="name right">{{user2}}</div>
                    <div class="handle right">@{{handle2}}</div>
                </div>
                <div class="color right" :style="{background: Col2}"></div>

            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>

    .title {
        color: #9c9c9c;
        margin: 10px 20px;
        text-transform: uppercase;
        text-align: center;
    }

    .and {
        font-size: 20px;
        margin: 0 10px;
    }


    .box {
        margin: 5px 15px;
        display: flex;
        align-items: center;


        .left {
            text-align: left;
        }

        .right {
            text-align: right;
        }

        .name {
            font-family: "Roboto Light", sans-serif;
            font-size: 16px;
            text-transform: uppercase;
            font-weight: bold;
        }

        .handle {
            font-size: 14px;
            color: #00000088;
        }

        $s: 40px;

        .color {
            margin: 0 10px;
            border-radius: 50%;
            width: $s;
            height: $s;
        }
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .c-holder {
        position: relative;
        background-color: white;
        border-radius: 5px;
        box-shadow: 1px 1px 4px 4px rgba(136, 136, 136, 0.1);
    }
</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        props: {
            w: Number,
            h: Number,
            user1: String,
            user2: String,
            handle1: String,
            handle2: String,
            color1: String,
            color2: String,
        }
    })
    export default class ComparisonHeader extends Vue {
        w?: number;
        h?: number;
        color1?: string;
        color2?: string;

        get Width(): string {
            return (this.w ?? 800).toString() + 'px';
        }

        get Height(): string {
            return (this.h ?? 120).toString() + 'px';
        }

        get Col1(): string {
            return this.color1 ?? '#5a8dee';
        }

        get Col2(): string {
            return this.color2 ?? '#ff5b5c';
        }


    }
</script>
