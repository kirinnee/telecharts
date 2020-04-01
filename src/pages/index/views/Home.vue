<template>
    <div class="main" ref="color">
        <div class="app">
            <UploadLogs v-if='show[7]' :insta-load="insta" ref="upload" class="upload"/>
            <SeventhSlide v-if='show[6]' ref="seventh" class="seventh"/>
            <SixthSlide v-if='show[5]' ref="sixth" class="sixth"/>
            <FifthSlide v-if='show[4]' ref="fifth" class="fifth"/>
            <FourthSlide v-if='show[3]' ref="fourth" class="fourth"/>
            <ThirdSlide v-if='show[2]' ref="third" class="third"/>
            <SecondSlide v-if='show[1]' ref="second" class="second"/>
            <FirstSlide v-if='show[0]' ref="first" class="first"/>
        </div>
    </div>
</template>

<style lang="scss">

    .main {
        background-color: #30a3e6;
    }

    .app {

        width: 100%;
        height: 100vh;

        .second, .third, .fourth, .fifth, .sixth, .seventh,
        .upload {

            left: 100%;
            opacity: 0;
        }
    }

</style>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import FirstSlide from "../components/Slides/FirstSlide.vue";
    import SecondSlide from "../components/Slides/SecondSlide.vue";
    import ThirdSlide from "../components/Slides/ThirdSlide.vue";
    import {eases} from "../init";
    import {EaseStrength, kEasing} from "@kirinnee/kease";
    import FourthSlide from "../components/Slides/FourthSlide.vue";
    import SixthSlide from "../components/Slides/SixthSlide.vue";
    import FifthSlide from "../components/Slides/FifthSlide.vue";
    import SeventhSlide from "../components/Slides/SeventhSlide.vue";
    import UploadLogs from "../components/UploadLogs.vue";

    @Component({
        components: {SeventhSlide, FifthSlide, SixthSlide, FourthSlide, ThirdSlide, SecondSlide, FirstSlide, UploadLogs}
    })
    export default class HelloWorld extends Vue {

        current: number = 0;
        currentColor: string = "#30a3e6";

        show: boolean[] = [true, false, false, false, false, false, false, false];


        insta: boolean = false;


        get Colors(): string[] {
            return [
                "#3044e6",
                "#8b30e6",
                "#e630b0",
                "#e63052",
                "#30cce6",
                "#32bf48",
                "#69a116",
                "#e7a21e",
                "#30a3e6",
            ];
        }


        get Slides(): [FirstSlide, SecondSlide, ThirdSlide, FourthSlide, FifthSlide, SixthSlide, SeventhSlide, UploadLogs] {
            return [
                this.$refs["first"] as Vue,
                this.$refs["second"] as Vue,
                this.$refs["third"] as Vue,
                this.$refs["fourth"] as Vue,
                this.$refs["fifth"] as Vue,
                this.$refs["sixth"] as Vue,
                this.$refs["seventh"] as Vue,
                this.$refs["upload"] as Vue,
            ];
        }

        ChangeColor(ease: kEasing) {

            const main: Element = (this.$refs["color"] as Element);
            let nextColor: string = this.Colors.Random()!;
            while (nextColor == this.currentColor) {
                nextColor = this.Colors.Random()!;
            }
            main.BackgroundColor(this.currentColor, nextColor, {duration: 500, ease})
                .Promise.then(() => this.currentColor = nextColor);
        }

        DashBoardColor() {
            const swing = eases.Swing(EaseStrength.Linear);
            const main: Element = (this.$refs["color"] as Element);
            main.BackgroundColor(this.currentColor, "#f3f5f9", {duration: 500, ease: swing})
                .Promise.then(() => this.currentColor = "#f3f5f9");
        }

        GoToSlide(x: number) {
            const swing = eases.Swing(EaseStrength.Linear);
            Vue.set(this.show, x, true);
            if (x == 7) {
                this.DashBoardColor();
            } else {
                this.ChangeColor(swing);
            }
            Vue.nextTick().then(() => {
                this.Slides[this.current].$el
                    .X(0, "-100%", {duration: 500, ease: swing})
                    .Opacity(1, 0, {duration: 0});

                console.log(this.Slides);

                this.Slides[x].$el
                    .Opacity(0, 1, {duration: 0})
                    .X("100%", 0, {duration: 500, ease: swing})
                    .Promise.then(() => {
                    Vue.set(this.show, this.current, false);
                    this.current = x

                });
            });

        }

        BackToSlide(x: number) {
            const swing = eases.Swing(EaseStrength.Linear);
            Vue.set(this.show, x, true);
            this.ChangeColor(swing);
            Vue.nextTick().then(() => {
                this.Slides[this.current].$el
                    .X(0, "100%", {duration: 500, ease: swing})
                    .Opacity(1, 0, {duration: 0});

                this.Slides[x].$el
                    .Opacity(0, 1, {duration: 0})
                    .X("-100%", 0, {duration: 500, ease: swing})
                    .Promise.then(() => {
                    Vue.set(this.show, this.current, false);
                    this.current = x
                });
            });
        }

    }
</script>