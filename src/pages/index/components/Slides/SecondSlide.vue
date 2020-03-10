<template>
    <div class="holder">
        <h1>Save Telegram Chat History</h1>
        <div>Install "Save Telegram Chat History" chrome extension on Chrome <a
                href="https://chrome.google.com/webstore/detail/save-telegram-chat-histor/kgldnbjoeinkkgpphaaljlfhfdbndfjc"
                target="_blank">here</a>. This is only available on Chrome.
        </div>
        <img :src="one" alt="first step"/>
        <div class="b-holder">
            <Button class="button" @click.native="Back" text="Back"/>
            <Button class="button" @click.native="Next" text="Next"/>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .holder {
        color: white;
        font-family: 'Raleway', sans-serif;
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-content: center;
        justify-items: center;

        .b-holder {
            display: flex;
        }

        div {
            margin: 30px;
        }

        img {
            margin: 30px;
            height: 30%;
        }
    }

    .b {
        width: 10%;
    }
</style>

<script lang='ts'>
    import {Component} from 'vue-property-decorator';
    import {images} from "../../index";
    import Base from "../Base.vue";
    import Button from "../Button.vue";

    @Component({
        components: {Button}
    })
    export default class SecondSlide extends Base {
        one: string = images.install.one;

        Next() {
            this.Main.GoToSlide(2);
        }

        Back() {
            this.Main.BackToSlide(0);
        }


    }
</script>
