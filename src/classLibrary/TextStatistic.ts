import {Updatable} from "./Updatable";
import {Message} from "./Message";

class TextStatistic implements Updatable {
    stats: TextStats = {
        totalWords: 0,
        totalCharacters: 0,
        totalEmoji: 0,
        totalHeart: 0,

        averageMessagePerMonth: 0,
        averageHeartPerDay: 0,
        averageMessagePerDay: 0,
        averageWordCountPerMessage: 0,
        averageCharacterCountPerMessage: 0,
        averageEmojiPerMessage: 0,

    };

    Set(textMessages: Message[], start: Date, end: Date): void {
        this.stats.totalWords = textMessages.Sum(x => x.words);
        this.stats.totalCharacters = textMessages.Sum(x => x.characters);
        this.stats.totalEmoji = textMessages.Sum(x => x.emojiCount);
        this.stats.totalHeart = textMessages.Sum(x => x.heartCount);

        const years = end.getFullYear() - start.getFullYear();
        const months = years * 12 + end.getMonth() - start.getMonth();
        const ONE_DAY = 1000 * 60 * 60 * 24;
        const differenceMs = Math.abs(end.getMilliseconds() - start.getMilliseconds());
        const days = Math.round(differenceMs / ONE_DAY);

        const count = textMessages.length;

        this.stats.averageMessagePerMonth = count / months;
        this.stats.averageMessagePerDay = count / days;
        this.stats.averageWordCountPerMessage = this.stats.totalWords / count;
        this.stats.averageCharacterCountPerMessage = this.stats.totalCharacters / count;
        this.stats.averageEmojiPerMessage = this.stats.totalEmoji / count;

        this.stats.highestWordCount = textMessages.Max((x) => x.words);
        this.stats.highestCharacterCount = textMessages.Max((x) => x.characters);
        this.stats.highestEmojiCount = textMessages.Max((x) => x.emojiCount);
        this.stats.highestHeartMessage = textMessages.Max(x => x.heartCount);

        if (this.stats.highestHeartMessage.heartCount == 0)
            delete this.stats.highestHeartMessage;

        if (this.stats.highestWordCount.words == 0)
            delete this.stats.highestWordCount;

        if (this.stats.highestCharacterCount.characters == 0)
            delete this.stats.highestCharacterCount;


        if (this.stats.highestEmojiCount.emojiCount == 0)
            delete this.stats.highestEmojiCount;

    }

    get Updated(): TextStats {
        return this.stats;
    }
}

interface TextStats {
    totalWords: number;
    totalCharacters: number;
    totalEmoji: number;
    totalHeart: number;

    averageMessagePerMonth: number;
    averageHeartPerDay: number;
    averageMessagePerDay: number;
    averageWordCountPerMessage: number;
    averageCharacterCountPerMessage: number;
    averageEmojiPerMessage: number;

    highestWordCount?: Message;
    highestCharacterCount?: Message;
    highestEmojiCount?: Message;
    highestHeartMessage?: Message;
}

export {TextStatistic, TextStats}