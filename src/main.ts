import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import VerticalBelt from "./views/VerticalBelt.vue";
import BlueprintParse from "./views/BlueprintParse.vue";

const app = createApp(App)
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path:'/vertical-belt',
            component: VerticalBelt,
            alias:'/'
        },
        {
            path:'/parse',
            component: BlueprintParse,
        },

    ], // short for `routes: routes`
})
app.use(router)
app.mount('#app')
