import {Message} from "./Message";

interface MessageData {
    user1: UserData;
    user2: UserData;
    messages: Message[];
    start: Date;
    end: Date;
}

interface UserData {
    name: string;
    handle: string;
}

interface RawMessageData {
    all: Message[];
    text: Message[];
    photo: Message[];
    audio: Message[];
    document: Message[];
    video: Message[];
    animatedSticker: Message[];
    nonAnimatedSticker: Message[];
}

function BreakdownMessage(messages: Message[]): RawMessageData {
    const text: Message[] = [];
    const photo: Message[] = [];
    const audio: Message[] = [];
    const document: Message[] = [];
    const video: Message[] = [];
    const animatedSticker: Message[] = [];
    const nonAnimatedSticker: Message[] = [];

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
            default:
                break;
        }
    });
    return {
        all: messages,
        text, photo, audio, document, nonAnimatedSticker, animatedSticker, video
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


const GDUserData = (): UserData => {
    return {
        name: "",
        handle: "",
    }
};

const GDMessageData = (): MessageData => {
    return {
        user1: GDUserData(),
        user2: GDUserData(),
        messages: [],
        start: new Date(),
        end: new Date(),
    }
};


export {MessageData, UserData, RawMessageData, GDMessageData, BreakdownMessage, SplitUser}