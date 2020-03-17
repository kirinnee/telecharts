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
    call: Message[];
    missedCall: Message[];
    cancelledCall: Message[];
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


export {MessageData, UserData, RawMessageData, GDMessageData}