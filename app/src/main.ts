/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */


// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

import { store } from './store'


// Plugins
import { registerPlugins } from '@/plugins'

//Router
import { router } from './router'



const app = createApp(App)

app.use(router)
app.use(store)

registerPlugins(app)

app.mount('#app')
