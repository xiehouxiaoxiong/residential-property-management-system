import { createApp } from 'vue'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Qs from "qs";
import vueRouter from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import "./css/global.css";
import Vant from 'vant'
import router from './router'
import './common/font/font.css'
function useTable(app) {
  app.use(VXETable)
}
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(useTable)
app.use(vueRouter)
app.use(Vant)
app.use(pinia)
app.use(router)
app.use(Qs)
app.use(ElementPlus, {
  locale: zhCn 
})
app.config.globalProperties.$uploadUrl = "http://localhost:3000/"
app.mount('#app')
