<template>
    <div class="button">
        {{text}}
    </div>
</template>

<style lang='scss' scoped>
    .button {
        color: white;
        font-family: 'Raleway', sans-serif;
        font-weight: 300;
        text-transform: uppercase;
        min-width: 300px;
        text-align: center;
        padding: 30px;
        border: 1px solid white;
        margin: 40px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background: rgba(256, 256, 256, 0.1);
        }
    }
</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        props: {
            text: String
        }
    })
    export default class Button extends Vue {

    }
</script>
