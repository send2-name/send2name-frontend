import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { VueDapp } from 'vue-dapp';
import Toast, { POSITION, TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";

import './assets/css/custom.css';

const pinia = createPinia();
const app = createApp(App);

const toastOptions = {
  timeout: 5000,
  hideProgressBar: true,
  closeButton: "button",
  position: POSITION.TOP_LEFT,
  closeOnClick: false,

  toastDefaults: {
    // ToastOptions object for each type of toast
    [TYPE.INFO]: {
        timeout: false,
        icon: false
    }    
  }
}

app.use(Toast, toastOptions);

app.use(router);

app.use(pinia);

app.use(VueDapp, {});

app.mount('#app');
