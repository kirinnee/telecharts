<template>
    <div class="holder">
        <div v-if="!upload&&!loaded" class="holder">
            <h1>Analyze Conversation</h1>
            <div>
                Upload the Telegram log you have saved and you can see the breakdown of your conversation.
            </div>
            <div>
                This is completely client-sided application, it can work without internet, and everything you
                uploaded is completely stored only your computer.
            </div>
            <input id="input" type="file" @change="LoadText">
        </div>
        <div v-else-if="upload&&!loaded" class="holder">
            <div>Processing your conversation...</div>
            <img :src="loader" class="loader">
        </div>
        <div v-else>
            hi
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .holder {

        .loader {
            width: 160px;
            height: 160px;

        }

        color: white;
        font-family: 'Raleway', sans-serif;
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-content: center;
        justify-items: center;

        div {
            margin: 30px;
        }
    }
</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {eases} from "../init";
    import {EaseStrength} from "@kirinnee/kease";
    import {MessageParser} from "../../../classLibrary/Message";

    @Component({})
    export default class UploadLogs extends Vue {
        loader: string = "https://s3-ap-southeast-1.amazonaws.com/kirin.cyanprint/pages/index/assets/loader.c737d684624c881f486bf5b4b1fbc458.svg";
        upload = false;
        loaded = false;

        LoadText(event: InputEvent) {
            const input: HTMLInputElement = event.target! as HTMLInputElement;
            if (input.files && input.files[0]) {
                this.upload = true;
                const reader = new FileReader();
                reader.onload = this.HandleFileLoad;
                reader.readAsText(input.files[0]);
            }
        }

        ChangeColor() {
            const swing = eases.Swing(EaseStrength.Linear);
            (this.$parent as any).ChangeColor(swing);
        }


        HandleFileLoad(event: any) {
            const [messages, u1, u2] = MessageParser(event.target.result);
            const u1Message = messages.Where(e => e.sender == u1);
            const u2Message = messages.Where(e => e.sender == u2);

            const averageWord = messages.Map(e => e.words).Sum() / messages.length;
            const u1avgWord = u1Message.Map(e => e.words).Sum() / u1Message.length;
            const u2avgWord = u2Message.Map(e => e.words).Sum() / u2Message.length;

            console.log(messages);
            console.log("total Message", messages.length, "average", averageWord);
            console.log(u1 + " Message", u1Message.length, u1avgWord);
            console.log(u2 + " Message", u2Message.length, u2avgWord);
            this.loaded = true;
        }
    }
</script>
