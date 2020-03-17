<template>
    <div class="c-holder" :style="{width:w, height: h} ">

        <div class="title" :style="{fontSize: TitleFS}">{{title}}</div>
        <div class="v-holder">
            <div class="value" :style="{fontSize: MainFS}">{{Display}}</div>
            <div v-if='units.length>0 && message != null' class="unit" :style="{fontSize: UnitFS}"> {{units}}</div>
        </div>
        <div @click="ShowMessage" v-if='message != null' class="view">
            VIEW
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .c-holder {
        position: relative;
        background-color: white;
        border-radius: 5px;
        box-shadow: 1px 1px 4px 4px rgba(136, 136, 136, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .view {
            margin-bottom: 20px;
            font-size: 12px;
            font-family: "Raleway", sans-serif;
            text-transform: uppercase;
            padding: 6px 18px;
            border: 1px solid #00000000;
            color: white;
            background-color: #7498fb;
            border-radius: 5px;
            cursor: pointer;
            user-select: none;

            transition: background 0.4s;

            &:hover {
                background-color: #00000000;
                color: #7498fb;
                border: 1px solid #7498fb;
            }

        }

        .title {
            position: relative;
            padding: 20px;
            font-family: Raleway, sans-serif;
            color: rgba(0, 0, 0, 0.7);
            text-transform: uppercase;
        }

        .v-holder {
            position: absolute;
            top: 50%;
            transform: translateY(-70%);
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .value {
            font-family: Roboto, sans-serif;
        }

        .unit {
            font-family: Roboto, sans-serif;
            text-transform: uppercase;
            margin-left: 5px;
            color: #9c9c9c;
        }
    }
</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {Commarize} from "../init";
    import {Message} from "../../../classLibrary/Message";

    @Component({
        props: {
            title: String,
            units: String,
            message: Object,
            value: String,

            w: String,
            h: String,
            fs: Number,
        }
    })
    export default class NumberStats extends Vue {
        message?: Message;
        units?: string;
        fs?: number;
        value?: string;

        get MainFS(): string {
            return this.fs!.toString() + "px";
        }

        ShowMessage() {
            (this.$parent as any).ShowText(true, this.message);
        }

        get TitleFS(): string {
            return (this.fs! / 2.5).toString() + "px";
        }

        get UnitFS(): string {
            return (this.fs! - 25).toString() + "px";
        }

        get Display(): string {
            if (this.message == null) {
                return "NONE";
            } else {
                return Commarize(((this.message! as any)[this.value!] as number).toFixed(2).ToFloat());
            }

        }
    }
</script>
