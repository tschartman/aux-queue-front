import Vue from "vue";
import VueRouter from "vue-router";
import VueWorker from "vue-worker";
import routes from "./routes";
import Store from "src/store";
import Clipboard from "v-clipboard";
import moment from "moment";

Vue.use(VueWorker);
Vue.use(VueRouter);
Vue.use(Clipboard);
Vue.prototype.moment = moment;

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function(/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: "history",
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (Store.getters.isLoggedIn) {
        next();
        return;
      }
      next("/login");
    } else {
      next();
    }
  });

  return Router;
}
