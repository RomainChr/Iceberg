<template>
  <div>
    <b-nav class="col-md-9 col-lg-9 px-4 ml-sm-auto bg-light nav navIcedrop py-2" v-if="iceberg">
      <h5 class="py-2">{{ iceberg.title | capitalize}}</h5>
      <form class="form-inline mt-0 my-button d-block">
        <router-link :to="'/'+ iceberg._id + '/new'" tag="button" class="btn btn-outline-success" @click.prevent="addIceberg" v-if="iceberg">Ajouter un Icedrop</router-link>
      </form>
    </b-nav>
    <hr class="m-0 hrBar">
    <main role="main" class="col-md-9 ml-sm-auto col-lg-9 px-4 py-5 mt-4">
      <div class="row">
          <div v-if="!icedrops" > <!--key="no-icedrops"-->
            <p >Vous n'avez pas encore d'Icedrop. Commencez par en ajouter un :)</p>
          </div>
        <div class="col-12 col-xs-12 col-sm-4 col-md-4 col-lg-3 col mb-2" v-else v-for="item in filteredDatas" :key="item._id">
          <b-card no-body>
            <div class="containerImg">
              <b-card-img :src="item.icedropUrl"
                          class="img"
                          alt="Img"
                          top
                          @error="imageLoadError($event)">
              </b-card-img>
            </div>
            <div>
              <!--<router-link :to="'/'+ iceberg._id + '/icedrop/' +item._id" tag="h4" class="h4Apercu">-->
                <h4 class="h4Apercu">{{ item.icedropTitle | capitalize }}</h4>
              <!--</router-link>-->
              <p class="card-text">
                  <a :href="item.icedropLink" target="_blank" style="cursor: pointer;">Voir le site</a>
              </p>
            </div>
            <div slot="footer">
              <router-link :to="'/' + iceberg._id + '/icedrop/edit/' + item._id" tag="a" style="color:#343a40;">
                <svg id="i-compose" viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path d="M27 15 L27 30 2 30 2 5 17 5 M30 6 L26 2 9 19 7 25 13 23 Z M22 6 L26 10 Z M9 19 L13 23 Z" />
                </svg>
              </router-link>
            </div>
          </b-card>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import {busDatas} from '../../main'

export default {
  name: 'Icedrops',
  data () {
    return {
      searchQuery: null,
      newIceberg: null,
      iceberg: null,
      icedrops: null
    }
  },
  watch: {
    '$route': function () {
      this.getIceberg()
    }
  },
  computed: {
    filteredDatas: function () {
      if (!this.searchQuery || this.searchQuery === '') {
        return this.icedrops
      }
      return this.icedrops.filter(icedrop => icedrop.title.toLocaleLowerCase().indexOf(this.searchQuery) > -1)
    }
  },
  created () {
    this.getIceberg()
  },
  methods: {
    getIceberg () {
      this.iceberg = null
      this.icedrops = null
      let icebergId = this.$route.path.split('/')[1]

      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.get(this.getPathFromApiHost('iceberg/' + icebergId))
        .then(response => {
          this.iceberg = response.data
          // check if icedrops
          if (this.iceberg.icedrops.length !== 0) {
            this.icedrops = this.iceberg.icedrops
          }
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
    imageLoadError (event) {
      event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfP09bFyczM0dO8wMPk6ezY3eDh5unJzdDR1tlr0sxZAAACVUlEQVR4nO3b23KDIBRA0QgmsaLx//+2KmPi/YJMPafZ6619sOzARJjq7QYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuJyN4+qMZcUri+BV3WQ22iIxSRTGFBITbRGpr218Ckx0EQPrxMfVPRP25QvNaT4xFTeJ1g/sJ4K8/aTuVxdNNJ99/Q0RQWlELtN7xGH9+8KYH1ZEX1hY770C9186Cm2R1TeONGj/paHQury7OwbsvzQUlp/9jakOJ2ooPLf/kl9on4Mtan50EhUUDvfgh8cqv/AxKlw+Cc3vPeUXjg+Kr4VCm+Vbl5LkeKHNTDKbKL9w3yr1B8q5RPmFu75puhPzTKKCwh13i2aJJguJ8gt33PG7GZxN1FC4tWvrB04TNRRu7Lw/S3Q2UUPh+ulpOIPTRB2FKyfgaeAoUUvhkvESnSYqL5ybwVGi7sKlwH6i6sL5JTpKVFZYlr0flmewTbyvX+piC8NyiXHvH9YD37OoqtA1v+wS15ZofxY1FTo/cJ+4NYNJd9BSVOi6kTeJOwLVFbrPyJ3dXqL6Cl1/7G7HDGordMOx7+hTVui2arQXBgVqKgwLVFQYGKinMDRQTWFwoJrC8AfcKLwUhRRSeL3vKkyDVaNLSdIf1snXEBQUyrlUTBQeIbPQD6uK8Zx3+yyHKbf/5N+y/gn78K/Rj/ZmY64Omhg9gHFaJu59i+EDGKf1/tshRxlxEoW+2uXS868EeflDYmDNltUzgkpqXyPGzULyK6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8DV+AUrRI7QWHsWNAAAAAElFTkSuQmCC'
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
  .imgIcedrop{
    width: 100%;
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

  /* .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to  {
    opacity: 0;
  } */

  .navIcedrop {
    /*align-items: center;*/
    margin-top: -20px;
    justify-content: space-between;
    height: 54px;
    position: fixed;
    top: 60px;
    right: 0;
    z-index: 10;
  }
  .h4Apercu{
    max-height: 28px;
    overflow: hidden;
  }
  .hrBar {
    width: 100%;
    position: fixed;
    top: 94px;
    right: 0;
    z-index: 11;
  }
</style>
