// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.config.productionTip = false
Vue.use(BootstrapVue)

export const busDatas = new Vue({
  methods: {
    logout() {
      localStorage.removeItem("jwtToken")
      location.href = location.origin
    }
  }
})

Vue.filter("capitalize", function(value) {
  if (!value) return ""
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.mixin({
  methods: {
    getApiHost() {
      // default api host server
      let host = "http://localhost:3000/api"
      return host
    },
    getPathFromApiHost(path = "") {
      if (path != "") {
        return [this.getApiHost(), path].join("/")
      }
      return this.getApiHost()
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
})
