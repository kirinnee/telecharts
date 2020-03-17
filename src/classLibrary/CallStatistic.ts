import {Updatable} from "./Updatable";
import {Message} from "./Message";
import {NumberFormatter} from "./Utility";

class CallStatistic implements Updatable {
    stats: CallStats = {
        calls: 0,
        missed: 0,
        cancelled: 0,

        totalDuration: 0,
        averageDuration: 0,

        callsPerMonth: 0,
        callsPerDay: 0,

        longestCall: undefined,
        shortestCall: undefined,

        shortestCallText: 'None',
        longestCallText: 'None',

        averageDurationPerDay: 0,
        averageDurationPerMonth: 0,
    };

    Set(calls: Message[], missed: Message[], cancelled: Message[], months: number, days: number) {
        this.stats.missed = missed.length;
        this.stats.calls = calls.length;
        this.stats.cancelled = cancelled.length;

        if (calls.length > 0) {
            this.stats.totalDuration = calls.Sum(x => x.callDuration.TotalMinutes);
            this.stats.averageDuration = this.stats.totalDuration / calls.length;

            this.stats.callsPerMonth = this.stats.calls / months || 0;
            this.stats.callsPerDay = this.stats.calls / days || 0;

            this.stats.longestCall = calls.Max(x => x.callDuration.TotalMinutes);
            if (this.stats.longestCall.callDuration.TotalMinutes < 1) {
                delete this.stats.longestCall;
            }
            this.stats.shortestCall = calls.Min(x => x.callDuration.TotalMinutes);
            if (this.stats.shortestCall.callDuration.TotalMinutes < 1) {
                delete this.stats.shortestCall;
            }


        } else {
            this.stats.calls = 0;
            this.stats.totalDuration = 0;
            this.stats.averageDuration = 0;
            this.stats.callsPerDay = 0;
            this.stats.callsPerMonth = 0;
            delete this.stats.longestCall;
            delete this.stats.shortestCall;
        }

        this.stats.averageDurationPerDay = this.stats.totalDuration / days || 0;
        this.stats.averageDurationPerMonth = this.stats.totalDuration / months || 0;

        this.stats.shortestCallText = NumberFormatter(this.stats.shortestCall?.callDuration.TotalMinutes, 'Mins', 'None');
        this.stats.longestCallText = NumberFormatter(this.stats.longestCall?.callDuration.TotalMinutes, 'Mins', 'None');

    }

    get Updated(): CallStats {
        return this.stats;
    };
}

interface CallStats {

    calls: number;
    missed: number;
    cancelled: number;

    totalDuration: number;
    averageDuration: number;

    callsPerMonth: number;
    callsPerDay: number;

    longestCall?: Message;
    shortestCall?: Message;

    longestCallText: string;
    shortestCallText: string;

    averageDurationPerDay: number;
    averageDurationPerMonth: number;

}

export {CallStatistic}