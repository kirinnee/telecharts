import {EaseStrength} from "@kirinnee/kease";
<template>
    <div class="main" ref="color">
        <div class="app">
            <UploadLogs ref="upload" class="upload"/>
            <SeventhSlide ref="seventh" class="seventh"/>
            <SixthSlide ref="sixth" class="sixth"/>
            <FifthSlide ref="fifth" class="fifth"/>
            <FourthSlide ref="fourth" class="fourth"/>
            <ThirdSlide ref="third" class="third"/>
            <SecondSlide ref="second" class="second"/>
            <FirstSlide ref="first" class="first"/>
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

        .second, .third, .fourth, .fifth, .sixth, .seventh, .upload {
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

        GoToSlide(x: number) {
            const swing = eases.Swing(EaseStrength.Linear);
            if (x == 7) {
                const main: Element = (this.$refs["color"] as Element);

                main.BackgroundColor(this.currentColor, "#f3f5f9", {duration: 500, ease: swing})
                    .Promise.then(() => this.currentColor = "#f3f5f9");
            } else {
                this.ChangeColor(swing);

            }
            this.Slides[this.current].$el
                .X(0, "-100%", {duration: 500, ease: swing})
                .Opacity(1, 0, {duration: 0});

            this.Slides[x].$el
                .Opacity(0, 1, {duration: 0})
                .X("100%", 0, {duration: 500, ease: swing})
                .Promise.then(() => {
                this.current = x
            });
        }

        BackToSlide(x: number) {
            const swing = eases.Swing(EaseStrength.Linear);
            this.ChangeColor(swing);
            this.Slides[this.current].$el
                .X(0, "100%", {duration: 500, ease: swing})
                .Opacity(1, 0, {duration: 0});

            this.Slides[x].$el
                .Opacity(0, 1, {duration: 0})
                .X("-100%", 0, {duration: 500, ease: swing})
                .Promise.then(() => {
                this.current = x
            });
        }

    }
</script>