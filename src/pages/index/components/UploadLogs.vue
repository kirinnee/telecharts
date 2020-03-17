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
                        :bar-height="50"
                        :data="data"
                        :prettify="prettify"
                        :drag-interval="true"
                        :force-edges="false"


                        :min="start"
                        :max="end"/>
            </div>
            <div class="charts">
                <div class="row">
                    <div class="c">
                        <NumberStats title="Months" :value="months" w="340px" h="215px" :fs="70"/>
                        <NumberStats title="Days" :value="days" w="340px" h="215px" :fs="70"/>
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
                    <div class="c">
                        <NumberStats title="Total Words Sent" :value="totalText.stats.totalWords" w="280px" h="140px"
                                     :fs="40"/>
                        <NumberStats title="Total Emojis Sent" :value="totalText.stats.totalEmoji" w="280px" h="140px"
                                     :fs="40"/>
                        <NumberStats title="Total Hearts Sent" :value="totalText.stats.totalHeart" w="280px" h="140px"
                                     :fs="40"/>
                    </div>
                </div>
                <div class="row">
                    <LineGraph ref="line1" title="Text per Day"
                               :data="textGraph.stats.days"
                               :keys="['message','averageWord']"

                               :bar="false"

                               :x-axis="DayRange"

                               :line-style="{
                               message: {label: 'Number of Messages', color: '#ff6384', areaColor: '#ff638430', fill: true},
                               // emoji: {label: 'Number of Emojis', color: '#ff6384', areaColor: '#ff6384', fill: false},
                               averageWord: {label: 'Average Word Per Message', color: '#36a2eb', areaColor: '#36a2eb30', fill: true},
                           }"

                               :height="370"
                               :width="660"
                    />
                    <LineGraph ref="line2" title="Daily Statistics"
                               :data="textGraph.stats.dayOfWeek"
                               :keys="['message','averageWord']"

                               :bar="true"


                               :x-axis="['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"

                               :line-style="{
                               message: {label: 'Number of Messages', color: '#7ad0d0', areaColor: '#7ad0d030', fill: true},
                               averageWord: {label: 'Average Word Per Message', color: '#ffa74f', areaColor: '#ffa74f30', fill: true},
                           }"

                               :height="370"
                               :width="660"
                    />
                    <LineGraph ref="line3" title="Hearts and Emoji Per Day"

                               :bar="false"

                               :data="textGraph.stats.days"
                               :keys="['emoji','heart']"

                               :x-axis="DayRange"

                               :line-style="{
                               emoji: {label: 'Number of Emoji', color: '#fed062', areaColor: '#fed06230', fill: false, straight: true},
                               heart: {label: 'Number of Hearts', color: '#ba97ff', areaColor: '#ba97ff30', fill: false, straight: true},
                           }"

                               :height="370"
                               :width="660"
                    />
                </div>
                <div class="row">
                    <div class="c">
                        <div class="r b-margin">
                            <NumberStats title="Minutes Called" :value="callNumbers.stats.totalDuration"
                                         w="181px"
                                         h="100px"
                                         :fs="24"/>
                            <NumberStats title="Longest Call"
                                         :text-val="callNumbers.stats.longestCallText"
                                         w="181px" h="100px"
                                         :fs="24"/>
                            <NumberStats title="Shortest Call"
                                         :text-val="callNumbers.stats.shortestCallText"
                                         w="181px"
                                         h="100px"
                                         :fs="24"/>
                        </div>
                        <div>
                            <PieChart ref="pie3" :width="570" :height="350"
                                      title="Call Breakdown"
                                      :labels="['Calls', 'Missed', 'Cancelled']"
                                      :keys="['calls','missed', 'cancelled']"
                                      :pie="true"
                                      :colors="['#36a2eb','#ffce56','#9966ff']"
                                      :data="callNumbers"
                                      total="Calls"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .holder {

        .row {
            margin: 12px 0;
            display: flex;
            position: relative;
            justify-content: space-evenly;
        }

        .b-margin {
            margin-bottom: 12px;
        }

        .r {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        .c {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .statistics {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;

            .charts {
                height: 100%;
                overflow-y: auto;
            }
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
    import {
        BreakdownMessage,
        GenerateDayRange,
        GenerateMonthRange,
        GetDuration,
        SplitUser
    } from "../../../classLibrary/Utility";
    import LineGraph from "./LineGraph.vue";
    import {TimeScaleTextStatistic} from "../../../classLibrary/TimeScaleTextStatistic";
    import {CallStatistic} from "../../../classLibrary/CallStatistic";
    import convo from "!!raw-loader!./sample.txt";


    enum Page {
        all,
        user1,
        user2,
        compare,
    }


    @Component({
        components: {LineGraph, NumberStats, PolarArea, PieChart}
    })

    export default class UploadLogs extends Vue {
        loader: string = "https://s3-ap-southeast-1.amazonaws.com/kirin.cyanprint/pages/index/assets/loader.c737d684624c881f486bf5b4b1fbc458.svg";
        upload = false;
        loaded = false;

        instaLoad = false;

        messageData: MessageData = GDMessageData();

        total: MessageTypeStatistic = new MessageTypeStatistic();
        totalText: TextStatistic = new TextStatistic();
        textGraph: TimeScaleTextStatistic = new TimeScaleTextStatistic();
        callNumbers: CallStatistic = new CallStatistic();

        user1: MessageTypeStatistic = new MessageTypeStatistic();
        u1Text: TextStatistic = new TextStatistic();
        u1TextGraph: TimeScaleTextStatistic = new TimeScaleTextStatistic();
        u1callNumbers: CallStatistic = new CallStatistic();

        user2: MessageTypeStatistic = new MessageTypeStatistic();
        u2Text: TextStatistic = new TextStatistic();
        u2TextGraph: TimeScaleTextStatistic = new TimeScaleTextStatistic();
        u2callNumbers: CallStatistic = new CallStatistic();


        data: Date[] = [];
        start: number = new Date(2019, 1, 1).valueOf();
        end: number = new Date().valueOf();

        currentStart: Date = new Date(this.start);
        currentEnd: Date = new Date(this.end);

        page: Page = Page.all;

        days: number = 0;
        months: number = 0;


        get DayRange(): string[] {
            return GenerateDayRange(this.currentStart, this.currentEnd).Map(x => x.toLocaleDateString("en-US", {
                day: 'numeric',
                month: 'short'
            }));
        }

        get MonthRange(): string[] {
            return GenerateMonthRange(this.currentStart, this.currentEnd);
        }

        prettify(ts: any) {
            return new Date(ts).toLocaleDateString("en", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        }

        UpdateDate(val: any) {
            const f = new Date(val.from);
            const t = new Date(val.to);
            this.ReadjustData(f, t);
        }

        ReadjustData(start: Date, end: Date): void {

            this.currentStart = start;
            this.currentEnd = end;

            const adjustedMessages = this.messageData.messages
                .Where(x => x.time >= start && x.time <= end);

            const [_, months, days] = GetDuration(start, end);

            console.log(_);
            this.days = days;
            this.months = months;


            if (this.page == Page.all) {

                const total = BreakdownMessage(adjustedMessages);
                this.totalText.Set(total.text, months, days);
                this.total.Set(total);
                this.textGraph.Set(total.text, start, days, months);
                this.callNumbers.Set(total.call, total.missedCall, total.cancelledCall, months, days);
            } else {
                const [u1, u2] = SplitUser(adjustedMessages, this.messageData.user1.name);

                if (this.page == Page.user1) {

                    const u1m = BreakdownMessage(u1);
                    this.u1Text.Set(u1m.text, months, days);
                    this.user1.Set(u1m);
                    this.u1TextGraph.Set(u1m.text, start, days, months);
                    this.u1callNumbers.Set(u1m.call, u1m.missedCall, u1m.cancelledCall, months, days);
                } else if (this.page == Page.user2) {

                    const u2m = BreakdownMessage(u2);
                    this.u2Text.Set(u2m.text, months, days);
                    this.user2.Set(u2m);
                    this.u2TextGraph.Set(u2m.text, start, days, months);
                    this.u2callNumbers.Set(u2m.call, u2m.missedCall, u2m.cancelledCall, months, days);
                }

            }

            Vue.nextTick().then(() => {
                this.ReRenderAll();
            });

        }

        ReRenderAll() {
            ["pie1", "pie2", "pie3", "line1", "line2", "line3"].Each(e => {
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

        mounted() {
            if (this.instaLoad) {
                this.upload = true;
                this.HandleFileLoad({
                    target: {
                        result: convo
                    }
                });
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

            setTimeout(() => {
                    this.loaded = true
                }, 1000
            );
        }
    }
</script>
