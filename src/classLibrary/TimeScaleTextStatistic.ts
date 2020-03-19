import {Updatable} from "./Updatable";
import {Message} from "./Message";
import {SafeNumber} from "./Utility";

class TimeScaleTextStatistic implements Updatable {
    stats: TimeScaleTextStats = {

        days: new TimeTextStatistic({
            averageWord: [],
            emoji: [],
            message: [],
            heart: [],
        }),
        months: new TimeTextStatistic({
            averageWord: [],
            emoji: [],
            message: [],
            heart: [],
        }),
        // 0 is sunday, 6 is saturday
        dayOfWeek: new TimeTextStatistic({
            averageWord: [],
            emoji: [],
            message: [],
            heart: [],
        }),
        // 0 is midnight, 23 is 11pm
        hours: new TimeTextStatistic({
            averageWord: [],
            emoji: [],
            message: [],
            heart: [],
        }),
    };

    Set(text: Message[], start: Date, days: number, months: number) {
        (this.stats.days as TimeTextStatistic).Fill(days + 1);
        (this.stats.months as TimeTextStatistic).Fill(months);
        (this.stats.dayOfWeek as TimeTextStatistic).Fill(7);
        (this.stats.hours as TimeTextStatistic).Fill(24);

        const dayFromEpoch = (d: Date): number => ((d as any as number) / 8.64e7).Floor();
        const diffMonth = (d: Date): number => (d.getFullYear() - start.getFullYear()) * 12 + d.getMonth() - start.getMonth();

        const dayZero = dayFromEpoch(start);

        // Days
        let dayPrevIndex = 0;
        let dayTotal = 0;

        // Month
        let mPrevIndex = 0;
        let monthTotal = 0;

        const dow = [].Fill(7, () => 0);
        const dowCount = [].Fill(7, () => 0);
        const hours = [].Fill(24, () => 0);

        dowCount[start.getDay()] = 1;

        text.Each(e => {
            const t = e.time;
            const day = dayFromEpoch(t) - dayZero;
            const month = diffMonth(t);
            const dayOfWeek = t.getDay();
            const hour = t.getHours();

            // resolve day
            if (day != dayPrevIndex) {
                this.stats.days.averageWord[dayPrevIndex] = (dayTotal / this.stats.days.message[dayPrevIndex]).toFixed(2).ToFloat();
                dayTotal = 0;
                dayPrevIndex = day;
                dowCount[dayOfWeek
                    ]++;
            }
            this.stats.days.message[day]++;
            dayTotal += e.words;
            this.stats.days.emoji[day] += e.emojiCount;
            this.stats.days.heart[day] += e.heartCount;

            // resolve month
            if (month != mPrevIndex) {
                this.stats.months.averageWord[mPrevIndex] = (monthTotal / this.stats.months.message[mPrevIndex]).toFixed(2).ToFloat();
                monthTotal = 0;
                mPrevIndex = month;
            }
            this.stats.months.message[month]++;
            monthTotal += e.words;
            this.stats.months.emoji[month] += e.emojiCount;
            this.stats.months.heart[month] += e.heartCount;

            //resolve hours and weeks
            dow[dayOfWeek] += e.words;
            this.stats.dayOfWeek.message[dayOfWeek]++;
            this.stats.dayOfWeek.emoji[dayOfWeek] += e.emojiCount;
            this.stats.dayOfWeek.heart[dayOfWeek] += e.heartCount;

            hours[hour] += e.words;
            this.stats.hours.message[hour]++;
            this.stats.hours.emoji[hour] += e.emojiCount;
            this.stats.hours.heart[hour] += e.heartCount;


        });
        this.stats.days.averageWord[dayPrevIndex] = SafeNumber(dayTotal / this.stats.days.message[dayPrevIndex]).toFixed(2).ToFloat();
        this.stats.months.averageWord[mPrevIndex] = SafeNumber(monthTotal / this.stats.months.message[mPrevIndex]).toFixed(2).ToFloat();
        this.stats.dayOfWeek.averageWord = this.stats.dayOfWeek.message.Map((e, i) => (SafeNumber(dow[i] / e)).toFixed(2).ToFloat());

        this.stats.dayOfWeek.message = this.stats.dayOfWeek.message.Map((e, i) => (SafeNumber(e / dowCount[i])).toFixed(2).ToFloat());
        this.stats.hours.averageWord = this.stats.hours.message.Map((e, i) => (SafeNumber(hours[i] / e)).toFixed(2).ToFloat());
    }

    get Updated(): TimeScaleTextStats {
        return this.stats;
    }
}

class TimeTextStatistic implements Updatable, TextStat {
    get Updated(): TextStat {
        return this;
    }

    Fill(value: number): void {
        this.averageWord = [].Fill(value, () => 0);
        this.emoji = [].Fill(value, () => 0);
        this.message = [].Fill(value, () => 0);
        this.heart = [].Fill(value, () => 0);
    }

    averageWord: number[];
    emoji: number[];
    message: number[];
    heart: number[];

    constructor(t: TextStat) {
        this.averageWord = t.averageWord;
        this.emoji = t.emoji;
        this.message = t.message;
        this.heart = t.heart;
    }


}

interface TimeScaleTextStats {
    days: TextStat;
    months: TextStat;
    dayOfWeek: TextStat;
    hours: TextStat;
}

interface TextStat {
    message: number[];
    averageWord: number[];
    emoji: number[];
    heart: number[];
}

export {TimeScaleTextStats, TextStat, TimeScaleTextStatistic}