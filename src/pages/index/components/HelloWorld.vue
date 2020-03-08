<template>
    <div class="hello">
        <input v-model="val"/>
        <div class="message">{{Message}} test2</div>
        <img v-bind:src="logo"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {images} from "../images";

    @Component
    export default class HelloWorld extends Vue {

        private val?: string;

        data() {
            return {
                val: '',
                logo: images.logo
            }
        }

        get Message(): string {
            return (this.val as string).split("").reverse().join("");
        }
    }
</script>