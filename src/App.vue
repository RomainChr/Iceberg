<template>
  <div id="app">
    <!--<transition name="fade" mode="out-in">-->
      <appHeader></appHeader>
        <div class="">  <!--container-fluid-->
          <appSidebarIcebergs v-if="user"></appSidebarIcebergs>
          <transition name="fade" mode="out-in" :duration="{ enter: 300, leave: 300 }">

            <router-view :key="$route.fullPath"></router-view>

          </transition>
        </div>
    <!--</transition>-->
  </div>
</template>

<script>
import axios from 'axios'
import Header from './components/Dashboard/Header.vue'
import SidebarIcebergs from './components/Dashboard/SidebarIcebergs.vue'

export default {
  name: 'App',
  data () {
    return {
      user: null,
      errors: []
    }
  },
  created () {
    if (localStorage.getItem('jwtToken')) {
      // GET user data
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.get( this.getPathFromApiHost('auth/user') )
        .then(response => {
          this.user = response.data.user
        })
        .catch(e => {
          this.errors.push(e)
          if (e.response.status === 401) {
            localStorage.removeItem('jwtToken')
            this.$router.push({name: 'Login'})
          }
        })
    }
  },
  components: {
    appHeader: Header,
    appSidebarIcebergs: SidebarIcebergs
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

[role="main"] {
  padding-top: 48px;
}

.jumbotron{
  margin-bottom: 0;
  padding: 0;
  border: 1px solid black;
}
.container {
  margin-top: -70px;
  min-width: 100% !important;
}
.my-button{
  margin: 10px;
  margin-bottom: 20px;
}
.form-signin {
  width: 100%;
  max-width: 420px;
  padding: 15px;
  margin: auto;
}
.my-iceberg{
  margin: auto;
}
.dropdown-toggle {
  font-weight: bold !important;
  cursor : pointer !important;
}
button {
  cursor: pointer;
}
.card-footer {
  padding: .25rem !important;
}
</style>
