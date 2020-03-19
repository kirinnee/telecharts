import {Message} from "./Message";
import {core} from "../pages/index/init";
import {SortType} from "@kirinnee/core";
import {SafeNumber} from "./Utility";

class EmojiDataSet {
    LeaderBoard: EmojiData[] = [];

    Set(messages: Message[]): void {

        const emojis: { [s: string]: number } = {};
        messages.Each((a) => {

            for (let k in a.emoji) {
                if (a.emoji.hasOwnProperty(k)) {
                    if (emojis[k] == null) {
                        emojis[k] = a.emoji[k]
                    } else {
                        emojis[k] += a.emoji[k];
                    }
                }
            }
        });

        this.LeaderBoard = core.FlattenObject(emojis)
            .Arr()
            .Map(([k, v]) => {
                return {emoji: k, value: v, percentage: 0} as EmojiData
            })
            .Sort(SortType.Descending, ds => ds.value);
        if (this.LeaderBoard.length > 0) {
            const total = this.LeaderBoard.Sum(t => t.value);
            this.LeaderBoard = this.LeaderBoard.Each(e => e.percentage = (SafeNumber(e.value / total)) * 100)
        }
    }
}

interface EmojiData {
    emoji: string;
    value: number;
    percentage: number;
}

export {EmojiDataSet, EmojiData}