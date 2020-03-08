<template>
    <div class="holder">
        <h1>Save Telegram Chat History</h1>
        <div> Click the extension icon at the top right corner
        </div>
        <img :src="image" alt="fifth step"/>
        <div class="b-holder">
            <Button class="b" text="Back" @click.native="Back"/>
            <Button class="b" text="Next" @click.native="Next"/>
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
            max-height: 30%;
        }
    }

    .b {
        width: 10%;
    }
</style>

<script lang='ts'>
    import {Component} from 'vue-property-decorator';
    import {images} from "../index";
    import Base from "./Base.vue";
    import Button from "./Button.vue";

    @Component({
        components: {Button}
    })
    export default class FifthSlide extends Base {
        image: string = images.install.five;

        Next() {
            this.Main.GoToSlide(5);
        }

        Back() {
            this.Main.BackToSlide(3);
        }
    }
</script>
