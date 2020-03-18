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
            <MessageShow v-if='renderMessage' :message="renderedMessage"/>
            <div v-if="loaded" style="background-color: #fcfcfc; position: relative">

                <HistogramSlider
                        @finish="UpdateDate"
                        style="margin: 0 auto 10px auto"
                        :width="600"
                        :bar-height="40"
                        :bar-width="3"
                        :data="data"
                        :prettify="prettify"
                        :drag-interval="true"
                        :force-edges="false"


                        :min="start"
                        :max="end"/>
                <div class="nav-bar">
                    <div class="nav-ele" :class="All" @click="ToPage1">
                        <div class="nav-icon-holder"></div>
                        <div class="nav-item">All Users</div>
                    </div>
                    <div class="nav-ele" :class="First" @click="ToPage2">
                        <div class="nav-icon-holder"></div>
                        <div class="nav-item">{{messageData.user1.name}}</div>
                    </div>
                    <div class="nav-ele" :class="Second" @click="ToPage3">
                        <div class="nav-icon-holder"></div>
                        <div class="nav-item">{{messageData.user2.name}}</div>
                    </div>
                    <div class="nav-ele" :class="Compare" @click="ToPage4">
                        <div class="nav-icon-holder"></div>
                        <div class="nav-item">Comparison</div>
                    </div>
                </div>
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
                        <NumberStats title="Total Words Sent" :value="text.stats.totalWords" w="280px" h="140px"
                                     :fs="40"/>
                        <NumberStats title="Total Emojis Sent" :value="text.stats.totalEmoji" w="280px" h="140px"
                                     :fs="40"/>
                        <NumberStats title="Total Hearts Sent" :value="text.stats.totalHeart" w="280px" h="140px"
                                     :fs="40"/>
                    </div>
                </div>
                <div class="row">
                    <LineGraph ref="line1" title="Text per Day"
                               :data="textGraph.stats.days"
                               :keys="['message','averageWord']"

                               :bar="false"

                               :x-axis="DayRange"

                               :y-axis="['a','b']"
                               :line-style="{
                               message: {label: '# of Messages', yAxis: 'a',
                               color: '#ff6384', areaColor: '#ff638430', fill: true},
                               averageWord: {label: 'Avg Word / Message', yAxis:'b',
                                color: '#36a2eb', areaColor: '#36a2eb30', fill: true},
                           }"

                               :height="370"
                               :width="660"
                    />
                    <LineGraph ref="line2" title="Daily Text Statistics"
                               :data="textGraph.stats.dayOfWeek"
                               :keys="['message','averageWord']"

                               :bar="true"


                               :x-axis="['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']"

                               :y-axis="['a','b']"
                               :line-style="{
                               message: {label: '# of Messages', yAxis: 'a',
                               color: '#7ad0d0', areaColor: '#7ad0d030', fill: true},
                               averageWord: {label: 'Avg Word / Message', yAxis: 'b',
                               color: '#ffa74f', areaColor: '#ffa74f30', fill: true},
                           }"

                               :height="370"
                               :width="660"
                    />
                    <LineGraph ref="line3" title="Hearts and Emoji Per Day"

                               :bar="false"

                               :data="textGraph.stats.days"
                               :keys="['emoji','heart']"

                               :x-axis="DayRange"


                               :y-axis="['a','b']"
                               :line-style="{
                               emoji: {label: '# of Emoji', yAxis: 'a',
                               color: '#fed062', areaColor: '#fed06230', fill: false, straight: true},
                               heart: {label: '# of Hearts',yAxis: 'b',
                               color: '#ba97ff', areaColor: '#ba97ff30', fill: false, straight: true},
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
                    <LineGraph
                            ref="line4" title="Text on Different hours of the day"
                            :data="textGraph.stats.hours"
                            :keys="['message','averageWord']"

                            :bar="true"
                            :x-axis-all="true"

                            :x-axis="['0000 - 0059', '0100 - 0159', '0200 - 0259', '0300 - 0359', '0400 - 0459', '0500 - 0559', '0600 - 0659',
                            '0700 - 0759', '0800 - 0859', '0900 - 0959', '1000 - 1059', '1100 - 1159', '1200 - 1259', '1300 - 1359',
                                                        '1400 - 1459', '1500 - 1559', '1600 - 1659', '1700 - 1759', '1800 - 1859', '1900 - 1959', '2000 - 2059'
                                                        , '2100 - 2159', '2200 - 2259', '2300 - 2359'
                            ]"

                            :y-axis="['a','b']"
                            :line-style="{
                               message: {label: '# of Messages', yAxis: 'a',
                               color: '#ff6384', areaColor: '#ff638430', fill: true},
                               averageWord: {label: 'Avg Word / Message', yAxis: 'b',
                               color: '#36a2eb', areaColor: '#36a2eb30', fill: false, straight: true, type: 'line', pointStyle: 'star'}
                            }"

                            :height="465"
                            :width="900"
                    />
                    <EmojiChart
                            :width="500" :height="465"
                            title="Most Used Emojis"
                            :emoji="emoji"
                    />
                </div>
                <div class="row">
                    <div class="c">
                        <div class="r b-margin">
                            <HighScores
                                    title="Highest Word Count"
                                    value="words"
                                    :message="text.stats.highestWordCount"
                                    units="words"

                                    w="240px"
                                    h="170px"
                                    :fs="34"
                            />
                            <HighScores
                                    title="Highest Character Count"
                                    value="characters"
                                    :message="text.stats.highestCharacterCount"
                                    units="Characters"

                                    w="240px"
                                    h="170px"
                                    :fs="34"
                            />
                            <HighScores
                                    title="Highest Emoji Count"
                                    value="emojiCount"
                                    :message="text.stats.highestEmojiCount"
                                    units="Emojis"

                                    w="240px"
                                    h="170px"
                                    :fs="34"
                            />
                            <HighScores
                                    title="Highest Heart Count"
                                    value="heartCount"
                                    :message="text.stats.highestHeartMessage"
                                    units="Hearts"

                                    w="240px"
                                    h="170px"
                                    :fs="34"
                            />
                        </div>
                        <LineGraph
                                ref="line5" title="Media Per Day"
                                :data="media"
                                :keys="['sticker','photo', 'document', 'video', 'audio']"

                                :bar="false"
                                :x-axis-all="false"

                                :x-axis="DayRange"
                                :y-axis="['a','b','c','d','e']"
                                :line-style="{
                                    sticker: {label: '# of Stickers', yAxis: 'a',
                                            color:'#36a2eb' , areaColor:'#36a2eb30' , fill: true,
                                            dash: [5,5], pointStyle: 'star'},
                                    photo: {label: '# of Photos', yAxis: 'b', straight: false,
                                            color: '#ff6384', areaColor:  '#ff638430', fill: false},
                                    document: {label: '# of Documents', yAxis: 'c', straight: false,
                                            color: '#ffce56', areaColor: '#ffce5630', fill: false},
                                    video: {label: '# of Videos', yAxis: 'd', straight: false,
                                            color: '#4bc0c0', areaColor: '#4bc0c030', fill: false},
                                    audio: {label: '# of Audios', yAxis: 'e', straight: false,
                                            color: '#9966ff', areaColor: '#9966ff30', fill: false},
                                }"

                                :height="560"
                                :width="1000"
                        />
                    </div>
                    <div class="c">
                        <div class="r" style="width: 987px">
                            <LineGraph
                                    ref="line6" title="Text per Month"
                                    :data="textGraph.stats.months"
                                    :keys="['message','averageWord', 'emoji','heart']"

                                    :bar="true"
                                    :x-axis-all="false"

                                    :x-axis="MonthRange"

                                    :y-axis="['a','b', 'c','d']"
                                    :line-style="{
                               averageWord: {label: 'Avg Word / Message', yAxis: 'b',
                                color: '#7ad0d0', areaColor: '#7ad0d030', fill: false, pointStyle: 'star'},
                               emoji: {label: '# of Emoji', yAxis: 'd',
                                color: '#fed062', areaColor: '#fed06290', fill: false},
                               heart: {label: '# of Hearts', yAxis: 'c',
                                color: '#ba97ff', areaColor: '#ba97ff90', fill: true},
                               message: {label: '# of Messages', yAxis: 'a', type: 'line',
                                color: '#475f7b', areaColor: '#475f7b30', fill: true},
                            }"

                                    :height="440"
                                    :width="550"
                            />
                            <div class="c">
                                <MultiStats
                                        title="Average Hearts"
                                        :w="425" :h="140"
                                        :label-f-s="12"
                                        :value-f-s="25"
                                        :data="[
                                        ['Per Month', text.stats.averageHeartPerMonth,'#5a8dee'],
                                        ['Per Day', text.stats.averageHeartPerDay, '#00cfdd'],
                                        ['Per Message', text.stats.averageHeartPerMessage,'#3adb8b'],
                                    ]"
                                />
                                <MultiStats
                                        title="Average Words"
                                        :w="425" :h="140"
                                        :label-f-s="12"
                                        :value-f-s="25"
                                        :data="[
                                        ['Per Month', text.stats.averageWordPerMonth,'#ff5b5c'],
                                        ['Per Day', text.stats.averageWordPerDay, '#fdac41'],
                                        ['Per Message', text.stats.averageWordPerMessage,'#475f7b'],
                                    ]"
                                />
                                <MultiStats
                                        title="Average Emojis"
                                        :w="425" :h="140"
                                        :label-f-s="12"
                                        :value-f-s="25"
                                        :data="[
                                        ['Per Month', text.stats.averageEmojiPerMonth,'#9771e3'],
                                        ['Per Day', text.stats.averageEmojiPerDay, '#22d676'],
                                        ['Per Message', text.stats.averageEmojiPerMessage,'#ff8426'],
                                    ]"
                                />
                            </div>
                        </div>
                        <div class="r" :style="{flexWrap: 'wrap', width: '987px' }">
                            <NumberStats v-for="(v,i) in Stats" :key="i" :style="{marginTop: '12px' }"
                                         :title="v.label" :text-val="v.value"
                                         w="235px"
                                         h="140px"
                                         :fs="30"/>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .nav-bar {
        display: flex;
        position: absolute;
        bottom: 0;
        left: 12px;

        .nav-ele {
            padding: 10px 20px;
            margin: 0 3px;
            background-color: rgb(243, 245, 249);
            user-select: none;
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
            border-top: 1px solid transparent;
            border-right: 1px solid transparent;
            border-left: 1px solid transparent;
            cursor: pointer;

            &:hover {
                border-top: 1px solid black;
                border-right: 1px solid black;
                border-left: 1px solid black;
            }
        }

        .selected {
            border-top: 1px solid black;
            border-right: 1px solid black;
            border-left: 1px solid black;
        }

        .nav-item {
            text-transform: uppercase;
            text-align: center;
            width: 100%;
        }

    }


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
    import {Message, MessageParser} from "../../../classLibrary/Message";
    import {MessageTypeStatistic} from "../../../classLibrary/MessageTypeStatistic";
    import PieChart from "./PieChart.vue";
    import PolarArea from "./PolarArea.vue";
    import {TextStatistic} from "../../../classLibrary/TextStatistic";
    import NumberStats from "./NumberStats.vue";
    import {GDMessageData, MessageData, RawMessageData} from "../../../classLibrary/MessageData";
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
    import {EmojiDataSet} from "../../../classLibrary/EmojiDataSet";
    import EmojiChart from "./EmojiChart.vue";
    import MessageShow from "./MessageShow.vue";
    import HighScores from "./HighScores.vue";
    import {TimeScaleMediaStatistic} from "../../../classLibrary/TimeScaleMediaStatistic";
    import MultiStats from "./MultiStats.vue";
    import {AudioStatistics} from "../../../classLibrary/AudioStatistics";


    enum Page {
        all,
        user1,
        user2,
        compare,
    }


    @Component({
        components: {MultiStats, HighScores, MessageShow, EmojiChart, LineGraph, NumberStats, PolarArea, PieChart}
    })

    export default class UploadLogs extends Vue {
        loader: string = "https://s3-ap-southeast-1.amazonaws.com/kirin.cyanprint/pages/index/assets/loader.c737d684624c881f486bf5b4b1fbc458.svg";
        upload = false;
        loaded = false;

        instaLoad = false;

        messageData: MessageData = GDMessageData();

        total: MessageTypeStatistic = new MessageTypeStatistic();
        text: TextStatistic = new TextStatistic();
        textGraph: TimeScaleTextStatistic = new TimeScaleTextStatistic();
        callNumbers: CallStatistic = new CallStatistic();
        emoji: EmojiDataSet = new EmojiDataSet();
        media: TimeScaleMediaStatistic = new TimeScaleMediaStatistic();
        audio: AudioStatistics = new AudioStatistics();

        data: Date[] = [];
        start: number = new Date(2019, 1, 1).valueOf();
        end: number = new Date().valueOf();

        renderedMessage: Message | undefined = undefined;
        renderMessage: boolean = false;

        currentStart: Date = new Date(this.start);
        currentEnd: Date = new Date(this.end);

        page: Page = Page.all;

        days: number = 0;
        months: number = 0;

        ToPage1() {
            this.page = Page.all;
            this.ReadjustData(this.currentStart, this.currentEnd);
        }


        ToPage2() {
            this.page = Page.user1;
            this.ReadjustData(this.currentStart, this.currentEnd);
        }


        ToPage3() {
            this.page = Page.user2;
            this.ReadjustData(this.currentStart, this.currentEnd);
        }


        ToPage4() {
            this.page = Page.compare;
            this.ReadjustData(this.currentStart, this.currentEnd);
        }

        get All(): string {
            return this.page == Page.all ? 'selected' : '';
        }

        get First(): string {
            return this.page == Page.user1 ? 'selected' : '';
        }


        get Second(): string {
            return this.page == Page.user2 ? 'selected' : '';
        }


        get Compare(): string {
            return this.page == Page.compare ? 'selected' : '';
        }


        ShowText(show: boolean, text?: Message) {
            this.renderMessage = show;
            this.renderedMessage = text;
        }

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

        // Event
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


            let all: RawMessageData = {
                all: [],
                text: [],
                photo: [],
                audio: [],
                document: [],
                video: [],
                animatedSticker: [],
                nonAnimatedSticker: [],
                call: [],
                missedCall: [],
                cancelledCall: []
            };

            if (this.page == Page.all) {
                all = BreakdownMessage(adjustedMessages);

            } else {
                const [u1, u2] = SplitUser(adjustedMessages, this.messageData.user1.name);
                if (this.page == Page.user1) {

                    all = BreakdownMessage(u1);
                } else if (this.page == Page.user2) {
                    all = BreakdownMessage(u2);

                }

            }
            this.text.Set(all.text, months, days);
            this.total.Set(all);
            this.textGraph.Set(all.text, start, days, months);
            this.callNumbers.Set(all.call, all.missedCall, all.cancelledCall, months, days);
            this.emoji.Set(all.text);
            this.media.Set(all.photo, all.audio, all.video, all.document, all.animatedSticker.Add(all.nonAnimatedSticker), start, days, months);
            this.audio.Set(all.audio, months, days);

            Vue.nextTick().then(() => {
                this.ReRenderAll();
            });

        }

        ReRenderAll() {
            ["pie1", "pie2", "pie3", "line1", "line2", "line3", "line4", "line5", "line6"]
                .Each(e => {
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
                (this.$parent as any).DashBoardColor();
                this.upload = true;
                this.HandleFileLoad({
                    target: {
                        result: convo
                    }
                });
            }
        }

        get Stats(): { label: string, value: string }[] {
            return [
                {
                    label: 'Number of Message / Month',
                    value: this.text.stats.averageMessagePerMonth.ToInt().toString()
                },
                {label: 'Number of Message / Day', value: this.text.stats.averageMessagePerDay.ToInt().toString()},
                {
                    label: 'Avg Call Duration',
                    value: this.callNumbers.stats.averageDuration.ToInt().toString() + " mins"
                },
                {
                    label: 'Call Duration / Day',
                    value: this.callNumbers.stats.averageDurationPerDay.toFixed(1) + " mins"
                },
                {
                    label: 'Call Duration / Month',
                    value: this.callNumbers.stats.averageDurationPerMonth.toFixed(1) + " mins"
                },
                {label: 'Total Audio Duration', value: this.audio.totalDuration},
                {label: 'Avg Audio Duration', value: this.audio.avgDuration},
                {label: 'Audio Duration / Day', value: this.audio.avgDurationPerDay},
                // {label: 'Audio Duration / Month', value: this.audio.avgDurationPerMonth},
            ];
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
