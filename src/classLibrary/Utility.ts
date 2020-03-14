import {Message} from "./Message";
import {RawMessageData} from "./MessageData";

function BreakdownMessage(messages: Message[]): RawMessageData {
    const text: Message[] = [];
    const photo: Message[] = [];
    const audio: Message[] = [];
    const document: Message[] = [];
    const video: Message[] = [];
    const animatedSticker: Message[] = [];
    const nonAnimatedSticker: Message[] = [];
    const call: Message[] = [];
    const missedCall: Message[] = [];

    messages.Each(e => {
        switch (e.type) {
            case "audio":
                audio.push(e);
                break;
            case "photo":
                photo.push(e);
                break;
            case "sticker":
                if (e.animated) {
                    animatedSticker.push(e);
                } else {
                    nonAnimatedSticker.push(e);
                }
                break;
            case "video":
                video.push(e);
                break;
            case "document":
                document.push(e);
                break;
            case "text":
                text.push(e);
                break;
            case "call":
                if (e.missed) {
                    missedCall.push(e);
                } else {
                    call.push(e);
                }
                break;
            default:
                break;
        }
    });
    return {
        all: messages,
        text,
        photo,
        audio,
        document,
        nonAnimatedSticker,
        animatedSticker,
        video,
        call,
        missedCall,
    }
}

function SplitUser(message: Message[], user1: string): [Message[], Message[]] {
    const u1: Message[] = [];
    const u2: Message[] = [];
    message.Each(e => {
        if (e.sender == user1) {
            u1.push(e)
        } else {
            u2.push(e);
        }
    });
    return [u1, u2];
}

function GetDuration(start: Date, end: Date): [number, number, number] {
    const years = end.getFullYear() - start.getFullYear();
    const months = years * 12 + end.getMonth() - start.getMonth();
    const ONE_DAY = 1000 * 60 * 60 * 24;

    const differenceMs = Math.abs(end as any as number - (start as any) as number);
    const days = Math.round(differenceMs / ONE_DAY);
    return [years, months, days];
}


export {SplitUser, BreakdownMessage, GetDuration}