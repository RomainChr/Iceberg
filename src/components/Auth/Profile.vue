<template>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-9 px-4">
    <b-row class="justify-content-center">
      <b-col lg="6" md="8" sm="7" cols="10">
        <h2>Mon profil</h2>
        <b-form class="profile" v-on:submit.prevent="" v-if="user">
          <div id="email" class="row">
            <div class="col-6 titre">Email : </div>
            <div class="col-6 content">{{ user.email }}</div>
          </div>
          <div id="username" class="row">
            <div class="col-6 titre">Nom d'utilisateur : </div>
            <div class="col-6 content">{{ user.username }}</div>
          </div>
          <div id="password" class="row" style="height:40px">
            <div class="col-6 titre mdp">Mot de passe : </div>
            <div class="col-6 content"><b-btn @click="modalShow = !modalShow;cleanInputField()" variant="outline-danger">Changer le mot de passe</b-btn></div>
          </div>
          <div id="firstname" class="row">
            <div class="col-6 titre">Prénom : </div>
            <div class="col-6 content">{{ user.firstname }}</div>
          </div>
          <div id="surname" class="row">
            <div class="col-6 titre">Nom : </div>
            <div class="col-6 content">{{ user.surname }}</div>
          </div>
          <b-button type="submit" variant="outline-success" @click="$router.push({name: 'EditProfile'})">Editer mon profil</b-button>
          <b-button type="button" variant="outline-danger" @click="$router.push({name: 'Home'})">Retour</b-button>
        </b-form>
      </b-col>
    </b-row>

    <!-- Modal Component -->
    <b-modal id="modalShow" v-model="modalShow" title="Changer mon mot de passe" hide-footer :no-close-on-backdrop="false">
      <b-form v-on:submit.prevent="updatePassword">
        <div class="alert alert-danger" role="alert" v-if="msgAlert2">
          {{ msgAlert2 }}
        </div>
        <div class="alert alert-danger" role="alert" v-if="msgAlert">
          {{ msgAlert }}
        </div>
        <b-form-group class="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Mon mot de passe">
          <b-form-input type="password" placeholder="Mon mot de passe" id="oldPassword" v-model.trim="password.oldPassword" @keyup.native="compareOldPassword" required></b-form-input>
        </b-form-group>
        <p class="alert alert-danger" role="alert" v-if="msgAlertPassword">  {{ msgAlertPassword }}   </p>
        <b-form-group class="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Nouveau mot de passe">
          <b-form-input type="password" placeholder="Nouveau mot de passe" id="newPassword" v-model.trim="password.newPassword" @keyup.native="checkNewPassword" required></b-form-input>
        </b-form-group>
        <b-form-group class="fieldsetHorizontal"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Confirmer nouveau mot de passe">
          <b-form-input type="password" placeholder="Confirmer nouveau mot de passe" id="confirmNewPassword" @keyup.native="checkNewPassword" v-model.trim="password.confirmNewPassword" required></b-form-input>
        </b-form-group>
        <b-btn @click="modalShow = !modalShow" variant="outline-secondary">Annuler</b-btn>
        <b-btn variant="outline-success" type="submit">Enregistrer</b-btn>
      </b-form>
    </b-modal>
  </main>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Profile',
  data  () {
    return {
      user: null,
      errors: [],
      msgAlert: null,
      msgAlert2: null,
      msgAlertPassword: null,
      password: {oldPassword: '', newPassword: '', confirmNewPassword: ''},
      timerOut: null,
      timerOut2: null,
      modalShow: false
    }
  },
  created () {
    // GET profile datas
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    axios.get(this.getPathFromApiHost('auth/profile/' + this.$route.params.id))
      .then(response => {
        this.user = response.data.user
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
  watch: {
    // hide alert if field modified
    password: {
      handler () {
        this.msgAlert = null
        this.msgAlert2 = null
        this.msgAlertPassword = null
      },
      deep: true
    }
  },
  methods: {
    compareOldPassword () {
      if (this.password.oldPassword !== '') {
        clearTimeout(this.timerOut2)

        // setTimeout for wait user finish
        this.timerOut2 = setTimeout(function () {
          axios.post(this.getPathFromApiHost('auth/profile/' + this.$route.params.id + '/comparepassword'), this.password)
            .then(response => {
              if (response.data.msg !== 'correct password') {
                this.msgAlert2 = 'Mot de passe incorrect.'
              }
            })
            .catch(e => {
              this.errors.push(e)
              if (e.response.status === 401) {
                this.$router.push({
                  name: 'Login'
                })
              }
            })
        }.bind(this), 1000)
      }
    },
    // check if New password and Confirm new password fields are different
    checkNewPassword () {
      if (this.password.newPassword !== '' && this.password.confirmNewPassword !== '') {
        clearTimeout(this.timerOut)
        // setTimeout for wait user finish
        this.timerOut = setTimeout(function () {
          if (this.password.newPassword !== this.password.confirmNewPassword) {
            this.msgAlertPassword = 'Nouveau mot de passe et Confirmer nouveau mot de passe sont différents.'
            return
          }

          this.msgAlertPassword = null
        }.bind(this), 1000)
      }
    },
    updatePassword (evt) {
      evt.preventDefault()

      // check if fields filled
      if (!this.password.oldPassword || !this.password.newPassword || !this.password.confirmNewPassword) {
        this.msgAlert = 'Merci de remplir tous les champs.'
        return
      }

      // check if old password different of new password and confirm new password
      if (this.password.oldPassword === this.password.newPassword || this.password.oldPassword === this.password.confirmNewPassword) {
        this.msgAlert = "Vous n'avez pas changé votre mot de passe."
        return
      }

      // check if new password and confirm new password are equal
      if (this.password.newPassword !== this.password.confirmNewPassword) {
        this.msgAlertPassword = 'Nouveau mot de passe et Confirmer nouveau mot de passe sont différents.'
        return
      }

      // SET new password
      let updateUser = this.user
      updateUser.password = this.password.newPassword

      axios.put(this.getPathFromApiHost('auth/profile/' + this.$route.params.id + '/edit'), updateUser)
        .then(response => {
          if (response.data.msg === 'Successful updated user.') {
            this.modalShow = false
            this.$router.push({
              name: 'Login'
            })
          }
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
    // clean field change password
    cleanInputField () {
      this.password = {oldPassword: '', newPassword: '', confirmNewPassword: ''}
    }
  }
}
</script>

<style>
  .modal-title{
    width: 100% !important;
  }
  .form-row > legend{
    font-size: 15px !important;
  }
  [v-cloak] {
    display: none;
  }
  .profile {

  }
  .profile .mdp {
    height:40px;
    padding-top:8px
  }
  .profile .titre {
    text-align: left;
    height: 30px;
    padding-top: 3px;
  }
  .profile .content {
    text-align: left;
    height: 30px;
  }
</style>
