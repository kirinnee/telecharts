<template>
    <div class="c-holder">
        <div>Average Message/Day</div>
        <div>10,000</div>
    </div>
</template>

<style lang='scss' scoped>
    .c-holder {
        width: 250px;
        height: 150px;
        position: relative;
        background-color: white;
        border-radius: 5px;
    }
</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class NumberStats extends Vue {

    }
</script>
