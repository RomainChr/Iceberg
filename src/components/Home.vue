<template>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-9 px-4 py-0">
    <b-row>
      <b-col class="col-10 m-auto">
        <h2 class="mb-2" v-if="user">Bienvenue sur Iceberg {{ user.username }}</h2>

        <p class="text-justify">Iceberg est une application qui permet d'enregistrer les sites Web indispensables à tes besoins.
          <br>
          <br>
          Cette application permet de stocker tous tes favoris / marque-pages, de les organiser pour mieux les ré-utiliser.
          <br>
          Finies les longues listes de marque-pages que l'on oublie et abondonne dans son navigateur.
          <br>
          <br>
          - un Iceberg est un dossier, tu peux créer un Iceberg pour chaque domaine.
          <br>
          - un Icedrop est un marque-page, un lien vers un site Web.
        </p>
        <br>
        <p>Voici un Icedrop, une image symbolisant le marque-page, le titre et le lien.</p>

        <div class="col-12 col-xs-12 col-sm-4 col-md-4 col-lg-3 col mb-2 m-auto">
          <b-card no-body>
            <div class="containerImg">
              <b-card-img src="http://theotariketlaurent.com/actualites/wp-content/uploads/2016/02/img-une-codrops.png"
                          class="img"
                          alt="Img"
                          top>
              </b-card-img>
            </div>
            <div>
              <h4>Codrops</h4>
              <p class="card-text">
                <a href="https://tympanus.net/codrops/" target="_blank">Voir le site</a>
              </p>
            </div>
            <div slot="footer">
              <svg id="i-compose" viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M27 15 L27 30 2 30 2 5 17 5 M30 6 L26 2 9 19 7 25 13 23 Z M22 6 L26 10 Z M9 19 L13 23 Z" />
              </svg>
            </div>
          </b-card>
        </div>

        <br>
        <br>

        <p>De nombreuses évolutions sont à venir !</p>
      </b-col>
    </b-row>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data () {
    return {
      user: null,
      errors: []
    }
  },
  created () {
    if (localStorage.getItem('jwtToken')) {
      this.getUserDatas()
    } else {
      this.$router.push({name: 'Login'})
    }
  },
  methods: {
    getUserDatas () {
      // GET user data
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.get(this.getPathFromApiHost('auth/user'))
        .then(response => {
          this.user = response.data.user
        })
        .catch(e => {
          this.$router.push({name: 'Login'})
        })
    }
  }
}
</script>

<style scoped>
  .card-img-top {
    width: auto;
    height: 100%;
    max-height: 120px;
  }
  .containerImg {
    overflow: hidden;
    max-height: 120px;
    width: 100%;
  }
  .img{
    width: auto;
    height: 120px;
  }
  .card-text > a {
    cursor: pointer;
  }
</style>
