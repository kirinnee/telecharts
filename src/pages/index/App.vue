<template>
    <div>
        <NavBar></NavBar>
        <router-view/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import NavBar from './components/NavBar.vue';

    @Component({
        components: {
            NavBar,
        }
    })

    export default class App extends Vue {
    }
</script>
