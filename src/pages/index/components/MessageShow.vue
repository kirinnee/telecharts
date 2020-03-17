<template>
    <div class="top">
        <div class="message">
            <div class="top-bar">
                <div class="title">
                    <div class="name">{{Name}}</div>
                    <div class="handle">{{Handle}}</div>
                </div>
                <div>{{Day}}</div>
            </div>

            <div class="content">

                {{Text}}
            </div>
            <div class="time">{{Time}}</div>
        </div>
        <div @click="Close" class="exit">CLOSE</div>
    </div>
</template>

<style lang='scss' scoped>
    .top {

        .top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .content {
            padding-top: 10px;
            text-align: justify;
            overflow-y: auto;
            max-height: 70vh;
        }

        .time {
            /*position: absolute;*/
            align-self: end;
            right: 0;
            color: #9c9c9c;
        }

        .exit {
            user-select: none;
            cursor: pointer;
            border: 1px solid #9c9c9c;
            padding: 12px 24px;
            transition: background-color 0.2s;
            align-self: center;

            &:hover {
                background-color: #9c9c9c20;
            }
        }

        .title {
            display: flex;
            align-items: center;

            .name {
                font-weight: bold;
                font-family: "Roboto", sans-serif;
                font-size: 25px;
            }

            .handle {
                margin: 0 10px;
                color: #9c9c9c
            }

        }

        .message {
            display: flex;
            flex-direction: column;
        }

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px;
        position: fixed;
        width: 600px;
        min-height: 300px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        z-index: 100;
        box-shadow: 2px 2px 5px 5px #00000088;
        border-radius: 5px;

    }

</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {Message} from "../../../classLibrary/Message";

    @Component({
        props: {
            message: Object
        }
    })
    export default class MessageShow extends Vue {

        message?: Message;

        get Name(): string {
            return this.message?.sender ?? "No Name";
        }

        get Handle(): string {
            return this.message?.handle ?? "No Handle";
        }

        get Text(): string {
            return this.message?.text ?? "Empty Message";

        }

        get Day(): string {
            return this.message?.time.toLocaleDateString("en-US", {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }) ?? "00 Zero 0000"
        }


        get Time(): string {
            return this.message?.time.toLocaleTimeString('en-US') ?? "00:00"
        }

        Close() {
            (this.$parent as any).ShowText(false);
        }
    }
</script>
