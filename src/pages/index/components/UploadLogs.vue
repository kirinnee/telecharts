<template>
    <div class="holder">
        <div v-show="!upload&&!loaded" class="holder">
            <h1>Analyze Conversation</h1>
            <div>
                Upload the Telegram log you have saved and you can see the breakdown of your conversation.
            </div>
            <div>
                This is completely client-sided application, it can work without internet, and everything you
                uploaded is completely stored only your computer.
            </div>
            <input id="input" type="file" @change="LoadText">
        </div>
        <div v-show="upload&&!loaded" class="holder">
            <div>Processing your conversation...</div>
            <img :src="loader" class="loader">
        </div>
        <div v-show="upload&&loaded" class="statistics">

            <div v-if="loaded">
                <HistogramSlider
                        @finish="UpdateDate"
                        style="margin: 20px auto"
                        :width="600"
                        :bar-height="100"
                        :data="data"
                        :prettify="prettify"
                        :drag-interval="true"
                        :force-edges="false"


                        :min="start"
                        :max="end"/>
            </div>
            <div class="row1">
                <div class="numbers">
                    <NumberStats title="Months" :value="months" w="340px" h="215px" fs="70px"/>
                    <NumberStats title="Days" :value="days" w="340px" h="215px" fs="70px"/>
                </div>
                <PieChart class="conversation" ref="pie1" :width="670" :height="450"
                          title="Conversation Breakdown"
                          :labels="['Text', 'Photo', 'Audio', 'Document', 'Videos', 'Sticker']"
                          :keys="['text','photo','audio','document','video', 'sticker']"
                          :colors="['#ff6384','#36a2eb','#ffce56','#4bc0c0','#9966ff','#ff9f40']"
                          :data="total"
                          total="Messages"/>
                <PolarArea class="media" ref="pie2" :width="670" :height="450"
                           title="Media Breakdown"
                           :labels="['Photo',  'Document','Audio', 'Animated Stickers', 'Normal Stickers' , 'Videos' ]"
                           :keys="['photo','document','audio','animatedSticker', 'nonAnimatedSticker', 'video' ]"
                           :colors="['#ffce56','#4bc0c0','#9966ff','#ff9f40','#ff6384','#36a2eb']"
                           :data="total"/>
                <div class="numbers">
                    <NumberStats title="Total Words Sent" :value="totalText.stats.totalWords" w="280px" h="140px"
                                 fs="40px"/>
                    <NumberStats title="Total Emojis Sent" :value="totalText.stats.totalEmoji" w="280px" h="140px"
                                 fs="40px"/>
                    <NumberStats title="Total Hearts Sent" :value="totalText.stats.totalHeart" w="280px" h="140px"
                                 fs="40px"/>
                </div>
                <!--                <div class="numbers">-->
                <!--                    <NumberStats title="Total Characters Sent" :value="totalText.stats.totalCharacters" w="260px" h="140px" fs="40px"/>-->
                <!--                    <NumberStats title="Total Emojis Sent" :value="totalText.stats.totalEmoji" w="260px" h="140px" fs="40px"/>-->
                <!--                    <NumberStats title="Total Hearts Sent" :value="totalText.stats.totalHeart" w="260px" h="140px" fs="40px"/>-->
                <!--                </div>-->

            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .holder {

        .row1 {
            display: flex;
            position: relative;
            justify-content: space-evenly;
        }


        .numbers {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .statistics {
            width: 100%;
            height: 100vh;
            overflow: scroll;
        }

        .loader {
            width: 160px;
            height: 160px;
        }

        color: black;
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


    }
</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {MessageParser} from "../../../classLibrary/Message";
    import {MessageTypeStatistic} from "../../../classLibrary/MessageTypeStatistic";
    import PieChart from "./PieChart.vue";
    import PolarArea from "./PolarArea.vue";
    import {TextStatistic} from "../../../classLibrary/TextStatistic";
    import NumberStats from "./NumberStats.vue";
    import {GDMessageData, MessageData} from "../../../classLibrary/MessageData";
    import {BreakdownMessage, GetDuration, SplitUser} from "../../../classLibrary/Utility";

    @Component({
        components: {NumberStats, PolarArea, PieChart}
    })
    export default class UploadLogs extends Vue {
        loader: string = "https://s3-ap-southeast-1.amazonaws.com/kirin.cyanprint/pages/index/assets/loader.c737d684624c881f486bf5b4b1fbc458.svg";
        upload = false;
        loaded = false;

        messageData: MessageData = GDMessageData();

        total: MessageTypeStatistic = new MessageTypeStatistic();
        totalText: TextStatistic = new TextStatistic();

        user1: MessageTypeStatistic = new MessageTypeStatistic();
        u1Text: TextStatistic = new TextStatistic();

        user2: MessageTypeStatistic = new MessageTypeStatistic();
        u2Text: TextStatistic = new TextStatistic();


        data: Date[] = [];
        start: number = new Date(2019, 1, 1).valueOf();
        end: number = new Date().valueOf();

        days: number = 0;
        months: number = 0;

        prettify(ts: any) {
            return new Date(ts).toLocaleDateString("en", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        }


        updated = true;

        UpdateDate(val: any) {
            const f = new Date(val.from);
            const t = new Date(val.to);
            this.ReadjustData(f, t);
        }

        ReadjustData(start: Date, end: Date): void {

            const adjustedMessages = this.messageData.messages
                .Where(x => x.time >= start && x.time <= end);

            const [u1, u2] = SplitUser(adjustedMessages, this.messageData.user1.name);
            const total = BreakdownMessage(adjustedMessages);
            const u1m = BreakdownMessage(u1);
            const u2m = BreakdownMessage(u2);

            const [_, months, days] = GetDuration(start, end);
            this.days = days;
            this.months = months;
            console.log(_);
            this.totalText.Set(total.text, months, days);
            this.u1Text.Set(u1m.text, months, days);
            this.u2Text.Set(u2m.text, months, days);

            this.total.Set(total);
            this.user1.Set(u1m);
            this.user2.Set(u2m);

            this.ReRenderAll();
        }

        ReRenderAll() {
            ["pie1", "pie2"].Each(e => {
                (this.$refs[e] as any).Rerender();
            });
        }


        LoadText(event: InputEvent) {
            const input: HTMLInputElement = event.target! as HTMLInputElement;
            if (input.files && input.files[0]) {
                this.upload = true;
                const reader = new FileReader();
                reader.onload = this.HandleFileLoad;
                reader.readAsText(input.files[0]);
            }
        }


        HandleFileLoad(event: any) {
            const [messages, user1, user2, handle1, handle2, dateStart, dateEnd] = MessageParser(event.target.result);

            // Setup Slider
            this.data = messages.Map(x => x.time);
            this.start = dateStart.valueOf();
            this.end = dateEnd.valueOf();

            // Pack Data
            this.messageData = {
                user1: {
                    name: user1,
                    handle: handle1,
                },
                user2: {
                    name: user2,
                    handle: handle2,
                },
                messages: messages,
                start: dateStart,
                end: dateEnd,
            };

            // Update Chart data
            this.ReadjustData(dateStart, dateEnd);
            this.ReRenderAll();

            setTimeout(() => this.loaded = true, 1000);
        }
    }
</script>
