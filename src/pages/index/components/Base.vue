<template>

</template>

<style lang='scss' scoped>

</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import Home from "../views/Home.vue";

    @Component({})
    export default class Base extends Vue {
        get Main(): Home {
            return this.$parent as Home;
        }
    }
</script>
