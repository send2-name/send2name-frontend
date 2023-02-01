import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { VueDapp } from 'vue-dapp'

import './assets/css/custom.css'

const pinia = createPinia()
const app = createApp(App)

app.use(router)

app.use(pinia)

app.use(VueDapp, {
	autoConnect: true,
	dumb: false
})

app.mount('#app')
