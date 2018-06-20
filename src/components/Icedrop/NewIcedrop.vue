<template>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-9 px-4">
      <div class="row">
        <form class="form-signin mt-2 mt-md-0 my-button" v-on:submit.prevent="addIcedrop">
          <div class="alert alert-danger" role="alert" v-if="visibilityAlert">
            Le titre ou l'image que vous avez saisi n'est pas correct !
          </div>

          <h4>Ajouter un Icedrop</h4>
          <input class="form-control mt-2 mr-sm-2 p-2" type="text" placeholder="Titre" aria-label="newIcedropTitle" v-model.trim="newIcedropTitle" required>
          <input class="form-control mt-2 mr-sm-2 p-2" type="url" placeholder="Lien d'image ex: http://image.fr/iceberg.jpg" aria-label="newIcedropImage" v-model.trim="newIcedropImage" required>
          <input class="form-control mt-2 mr-sm-2 p-2" type="url" placeholder="Lien du site Web" aria-label="newIcedropLink" v-model.trim="newIcedropLink" required>
          <br>
          <div class="my-check-button">
            <p>Souhaitez-vous que votre Icedrop soit public ?</p>
            <label>Oui : </label><input class="form-control mt-2 mr-sm-2 p-2" type="radio" name="PublicStatus" value="true" v-model="newIcedropStatus" required>
            <label>Non : </label><input class="form-control mt-2 mr-sm-2 p-2" type="radio" name="PublicStatus" value="false" v-model="newIcedropStatus" required>
          </div>
          <button class="btn btn-outline-success mt-2 p-2" type="submit">Créer votre Icedrop</button>
          <br>
          <b-btn class="p-2 mt-2" variant="outline-danger" @click="$router.go(-1)">Retour</b-btn>

          <div class="col-12 col-xs-12 col-sm-12 col-md-11 col mb-2 mt-4 my-iceberg">
            <h4>Aperçu de votre Icedrop</h4>
            <div class="col-8 col m-auto">
              <b-card no-body>
                <div class="containerImg">
                  <b-card-img :src="(icedropImageValid || defaultImage)"
                              class="img"
                              alt="Img"
                              top>
                  </b-card-img>
                  <b-card-img :src="newIcedropImage"
                              v-show="false"
                              top
                              @load="imageLoaded()">
                  </b-card-img>
                </div>
                <div>
                  <h4>{{ (newIcedropTitle || defaultTitle) | capitalize }}</h4>
                  <p class="card-text">
                    Voir le site
                  </p>
                </div>
                <div slot="footer">
                  <svg id="i-compose" viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M27 15 L27 30 2 30 2 5 17 5 M30 6 L26 2 9 19 7 25 13 23 Z M22 6 L26 10 Z M9 19 L13 23 Z" />
                  </svg>
                </div>
              </b-card>
            </div>
          </div>
        </form>
      </div>
  </main>
</template>

<script>
import { busDatas } from '../../main'
import axios from 'axios'

export default {
  name: 'NewIcedrop',
  data () {
    return {
      newIcedropTitle: null,
      newIcedropImage: null,
      newIcedropStatus: null,
      newIcedropLink: null,
      icedropImageValid: null,
      defaultImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfP09bFyczM0dO8wMPk6ezY3eDh5unJzdDR1tlr0sxZAAACVUlEQVR4nO3b23KDIBRA0QgmsaLx//+2KmPi/YJMPafZ6619sOzARJjq7QYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuJyN4+qMZcUri+BV3WQ22iIxSRTGFBITbRGpr218Ckx0EQPrxMfVPRP25QvNaT4xFTeJ1g/sJ4K8/aTuVxdNNJ99/Q0RQWlELtN7xGH9+8KYH1ZEX1hY770C9186Cm2R1TeONGj/paHQury7OwbsvzQUlp/9jakOJ2ooPLf/kl9on4Mtan50EhUUDvfgh8cqv/AxKlw+Cc3vPeUXjg+Kr4VCm+Vbl5LkeKHNTDKbKL9w3yr1B8q5RPmFu75puhPzTKKCwh13i2aJJguJ8gt33PG7GZxN1FC4tWvrB04TNRRu7Lw/S3Q2UUPh+ulpOIPTRB2FKyfgaeAoUUvhkvESnSYqL5ybwVGi7sKlwH6i6sL5JTpKVFZYlr0flmewTbyvX+piC8NyiXHvH9YD37OoqtA1v+wS15ZofxY1FTo/cJ+4NYNJd9BSVOi6kTeJOwLVFbrPyJ3dXqL6Cl1/7G7HDGordMOx7+hTVui2arQXBgVqKgwLVFQYGKinMDRQTWFwoJrC8AfcKLwUhRRSeL3vKkyDVaNLSdIf1snXEBQUyrlUTBQeIbPQD6uK8Zx3+yyHKbf/5N+y/gn78K/Rj/ZmY64Omhg9gHFaJu59i+EDGKf1/tshRxlxEoW+2uXS868EeflDYmDNltUzgkpqXyPGzULyK6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8DV+AUrRI7QWHsWNAAAAAElFTkSuQmCC',
      defaultTitle: 'Titre',
      visibilityAlert: false,
      iceberg: null
    }
  },
  watch: {
    newIcedropImage: function () {
      if (this.newIcedropImage !== this.icedropImageValid) {
        this.icedropImageValid = null
      }
    }
  },
  mounted () {
    this.getIceberg()
  },
  methods: {
    getIceberg () {
      this.iceberg = null
      let icebergId = this.$route.path.split('/')[1]

      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.get(this.getPathFromApiHost('iceberg/' + icebergId))
        .then(response => {
          this.iceberg = response.data
        })
        .catch(e => {
          if (e.response.status === 401) {
            busDatas.logout()
            return
          }
          if (e.response.status === 404) {
            this.$router.push({name: 'Page404'})
            return
          }
          this.$router.push({path: '/'})
        })
    },
    addIcedrop () {
      this.visibilityAlert = false

      // check titre OK && icedropImageValid !== null && newIcedropStatus !== null
      if (this.newIcedropTitle === '' || !this.icedropImageValid || !this.newIcedropStatus || this.iceberg === null || this.newIcedropLink === '') {
        this.visibilityAlert = true
        return
      }

      let newIcedrop = {
        icedropTitle: this.newIcedropTitle,
        icedropUrl: this.icedropImageValid,
        icedropPublicStatus: this.newIcedropStatus,
        icedropLink: this.newIcedropLink
      }

      this.iceberg.icedrops.push(newIcedrop)

      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.put(this.getPathFromApiHost('iceberg/' + this.iceberg._id), this.iceberg)
        .then(response => {
          busDatas.$emit('dataChanged')
          this.$router.push({path: '/' + this.iceberg._id})
        })
        .catch(e => {
          if (e.response.status === 401) {
            busDatas.logout()
          }
        })
    },
    imageLoaded () {
      this.icedropImageValid = this.newIcedropImage
    }
  }
}

</script>

<style scoped>
  main {
    padding-top: 0px;
  }
  .my-check-button > label, .my-check-button input {
    width: auto;
    display: initial;
    text-align: left;
  }
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
</style>
