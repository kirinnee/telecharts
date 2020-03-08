import Vue from 'vue';
import App from './App.vue';
import './index.scss';
import {router} from "./router";
import {images} from './images';

Vue.config.productionTip = false;

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');

export {
	images
}
