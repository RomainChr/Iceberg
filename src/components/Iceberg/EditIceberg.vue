<template>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-9 px-4">
  <div class="container">
    <div class="row">
      <form class="form-signin mt-2 mt-md-0 my-button" v-on:submit.prevent="updateIceberg">
        <div class="alert alert-danger" role="alert" v-if="visibilityAlert">
          Le titre ou l'image que vous avez saisi n'est pas correct !
        </div>

        <h4>Modifier votre Iceberg</h4>
        <input class="form-control mt-2 mr-sm-2 p-2" type="text" placeholder="Titre" aria-label="icebergTitle" v-model.trim="icebergTitle" required>
        <input class="form-control mt-2 mr-sm-2 p-2" type="url" placeholder="Lien d'image ex: http://image.fr/iceberg.jpg" aria-label="icebergImage" v-model.trim="icebergImage" required>
        <button class="btn btn-outline-success mt-2 p-2" type="submit">Enregistrer votre Iceberg</button>
        <b-btn class="mt-2 p-2" variant="outline-danger" v-b-modal.modal-center @click="modalShow = !modalShow">Supprimer votre Iceberg</b-btn>
        <br>
        <b-btn class="p-2 mt-2" variant="outline-danger" @click="$router.go(-1)">Retour</b-btn>

        <div class="col-12 col-xs-12 col-sm-12 col-md-11 col mb-2 mt-4 my-iceberg">
          <h4>Aperçu de votre Iceberg</h4>
          <ul class="nav flex-column mb-4 bg-light">
            <li class="nav-item">
              <hr class="m-0">
              <a href="#" class="nav-link linkIceberg">
                <div class="containerImage">
                  <img class="imgIceberg" :src="(icebergImageValid || defaultImage)" alt="">
                  <img v-show="false" :src="icebergImage" alt="" style="max-width:308px" @load="imageLoaded()">
                </div>
                <p class="titreIceberg">
                  {{ (icebergTitle || defaultTitle) | capitalize }}
                </p>
              </a>
              <a href="#" class="editIceberg">
                <svg id="i-compose" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path d="M27 15 L27 30 2 30 2 5 17 5 M30 6 L26 2 9 19 7 25 13 23 Z M22 6 L26 10 Z M9 19 L13 23 Z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </form>
    </div>

    <!-- Modal Component -->
    <b-modal id="modal-center" v-model="modalShow" centered title="Supprimer votre Iceberg" :no-close-on-backdrop="false">
      <p>Voulez vous vraiment supprimer votre Iceberg ?</p>
      <div slot="modal-footer">
        <b-btn variant="secondary" @click="modalShow = !modalShow">Fermer</b-btn>
        <b-btn variant="primary" @click="removeIceberg">Supprimer</b-btn>
      </div>
    </b-modal>
  </div>
  </main>
</template>

<script>
import {busDatas} from '../../main'
import axios from 'axios'

export default {
  name: 'EditIceberg',
  data () {
    return {
      icebergTitle: null,
      icebergImage: null,
      icebergImageValid: null,
      defaultImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfP09bFyczM0dO8wMPk6ezY3eDh5unJzdDR1tlr0sxZAAACVUlEQVR4nO3b23KDIBRA0QgmsaLx//+2KmPi/YJMPafZ6619sOzARJjq7QYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuJyN4+qMZcUri+BV3WQ22iIxSRTGFBITbRGpr218Ckx0EQPrxMfVPRP25QvNaT4xFTeJ1g/sJ4K8/aTuVxdNNJ99/Q0RQWlELtN7xGH9+8KYH1ZEX1hY770C9186Cm2R1TeONGj/paHQury7OwbsvzQUlp/9jakOJ2ooPLf/kl9on4Mtan50EhUUDvfgh8cqv/AxKlw+Cc3vPeUXjg+Kr4VCm+Vbl5LkeKHNTDKbKL9w3yr1B8q5RPmFu75puhPzTKKCwh13i2aJJguJ8gt33PG7GZxN1FC4tWvrB04TNRRu7Lw/S3Q2UUPh+ulpOIPTRB2FKyfgaeAoUUvhkvESnSYqL5ybwVGi7sKlwH6i6sL5JTpKVFZYlr0flmewTbyvX+piC8NyiXHvH9YD37OoqtA1v+wS15ZofxY1FTo/cJ+4NYNJd9BSVOi6kTeJOwLVFbrPyJ3dXqL6Cl1/7G7HDGordMOx7+hTVui2arQXBgVqKgwLVFQYGKinMDRQTWFwoJrC8AfcKLwUhRRSeL3vKkyDVaNLSdIf1snXEBQUyrlUTBQeIbPQD6uK8Zx3+yyHKbf/5N+y/gn78K/Rj/ZmY64Omhg9gHFaJu59i+EDGKf1/tshRxlxEoW+2uXS868EeflDYmDNltUzgkpqXyPGzULyK6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8DV+AUrRI7QWHsWNAAAAAElFTkSuQmCC',
      defaultTitle: 'Titre',
      visibilityAlert: false,
      iceberg: null,
      modalShow: false
    }
  },
  watch: {
    icebergImage: function () {
      if (this.icebergImage !== this.icebergImageValid) {
        this.icebergImageValid = null
      }
    },
    '$route': function () {
      this.getIceberg()
    }
  },
  mounted () {
    this.getIceberg()
  },
  methods: {
    getIceberg () {
      this.iceberg = null
      let icebergId = this.$route.path.split('/')[2]

      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.get(this.getPathFromApiHost('iceberg/' + icebergId))
        .then(response => {
          this.iceberg = response.data
          this.icebergTitle = response.data.title
          this.icebergImage = response.data.icebergImage
        })
        .catch(e => {
          busDatas.logout()
        })
    },
    removeIceberg () {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.delete(this.getPathFromApiHost('iceberg/' + this.iceberg._id))
        .then(response => {
          this.iceberg = response.data
          this.icebergTitle = response.data.title
          this.icebergImage = response.data.icebergImage
          this.$router.push({path: '/'})
          busDatas.$emit('dataChanged')
        })
        .catch(e => {
          busDatas.logout()
        })
    },
    updateIceberg () {
      this.visibilityAlert = false

      // check titre OK && icebergImageValid !== null
      if (this.icebergTitle === '' || !this.icebergImageValid) {
        this.visibilityAlert = true
        return
      }

      this.iceberg.title = this.icebergTitle
      this.iceberg.icebergImage = this.icebergImageValid

      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.put(this.getPathFromApiHost('iceberg/' + this.iceberg._id), this.iceberg)
        .then(response => {
          busDatas.$emit('dataChanged')
        })
        .catch(e => {
          busDatas.logout()
        })

      this.$router.push({name: 'Icedrops', params: {id: this.iceberg._id}})
    },
    imageLoaded () {
      this.icebergImageValid = this.icebergImage
    }
  }
}
</script>

<style scoped>
  /*main {
    padding-top: 0px;
  }*/
  .containerImage {
    overflow:hidden;
    border-radius:25px;
    width:45px;
    height:45px;
    background-color: #e9eef1;
    float: left;
  }
  .imgIceberg {
    width: auto;
    height: 100%;
    margin: 0 -100%;
  }
  .linkIceberg{
    width: 88%;
    height: 100%;
    float:left;
    max-height:65px;
    cursor: pointer;
    color:#343a40;
  }
  .titreIceberg{
    float:left;
    margin:10px 15px;
    color: #343a40;
  }
  .nav-item{
    max-height: 65px;
  }
  /*.nav-item:hover {
    background-color: #DDD;
  }*/
  .editIceberg{
    width: 12%;
    height: 100%;
    float:right;
    cursor: pointer;
    padding:19px 0;
    color:#343a40;
  }
</style>
