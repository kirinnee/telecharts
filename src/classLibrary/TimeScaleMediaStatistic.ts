import {Updatable} from "./Updatable";
import {Message} from "./Message";

class TimeScaleMediaStatistic implements TimeScaleMediaStats, Updatable {
    photo: number[] = [];
    sticker: number[] = [];
    document: number[] = [];
    video: number[] = [];
    audio: number[] = [];

    Set(photo: Message[], audio: Message[], video: Message[], document: Message[], sticker: Message[], start: Date, days: number, months: number) {
        this.photo = [].Fill(days + 1, () => 0);
        this.sticker = [].Fill(days + 1, () => 0);
        this.document = [].Fill(days + 1, () => 0);
        this.video = [].Fill(days + 1, () => 0);
        this.audio = [].Fill(days + 1, () => 0);

        const dayFromEpoch = (d: Date): number => ((d as any as number) / 8.64e7).Floor();
        const dayZero = dayFromEpoch(start);

        const hof = (key: string) => {
            return (m: Message) => {
                const day = dayFromEpoch(m.time) - dayZero;
                (this as any)[key][day]++;
            }
        };
        ([
            ['photo', photo],
            ['sticker', sticker],
            ['document', document],
            ['video', video],
            ['audio', audio]
        ] as [string, Message[]][])
            .Map(([s, a]) => [hof(s), a])
            .Each(([func, arr]) => (arr as Message[]).Each(func as (m: Message) => void));
    }

    get Updated(): TimeScaleMediaStats {
        return this;
    }

}

interface TimeScaleMediaStats {
    photo: number[];
    sticker: number[];
    document: number[];
    video: number[];
    audio: number[];
}

export {TimeScaleMediaStatistic}