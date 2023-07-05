
import {createApp} from 'vue'
import './style.css'
// @ts-ignore
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
// @ts-ignore
import VerticalBelt from "./views/VerticalBelt.vue";
// @ts-ignore
import BlueprintParse from "./views/BlueprintParse.vue";
import {config} from "ace-builds";
// @ts-ignore
config.setModuleLoader('ace/mode/json', () => import('ace-builds/src-noconflict/mode-json.js'));
// @ts-ignore
config.setModuleLoader('ace/mode/javascript', () => import('ace-builds/src-noconflict/mode-javascript.js'));
// @ts-ignore
config.setModuleLoader('ace/theme/one_dark', () => import('ace-builds/src-noconflict/theme-one_dark.js'));


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
