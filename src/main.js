import { createApp } from 'vue'
import App from './App.vue'

import VueSvgInlinePlugin from 'vue-svg-inline-plugin';
import "vue-svg-inline-plugin/src/polyfills";

const app = createApp(App);

app.use(VueSvgInlinePlugin, {
    attributes: {
        data: ["src"],
        remove: ["alt"]
    }
});

app.mount("#app");