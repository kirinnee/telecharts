import {Updatable} from "./Updatable";
import {RawMessageData} from "./MessageData";

class MessageTypeStatistic implements Updatable {

    text: number = 400;
    photo: number = 90;
    audio: number = 26;
    video: number = 15;
    nonAnimatedSticker: number = 100;
    animatedSticker: number = 25;
    document: number = 13;

    Set(data: RawMessageData): void {
        this.text = data.text.length;
        this.photo = data.photo.length;
        this.audio = data.audio.length;
        this.video = data.video.length;
        this.animatedSticker = data.animatedSticker.length;
        this.nonAnimatedSticker = data.nonAnimatedSticker.length;
        this.document = data.document.length;
    }

    get Sticker(): number {
        return this.nonAnimatedSticker + this.animatedSticker;
    }

    get Total(): number {
        return this.photo +
            this.audio +
            this.video +
            this.Sticker +
            this.document +
            this.text;
    }

    get Updated(): MessageTypeStats {
        return {
            total: this.Total,
            text: this.text,
            photo: this.photo,
            audio: this.audio,
            video: this.video,
            animatedSticker: this.animatedSticker,
            nonAnimatedSticker: this.nonAnimatedSticker,
            sticker: this.Sticker,
            document: this.document,
        }
    }
}


interface MessageTypeStats {
    total: number;
    text: number;
    photo: number;
    audio: number;
    video: number;
    nonAnimatedSticker: number;
    animatedSticker: number;
    sticker: number;
    document: number;
}


export {MessageTypeStatistic, MessageTypeStats}