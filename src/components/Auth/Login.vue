<template>
  <b-row class="col-12 justify-content-center">
    <b-col lg="5" md="7" sm="8" cols="10">
      <h2>Connexion</h2>
      <div class="alert alert-danger" role="alert" v-if="msgAlert">
        {{ msgAlert }}
      </div>
      <b-form v-on:submit.prevent="submitLogin">
        <b-form-group class="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Nom d'utilisateur">
          <b-form-input id="username" placeholder="Nom d'utilisateur ou email" v-model.trim="login.username" required></b-form-input>
        </b-form-group>
        <b-form-group class="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Mot de passe">
          <b-form-input type="password" placeholder="Mot de passe" id="password" v-model.trim="login.password" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="outline-success">Se connecter</b-button>
        <b-button type="button" variant="outline-danger" @click.stop="register()">S'inscrire</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Login',
  data () {
    return {
      login: {},
      errors: [],
      user: null,
      msgAlert: null
    }
  },
  watch: {
    // hide alert if login modified
    login: {
      handler () {
        this.msgAlert = null
      },
      deep: true
    }
  },
  created () {
    if (localStorage.getItem('jwtToken')) {
      this.$router.push({ name: 'Home' })
    }
    /* axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    axios.get('http://localhost:3000/api/home')
      .then(
        this.$router.push({ name: 'Home' })
      )
      .catch(e => {
        this.errors.push(e)
        if (e.response.status === 401) {
          this.$router.push({
            name: 'Login'
          })
        }
      }) */
  },
  methods: {
    submitLogin (evt) {
      if (!this.login.username || !this.login.password) {
        this.msgAlert = 'Merci de remplir tous les champs.'
        return
      }

      evt.preventDefault()

      axios.post(this.getPathFromApiHost('auth/login'), this.login)
        .then(response => {
          if (response.data.msg === 'email or username not found') {
            this.msgAlert = "Nom d'utilisateur ou email incorrect."
            return
          }

          if (response.data.msg === 'wrong password') {
            this.msgAlert = 'Mot de passe incorrect.'
            return
          }

          localStorage.setItem('jwtToken', response.data.token)
          this.$router.push({ name: 'Home' })
          location.href = location.origin
        })
        .catch(e => {
          this.errors.push(e)
          this.$router.push({ name: 'Login' })
        })
    },
    register () {
      this.$router.push({ name: 'Register' })
    }
  }
}
</script>

<style scoped>
  .fieldsetHorizontal {
    text-align: left;
  }
</style>
