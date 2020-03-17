<template>
    <div class="nav-bar">
        <div class="basic">
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
        </div>
    </div>
</template>

<style lang='scss' scoped>
    .nav-bar {
        position: fixed;
    }
</style>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class NavBar extends Vue {

    }
</script>
