import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible';
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vant from 'vant';

Vue.use(VueAxios, axios)

Vue.config.productionTip = false


import { 
  NavBar,Icon,
  Cell, CellGroup,
  Tabbar,
  Form,Field,Button,
  Toast,
  Swipe, SwipeItem,
  Tab, Tabs,
  Popup,Col,Row,
  Progress,
  Circle,
} from 'vant';

Vue.use(NavBar).use(Icon).use(Cell).use(CellGroup).use(Tabbar).use(Form)
.use(Field).use(Button).use(Toast).use(Swipe).use(SwipeItem).use(Tab).use(Tabs).use(Popup)
.use(Col).use(Row).use(Progress).use(Circle);



//配置请求基础路径
axios.defaults.baseURL='http://localhost:3000/'
// 允许跨域设置，不然可能因为拿不到cookie而报错
axios.defaults.withCredentials = true;
//配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.interceptors.request.use(
  config => {
    if (config.meth === 'post' && !(config.data instanceof FormData)) {
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      config.data = qs.stringify(config.data, { arrayFormat: 'repeat' }) /*这里是，后端要求传数组的时候做的设置，以前出过错*/
    }
    return config
  }, error => {
    return Promise.reject(error)
  }
)
/* 响应拦截 */
axios.interceptors.response.use(
  res => {
   /*可在这里根据返回的状态码做一些拦截操作*/
    return res
  }, err => {
    return Promise.resolve(err)
  }
)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
