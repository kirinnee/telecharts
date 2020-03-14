import Vue from 'vue';
import App from './App.vue';
import './index.scss';
import {router} from "./router";
import {images} from './images';
import 'vue-histogram-slider/dist/histogram-slider.css';

const HistogramSlider = require('vue-histogram-slider');

Vue.config.productionTip = false;

Vue.component(HistogramSlider.name, HistogramSlider);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

export {
    images
}
