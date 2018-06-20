<template>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-9 px-4">
    <b-row class="justify-content-center">
      <b-col lg="7" md="9" sm="8" cols="10">
        <h2>Editer mon profil</h2>
        <div class="alert alert-danger" role="alert" v-if="msgAlert">
          {{ msgAlert }}
        </div>

        <b-form v-on:submit.prevent="updateProfile" v-if="updateUser">
          <b-form-group class="fieldsetHorizontal"
                        horizontal
                        :label-cols="4"
                        breakpoint="md"
                        label="Email">
            <b-form-input id="email" type="email" placeholder="Email" :state="state" v-model.trim="updateUser.email" value="toto" required></b-form-input>
          </b-form-group>
          <b-form-group class="fieldsetHorizontal"
                        horizontal
                        :label-cols="4"
                        breakpoint="md"
                        label="Nom d'utilisateur">
            <b-form-input id="username" placeholder="Nom d'utilisateur" :state="state" v-model.trim="updateUser.username" value="" required></b-form-input>
          </b-form-group>
          <b-form-group class="fieldsetHorizontal"
                        horizontal
                        :label-cols="4"
                        breakpoint="md"
                        label="Prénom">
            <b-form-input id="firstname" placeholder="Prénom" :state="state" v-model.trim="updateUser.firstname" value="" required></b-form-input>
          </b-form-group>
          <b-form-group class="fieldsetHorizontal"
                        horizontal
                        :label-cols="4"
                        breakpoint="md"
                        label="Nom">
            <b-form-input id="surname" placeholder="Nom" :state="state" v-model.trim="updateUser.surname" value="" required></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="outline-success">Enregistrer mon profil</b-button>
          <b-button type="button" variant="outline-danger" @click="$router.go(-1)">Retour</b-button>
        </b-form>
      </b-col>
    </b-row>
  </main>
</template>

<script>
import {busDatas} from '../../main'
import axios from 'axios'

export default {
  name: 'EditProfile',
  data () {
    return {
      user: null,
      updateUser: null,
      errors: [],
      msgAlert: null
    }
  },
  watch: {
    // hide alert if field modified
    updateUser: {
      handler () {
        this.msgAlert = null
      },
      deep: true
    }
  },
  created () {
    // GET user datas
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    axios.get( this.getPathFromApiHost('auth/profile/' + this.$route.params.id) )
      .then(response => {
        this.user = response.data.user
        this.updateUser = Object.assign({}, this.user)
      })
      .catch(e => {
        this.errors.push(e)
        if (e.response.status === 401) {
          this.$router.push({
            name: 'Login'
          })
        }
      })
  },
  methods: {
    checkEmail () {
      let regex = /\S+@\S+\.\S+/
      return regex.test(this.updateUser.email)
    },
    updateProfile (evt) {
      evt.preventDefault()

      if (!this.checkEmail()) {
        this.msgAlert = 'Email invalide'
        return
      }

      if (!this.updateUser.email || !this.updateUser.username || !this.updateUser.firstname || !this.updateUser.surname) {
        this.msgAlert = 'Merci de remplir tous les champs.'
        return
      }

      if (this.updateUser.email === this.user.email && this.updateUser.username === this.user.username && this.updateUser.firstname === this.user.firstname && this.updateUser.surname === this.user.surname) {
        this.$router.push({ name: 'Profile' })
        return
      }

      axios.put(this.getPathFromApiHost('auth/profile/' + this.$route.params.id + '/edit'), this.updateUser)
        .then(response => {
          if (response.data.msg === 'email already exists') {
            this.msgAlert = 'Email déjà utilisé. Essayer de vous connecter.'
            return
          }

          if (response.data.msg === 'username already exists') {
            this.msgAlert = "Désolé ce nom d'utilisateur est déjà utilisé. Essayer autre chose."
            return
          }

          busDatas.$emit('userDatasChanged')
          this.$router.push({ name: 'Profile' })
        })
        .catch(e => {
          this.errors.push(e)
          if (e.response.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
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
