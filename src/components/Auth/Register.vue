<template>
  <b-row class="justify-content-center">
    <b-col lg="5" md="7" sm="8" cols="10">
      <h2>Inscription</h2>
      <div class="alert alert-danger" role="alert" v-if="msgAlert">
        {{ msgAlert }}
      </div>
      <b-form v-on:submit.prevent="registerUser">
        <b-form-group class="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Email">
          <b-form-input id="email" type="email" placeholder="Email" :state="state" v-model.trim="register.email" required></b-form-input>
        </b-form-group>
        <b-form-group class="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Nom d'utilisateur">
          <b-form-input id="username" placeholder="Nom d'utilisateur" :state="state" v-model.trim="register.username" required></b-form-input>
        </b-form-group>
        <b-form-group class="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Mot de passe">
          <b-form-input type="password" placeholder="Mot de passe" id="password" :state="state" v-model.trim="register.password" required></b-form-input>
        </b-form-group>
        <b-form-group class="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Prénom">
          <b-form-input id="firstname" placeholder="Prénom" :state="state" v-model.trim="register.firstname" required></b-form-input>
        </b-form-group>
        <b-form-group class="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Nom">
          <b-form-input id="surname" placeholder="Nom" :state="state" v-model.trim="register.surname" required></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="outline-primary">S'inscrire</b-button>
        <b-button type="button" variant="outline-success" @click="$router.push({name:'Login'})">Se connecter</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Register',
  data () {
    return {
      register: {},
      errors: [],
      msgAlert: null
    }
  },
  watch: {
    // hide alert if field modified
    register: {
      handler () {
        this.msgAlert = null
      },
      deep: true
    }
  },
  methods: {
    checkEmail () {
      let regex = /\S+@\S+\.\S+/
      return regex.test(this.register.email)
    },
    registerUser (evt) {
      evt.preventDefault()

      if (!this.checkEmail()) {
        this.msgAlert = 'Email invalide'
        return
      }

      if (!this.register.email || !this.register.username || !this.register.password || !this.register.firstname || !this.register.surname) {
        this.msgAlert = 'Merci de remplir tous les champs.'
        return
      }

      axios.post(this.getPathFromApiHost('auth/register'), this.register)
        .then(response => {
          if (response.data.msg === 'email already exists') {
            this.msgAlert = 'Email déjà utilisé. Essayer de vous connecter.'
            return
          }

          if (response.data.msg === 'username already exists') {
            this.msgAlert = "Désolé ce nom d'utilisateur est déjà utilisé. Essayer autre chose."
            return
          }

          this.$router.push({ name: 'Login' })
        })
        .catch(e => {
          this.errors.push(e)
          this.$router.push({ name: 'Register' })
        })
    }
  }
}
</script>

<style scoped>
  .fieldsetHorizontal {
    text-align: left;
  }
</style>
