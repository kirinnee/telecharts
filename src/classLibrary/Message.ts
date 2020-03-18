const em = require("extract-emoji");

interface CallDuration {
    hour: number;
    minute: number;
    second: number;
    ColonFormat: string;
    TotalMinutes: number;
}

const nullCallDuration: CallDuration = {
    hour: -1,
    minute: -1,
    second: -1,
    ColonFormat: "",
    TotalMinutes: -1,
};

enum CallType {
    pass,
    missed,
    cancel,
}

class CallDurationClass implements CallDuration {

    hour: number;
    minute: number;
    second: number;

    constructor(hour: number, minute: number, second: number) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
    }

    get ColonFormat(): string {
        let ret = "";
        let startFlag = false;
        if (this.hour > 0) {
            ret += this.hour.toString() + ":";
            startFlag = true;
        }
        if (this.minute > 0 || startFlag) {
            ret += this.hour.toString() + ":";
            startFlag = true;
        }
        if (this.second > 0 || startFlag) {
            ret += this.hour.toString() + ":";
        }
        return ret;
    }

    get TotalMinutes(): number {
        return this.minute + this.hour * 60
    }


}

interface Message {
    type: "text" | "audio" | "photo" | "sticker" | "video" | "document" | "call"
    time: Date
    sender: string
    handle: string

    owner: boolean

    text: string
    characters: number
    words: number
    emoji: { [k: string]: number }
    emojiCount: number;
    heartCount: number;

    audioLength: number;

    callDuration: CallDuration;
    callType: CallType;

    animated: boolean;
}


function MessageParser(input: string): [Message[], string, string, string, string, Date, Date] {

    const messages: Message[] = [];
    let user1 = "";
    let user2 = "";
    let handle1 = "";
    let handle2 = "";
    let start = new Date();
    let end = new Date(1970, 1, 1);

    input.LineBreak()
        .Where(e => !e.IsEmpty())
        .Skip(1)
        .Each(e => {
            const raw = CheckMessage(e);
            if (raw != null) {
                const message: Message = {
                    type: "text",
                    owner: raw.owner,
                    time: raw.time,
                    sender: raw.sender,
                    handle: raw.handle,
                    text: raw.text,
                    characters: -1,
                    words: -1,
                    emoji: {},
                    emojiCount: 0,
                    heartCount: 0,
                    audioLength: -1,
                    callDuration: nullCallDuration,
                    callType: CallType.pass,
                    animated: false,
                };

                if (raw.owner) {
                    user1 = raw.sender;
                    handle1 = raw.handle;
                } else {
                    user2 = raw.sender;
                    handle2 = raw.handle;
                }

                if (raw.call) {
                    message.type = "call";
                    message.callType = raw.callType;
                    if (raw.callType == CallType.pass) {
                        message.callDuration = ExtractCallDuration(raw.text);
                    }
                } else if (CheckPhoto(raw.text)) {
                    message.type = "photo"
                } else if (CheckVideo(raw.text)) {
                    message.type = "video"
                } else if (CheckDocument(raw.text)) {
                    message.type = "document"
                } else {
                    const [sticker, animated] = CheckSticker(raw.text);
                    if (sticker) {
                        message.type = "sticker";
                        message.animated = animated;
                    } else {
                        const [voice, length] = CheckVoice(raw.text);
                        if (voice) {
                            message.type = "audio";
                            message.audioLength = length;
                        } else {
                            const [char, word, emoji, count, heartCount] = ParseText(raw.text);
                            message.type = "text";
                            message.characters = char;
                            message.words = word;
                            message.emoji = emoji;
                            message.emojiCount = count;
                            message.heartCount = heartCount;
                        }
                    }
                }
                messages.push(message);
                if (message.time < start) start = message.time;
                if (message.time > end) end = message.time;
            } else {
                const [char, word, emoji] = ParseText(e);
                const last = messages.Last()!;
                last.characters += char;
                last.words += word;
                last.text += e;
                for (let k in emoji) {
                    if (emoji.hasOwnProperty(k)) {
                        if (last.emoji[k] == null) {
                            last.emoji[k] = emoji[k];
                        } else {
                            last.emoji[k] += emoji[k];
                        }
                    }
                }
            }

        });
    return [messages, user1, user2, handle1, handle2, start, end];
}


function ExtractCallDuration(e: string): CallDuration {
    const [h, m, s] = ("0:0:" + e.split(" ")
        .Last()!)
        .split(":")
        .Last(3)
        .Map(e => e.ToInt());
    return new CallDurationClass(h, m, s);
}

function CheckPhoto(text: string): boolean {
    return text.Starts("[[Photo]]");
}


function CheckVideo(text: string): boolean {
    return text.Starts("[[Video, size ") && text.endsWith("bytes]]");
}

function CheckDocument(text: string): boolean {
    return text.Starts("[[Document, size ") && text.endsWith("bytes]]");
}

function ParseText(text: string): [number, number, { [k: string]: number }, number, number] {
    const count = text.split(" ")
        .Where(e => !e.IsEmpty() && !em.isEmoji(e))
        .length;
    const char = text.Remove(" ").length;
    const emojis: { [k: string]: number } = {};
    const eCount = (em.extractEmoji(text) as string[]);
    eCount.Each(e => {
        if (emojis[e] == null) {
            emojis[e] = 1;
        } else {
            emojis[e]++;
        }
    });
    const heart = text.Count("❤");
    return [char, count, emojis, eCount.length, heart];
}

function CheckSticker(text: string): [boolean, boolean] {
    if (text.Starts("[[") && text.split(" ")[1] == "Sticker," && text.Ends("bytes]]")) {
        return [true, false]
    } else if (text == "[[?messageMediaUnsupported]]") {
        return [true, true]
    } else {
        return [false, false]
    }
}


function CheckVoice(text: string): [boolean, number] {
    if (text.Starts("[[Voice Message, ")) {
        const arr = text.split(",")[1].trim()
            .split(" ")
            .Map(e => e.ToInt());
        const l = arr.length;
        const multiplier = [1, 60, 3600];
        const nArr = arr.Map((e, i) => e * multiplier[l - i - 1]);
        return [true, nArr.Sum()]

    }
    return [false, 0];
}

const isCharDigit = (n: any) => n < 10;

interface RawMessage {
    time: Date;
    sender: string;
    owner: boolean;
    handle: string;
    text: string;
    call: boolean;
    callType: CallType;
}

function CheckMessage(s: string): RawMessage | null {
    if (s.length < 25) {
        return null;
    }
    let day = "";
    let month = "";
    let year = "";
    let hour = "";
    let minute = "";
    let second = "";
    let author = "";
    let handle = "";
    let text = "";

    let openFlag = 0;
    let closeFlag = 0;
    let you = true;

    let owner = false;
    let call = false;
    if (s.Starts(".....")) {
        call = true;
        s = s.Skip(5);
    }

    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (i == 0 || i == 1) {
            if (!isCharDigit(s[i])) return null;
            day += c;
        } else if (i == 3 || i == 4) {
            if (!isCharDigit(s[i])) return null;
            month += c;
        } else if (i == 6 || i == 7 || i == 8 || i == 9) {
            if (!isCharDigit(s[i])) return null;
            year += c;
        } else if (i == 11 || i == 12) {
            if (!isCharDigit(s[i])) return null;
            hour += c;
        } else if (i == 14 || i == 15) {
            if (!isCharDigit(s[i])) return null;
            minute += c;
        } else if (i == 17 || i == 18) {
            if (!isCharDigit(s[i])) return null;
            second += c;
        } else if (i == 2 || i == 5) {
            if (c != ".")
                return null;
        } else if (i == 10 || i == 20) {
            if (c != " ")
                return null;
        } else if (i == 13 || i == 16) {
            if (c != ":")
                return null;
        } else if (i == 19) {
            if (c != ",") {
                return null;
            }
        } else {
            if (openFlag == 0) {
                if (c == "[") {
                    openFlag++;
                } else {
                    author += c;
                }
            } else if (openFlag == 1) {
                author = author.trim();
                if (c == "@") {
                    openFlag++;
                } else {
                    return null;
                }
            } else if (openFlag > 1 && closeFlag == 0) {
                if (c == "]") {
                    closeFlag++;
                } else {
                    handle += c;
                }
            } else if (closeFlag == 1) {
                if (c == ":") {
                    you = false;
                    closeFlag++;
                } else if (c == "(") {
                    you = true;
                    closeFlag++;
                } else {
                    return null;
                }
            } else if (closeFlag == 2) {
                if (you) {
                    if (c == "y" || c == "o" || c == "u" || c == ")" || c == ":") {
                        owner = true;
                    } else if (c == " ") {
                        closeFlag++;
                    } else {
                        return null;
                    }
                } else {
                    if (c == " ") {
                        closeFlag++;
                    } else {
                        return null;
                    }
                }
            } else {
                text += c;
            }
        }
    }

    const m = month.ToInt() - 1;
    const time = new Date(year as any, m, day as any, hour as any, minute as any, second as any, 0);
    let callType = CallType.pass;
    if (call) {
        if (s.Ends(">>missed call<<")) {
            callType = CallType.missed;
        } else if (s.Ends(">>cancelled call<<")) {
            callType = CallType.cancel;
        }
    }
    return {
        time,
        sender: author,
        owner,
        handle,
        text,
        call,
        callType,
    };

}


export {Message, MessageParser, CallDuration, CallType}