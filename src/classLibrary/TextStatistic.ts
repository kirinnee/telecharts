import {Updatable} from "./Updatable";
import {Message} from "./Message";
import {SafeNumber} from "./Utility";

class TextStatistic implements Updatable {
    stats: TextStats = {
        totalWords: 0,
        totalCharacters: 0,
        totalEmoji: 0,
        totalHeart: 0,

        averageMessagePerMonth: 0,
        averageMessagePerDay: 0,

        averageHeartPerMonth: 0,
        averageHeartPerDay: 0,
        averageHeartPerMessage: 0,

        averageWordPerMonth: 0,
        averageWordPerDay: 0,
        averageWordPerMessage: 0,

        averageCharacterPerMonth: 0,
        averageCharacterPerDay: 0,
        averageCharacterPerMessage: 0,

        averageEmojiPerDay: 0,
        averageEmojiPerMessage: 0,
        averageEmojiPerMonth: 0,
    };

    Set(textMessages: Message[], months: number, days: number): void {

        const count = textMessages.length;
        if (count > 0) {
            this.stats.totalWords = textMessages.Sum(x => x.words);
            this.stats.totalCharacters = textMessages.Sum(x => x.characters);
            this.stats.totalEmoji = textMessages.Sum(x => x.emojiCount);
            this.stats.totalHeart = textMessages.Sum(x => x.heartCount);


            this.stats.averageMessagePerMonth = SafeNumber(count / months);

            this.stats.averageMessagePerDay = SafeNumber(count / days);

            this.stats.averageHeartPerMonth = SafeNumber(this.stats.totalHeart / months);
            this.stats.averageHeartPerDay = SafeNumber(this.stats.totalHeart / days);
            this.stats.averageHeartPerMessage = this.stats.totalHeart / count;

            this.stats.averageWordPerMonth = SafeNumber(this.stats.totalWords / months);
            this.stats.averageWordPerDay = SafeNumber(this.stats.totalWords / days);
            this.stats.averageWordPerMessage = this.stats.totalWords / count;


            this.stats.averageCharacterPerMonth = SafeNumber(this.stats.totalCharacters / months);
            this.stats.averageCharacterPerDay = SafeNumber(this.stats.totalCharacters / days);
            this.stats.averageCharacterPerMessage = this.stats.totalCharacters / count;

            this.stats.averageEmojiPerMonth = SafeNumber(this.stats.totalEmoji / months);
            this.stats.averageEmojiPerDay = SafeNumber(this.stats.totalEmoji / days);
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
        } else {

            this.stats.totalWords = 0;
            this.stats.totalEmoji = 0;
            this.stats.totalHeart = 0;
            this.stats.totalCharacters = 0;

            this.stats.averageMessagePerMonth = 0;
            this.stats.averageMessagePerDay = 0;

            this.stats.averageHeartPerMonth = 0;
            this.stats.averageHeartPerDay = 0;
            this.stats.averageHeartPerMessage = 0;

            this.stats.averageWordPerMonth = 0;
            this.stats.averageWordPerDay = 0;
            this.stats.averageWordPerMessage = 0;

            this.stats.averageCharacterPerMonth = 0;
            this.stats.averageCharacterPerDay = 0;
            this.stats.averageCharacterPerMessage = 0;

            this.stats.averageEmojiPerDay = 0;
            this.stats.averageEmojiPerMessage = 0;
            this.stats.averageEmojiPerMonth = 0;

            delete this.stats.highestHeartMessage;
            delete this.stats.highestWordCount;
            delete this.stats.highestCharacterCount;
            delete this.stats.highestEmojiCount;

        }


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
    averageMessagePerDay: number;

    averageHeartPerMonth: number;
    averageHeartPerDay: number;
    averageHeartPerMessage: number;

    averageWordPerMonth: number;
    averageWordPerDay: number;
    averageWordPerMessage: number;

    averageCharacterPerMonth: number;
    averageCharacterPerDay: number;
    averageCharacterPerMessage: number;

    averageEmojiPerDay: number;
    averageEmojiPerMessage: number;
    averageEmojiPerMonth: number;


    highestWordCount?: Message;
    highestCharacterCount?: Message;
    highestEmojiCount?: Message;
    highestHeartMessage?: Message;
}

export {TextStatistic, TextStats}