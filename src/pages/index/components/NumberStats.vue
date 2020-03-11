<template>
    <div class="c-holder">
        <div class="title">{{title}}</div>
        <div class="value">{{Display}}</div>
    </div>
</template>

<style lang='scss' scoped>
    .c-holder {
        width: 270px;
        height: 140px;
        position: relative;
        background-color: white;
        border-radius: 5px;

        .title {
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
        }
    })
    export default class NumberStats extends Vue {
        value?: number;

        get Display(): string {
            console.log(this.value);
            return Commarize(this.value!.toFixed(2).ToFloat());
        }
    }
</script>
