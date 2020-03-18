import {Updatable} from "./Updatable";
import {Message} from "./Message";

class AudioStatistics implements AudioStats, Updatable {
    get Updated(): AudioStats {
        return this;
    }

    total: number = 0;

    totalDuration: string = 'None';
    avgDuration: string = 'None';
    avgDurationPerDay: string = 'None';
    avgDurationPerMonth: string = 'None';

    Set(audio: Message[], months: number, days: number) {
        this.total = audio.length;
        if (this.total > 0) {

            const totalSeconds = audio.Sum(x => x.audioLength);
            const averageDuration = totalSeconds / this.total;
            const averageDurationPerDay = totalSeconds / days || 0;
            const averageDurationPerMonth = totalSeconds / months || 0;

            this.totalDuration = this.FormatSecondsToTime(totalSeconds);
            this.avgDuration = this.FormatSecondsToTime(averageDuration);
            this.avgDurationPerDay = this.FormatSecondsToTime(averageDurationPerDay);
            this.avgDurationPerMonth = this.FormatSecondsToTime(averageDurationPerMonth);

        } else {
            this.totalDuration = 'None';
            this.avgDuration = 'None';
            this.avgDurationPerDay = 'None';
            this.avgDurationPerMonth = 'None';
            this.total = 0;
        }
    }

    private divide(a: number, b: number): [number, number] {
        const val = (a / b).Floor();
        const counted = b * val;
        const remainder = a - counted;
        return [val, remainder];
    }

    private FormatSecondsToTime(s: number): string {
        const [hours, r1] = this.divide(s, 3600);
        const [minutes, seconds] = this.divide(r1, 60);

        let ret = '';
        let flag = false;
        if (hours > 0) {
            console.log(ret);
            ret += `${hours.ToInt()}hr `;
            flag = true;
        }
        if (minutes > 0 || flag) {
            console.log(ret);
            ret += `${minutes.ToInt()}min `;
            flag = true;
        }
        if (seconds > 0 || flag) {
            console.log(ret);
            ret += `${seconds.ToInt()}s`
        }
        console.log(ret);
        return ret;
    }
}


interface AudioStats {
    total: number;

    totalDuration: string;
    avgDuration: string;
    avgDurationPerDay: string;
    avgDurationPerMonth: string;
}

export {AudioStatistics, AudioStats}