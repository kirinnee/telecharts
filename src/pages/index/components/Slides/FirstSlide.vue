<template>
    <div class="holder">
        <Button class="b" @click.native="Next" text="Get Started"/>
        <Button class="b" @click.native="Last" text="I already have my Telegram logs"/>
        <Button class="b" @click.native="Demo" text="Demo"/>
    </div>
</template>

<style lang='scss' scoped>
    .holder {
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-content: center;
        justify-items: center;
    }

    .b {
        width: 20%;
    }


</style>

<script lang='ts'>
    import {Component} from 'vue-property-decorator';
    import Base from "../Base.vue";
    import Button from "../Button.vue";

    @Component({
        components: {Button}
    })
    export default class FirstSlide extends Base {
        Main: any;

        Next() {
            this.Main.GoToSlide(1);
        }


        Last() {
            this.Main.GoToSlide(7);
        }

        Demo() {
            this.Main.insta = true;
            this.Main.GoToSlide(7);
        }
    }
</script>
