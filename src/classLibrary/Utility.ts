import {CallType, Message} from "./Message";
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
    const cancelledCall: Message[] = [];

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
                switch (e.callType) {
                    case CallType.pass:
                        call.push(e);
                        break;
                    case CallType.missed:
                        missedCall.push(e);
                        break;
                    case CallType.cancel:
                        cancelledCall.push(e);
                        break;

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
        cancelledCall,
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

function GenerateDayRange(start: Date, end: Date): Date[] {
    let prev = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const ret = [];
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23);
    while (prev < last) {
        ret.push(prev);
        const clone = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate());
        clone.setDate(clone.getDate() + 1);
        prev = clone;
    }

    return ret;
}

function GenerateMonthRange(start: Date, end: Date): string[] {
    const ret = [];
    const prev = new Date(start.getFullYear(), start.getMonth());
    const last = new Date(end.getFullYear(), end.getMonth(), 29);
    const op = {year: 'numeric', month: 'long'};
    while (prev < last) {
        ret.push(prev.toLocaleDateString("en-US", op));
        prev.setMonth(prev.getMonth() + 1);
    }
    return ret;
}

function GetDuration(start: Date, end: Date): [number, number, number] {
    const years = end.getFullYear() - start.getFullYear();

    start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    end = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    const months = years * 12 + end.getMonth() - start.getMonth() + 1;

    const ONE_DAY = 1000 * 60 * 60 * 24;

    const differenceMs = Math.abs(end as any as number - (start as any) as number);
    const days = Math.round(differenceMs / ONE_DAY);
    return [years, months, days];
}

function NumberFormatter(i: number | null | undefined, unit: string, def: string): string {
    if (i == null) return def;
    else {
        return i!.toString() + " " + unit;
    }
}

export {SplitUser, BreakdownMessage, GetDuration, GenerateDayRange, GenerateMonthRange, NumberFormatter}