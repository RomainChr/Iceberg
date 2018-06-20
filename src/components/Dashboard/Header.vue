<template>
  <div>
    <b-nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <router-link :to="'/'" tag="a" class="navbar-brand">
        ICEBERG
      </router-link>

      <b-dropdown v-if="user" id="ddown-sm" size="sm" variant="success">
        <template slot="button-content">
          <div class="containerImage">
            <img class="imgIceberg" src="../../assets/profil.png" alt="">
          </div>
          <span class="ml-2">{{ user.username }}</span>
        </template>
        <b-dropdown-item-button @click="$router.push({path:'/'})">Accueil</b-dropdown-item-button>
        <b-dropdown-item-button @click="$router.push({name:'Profile', params: {id: user._id}})">
          Profil
        </b-dropdown-item-button>
        <b-dropdown-item-button @click="logout()">Déconnexion</b-dropdown-item-button>
      </b-dropdown>
    </b-nav>
  </div>
</template>

<script>
import {busDatas} from '../../main'
import axios from 'axios'

export default {
  name: 'Header',
  data () {
    return {
      // search: '',
      user: null
      // errors: []
    }
  },
  watch: {
    user () {
      this.userDatas()
    }
  },
  created () {
    if (localStorage.getItem('jwtToken')) {
      this.getUserDatas()
    } else {
      this.$router.push({ name: 'Login' })
    }

    busDatas.$on('userDatasChanged', () => {
      this.getUserDatas()
    })
  },
  methods: {
    /* searchEdited () {
      busDatas.$emit('searchEdited', this.search)
    }, */
    userDatas () {
      busDatas.$emit('userDatas', this.user)
    },
    getUserDatas () {
      // GET user data
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.get(this.getPathFromApiHost('auth/user'))
        .then(response => {
          this.user = response.data.user
        })
        .catch(e => {
          this.$router.push({ name: 'Login' })
        })
    },
    logout () {
      localStorage.removeItem('jwtToken')
      location.href = location.origin
    }
  }
}

</script>

<style scoped>
  .form-inline .form-control {
    margin: auto !important;
  }
  .navbar-brand {
    margin: auto;
  }
  .navbar {
    padding: 0rem 1rem;
    color: #FFF;
  }
  .containerImage {
    overflow:hidden;
    border-radius:25px;
    width:24px;
    height:24px;
    background-color: #e9eef1;
    float: left;
  }
  .imgIceberg {
    width: auto;
    height: 100%;
    margin: 0 -100%;
  }
</style>
