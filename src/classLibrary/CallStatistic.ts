import {Updatable} from "./Updatable";
import {Message} from "./Message";

class CallStatistic implements Updatable {
    stats: CallStats = {
        calls: 1,
        missed: 1,

        totalDuration: 1,
        averageDuration: 1,

        callsPerMonth: 1,
        callsPerDay: 1,

        longestCall: undefined,
        shortestCall: undefined,

        averageDurationPerDay: 1,
        averageDurationPerMonth: 1,
    };

    Set(calls: Message[], missed: Message[], months: number, days: number) {
        this.stats.missed = missed.length;
        this.stats.calls = calls.length;

        this.stats.totalDuration = calls.Sum(x => x.callDuration.TotalMinutes);
        this.stats.averageDuration = this.stats.totalDuration / calls.length;

        this.stats.callsPerMonth = this.stats.calls / months;
        this.stats.callsPerDay = this.stats.calls / days;

        this.stats.longestCall = calls.Max(x => x.callDuration.TotalMinutes);
        if (this.stats.longestCall.callDuration.TotalMinutes < 1) {
            delete this.stats.longestCall;
        }
        this.stats.shortestCall = calls.Min(x => x.callDuration.TotalMinutes);
        if (this.stats.shortestCall.callDuration.TotalMinutes < 1) {
            delete this.stats.shortestCall;
        }


        this.stats.averageDurationPerDay
    }

    get Updated(): CallStats {
        return this.stats;
    };
}

interface CallStats {

    calls: number;
    missed: number;

    totalDuration: number;
    averageDuration: number;

    callsPerMonth: number;
    callsPerDay: number;

    longestCall?: Message;
    shortestCall?: Message;

    averageDurationPerDay: number;
    averageDurationPerMonth: number;

}

export {CallStatistic}