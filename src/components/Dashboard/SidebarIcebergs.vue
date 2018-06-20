<template>
  <nav class="col-sm-3 col-md-3 col-lg-3 d-none d-md-block bg-light sidebar">
    <div class="sidebar-sticky">
      <form class="form-inline mt-2 mt-md-0">
        <input class="form-control mr-sm-2 formSearch" type="text" placeholder="Rechercher un iceberg" aria-label="Search" v-model.trim="searchQuery">
      </form>
      <div v-if="!icebergs || icebergs.length === 0">
        <p >Vous n'avez pas encore d'Iceberg. Commencez par en ajouter un :)</p>
      </div>
      <ul class="nav flex-column" v-else>
        <li class="nav-item" v-for="item in filteredDatas" :key="item._id" :class="{'activeLink': routeId == item._id}">
          <hr>
          <router-link :to="'/'+item._id" tag="a" class="nav-link linkIceberg">
            <div class="containerImage">
              <img class="imgIceberg" :src="item.icebergImage" alt="" @error="imageLoadError($event)">
            </div>
            <p class="titreIceberg">
              {{ item.title | capitalize }}
            </p>
          </router-link>
          <router-link :to="'/edit/'+item._id" tag="a" class="editIceberg">
            <svg id="i-compose" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M27 15 L27 30 2 30 2 5 17 5 M30 6 L26 2 9 19 7 25 13 23 Z M22 6 L26 10 Z M9 19 L13 23 Z" />
            </svg>
          </router-link>
        </li>
      </ul>
      <hr>
      <form class="form-inline mt-2 mt-md-0">
        <router-link :to="'/new'" tag="button" class="btn btn-outline-success formAddIceberg" v-on:submit.prevent="">Ajouter un Iceberg</router-link>
      </form>
    </div>
  </nav>
</template>

<script>
import {busDatas} from '../../main'
import axios from 'axios'

export default {
  name: 'SidebarIcebergs',
  data () {
    return {
      icebergs: null,
      searchQuery: null,
      linkActived: false,
      routeId: null
    }
  },
  watch: {
    '$route': function () {
      // check route and hover which item selected in sidebar
      this.routeId = this.$route.path.split('/')[1]
    }
  },
  computed: {
    filteredDatas: function () {
      if (!this.searchQuery || this.searchQuery === '') {
        return this.icebergs
      }
      return this.icebergs.filter(data => data.title.toLocaleLowerCase().indexOf(this.searchQuery) > -1)
    }
  },
  mounted () {
    this.getIcebergs()
  },
  created () {
    busDatas.$on('dataChanged', () => {
      this.getIcebergs()
    })
  },
  methods: {
    imageLoadError (event) {
      event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfP09bFyczM0dO8wMPk6ezY3eDh5unJzdDR1tlr0sxZAAACVUlEQVR4nO3b23KDIBRA0QgmsaLx//+2KmPi/YJMPafZ6619sOzARJjq7QYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuJyN4+qMZcUri+BV3WQ22iIxSRTGFBITbRGpr218Ckx0EQPrxMfVPRP25QvNaT4xFTeJ1g/sJ4K8/aTuVxdNNJ99/Q0RQWlELtN7xGH9+8KYH1ZEX1hY770C9186Cm2R1TeONGj/paHQury7OwbsvzQUlp/9jakOJ2ooPLf/kl9on4Mtan50EhUUDvfgh8cqv/AxKlw+Cc3vPeUXjg+Kr4VCm+Vbl5LkeKHNTDKbKL9w3yr1B8q5RPmFu75puhPzTKKCwh13i2aJJguJ8gt33PG7GZxN1FC4tWvrB04TNRRu7Lw/S3Q2UUPh+ulpOIPTRB2FKyfgaeAoUUvhkvESnSYqL5ybwVGi7sKlwH6i6sL5JTpKVFZYlr0flmewTbyvX+piC8NyiXHvH9YD37OoqtA1v+wS15ZofxY1FTo/cJ+4NYNJd9BSVOi6kTeJOwLVFbrPyJ3dXqL6Cl1/7G7HDGordMOx7+hTVui2arQXBgVqKgwLVFQYGKinMDRQTWFwoJrC8AfcKLwUhRRSeL3vKkyDVaNLSdIf1snXEBQUyrlUTBQeIbPQD6uK8Zx3+yyHKbf/5N+y/gn78K/Rj/ZmY64Omhg9gHFaJu59i+EDGKf1/tshRxlxEoW+2uXS868EeflDYmDNltUzgkpqXyPGzULyK6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8DV+AUrRI7QWHsWNAAAAAElFTkSuQmCC'
    },
    getIcebergs () {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.get(this.getPathFromApiHost('iceberg'))
        .then(response => {
          this.icebergs = response.data
        })
        .catch(e => {
          busDatas.logout()
        })
    }
  }
}
</script>

<style scoped>
  body {
    font-size: .875rem;
  }

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100; /* Behind the navbar */
    padding: 30px 0 0; /* Height of navbar */
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
  }

  .sidebar-sticky {
    position: relative;
    top: 0;
    height: calc(100vh - 48px);
    padding-top: .5rem;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
  }

  @supports ((position: -webkit-sticky) or (position: sticky)) {
    .sidebar-sticky {
      position: -webkit-sticky;
      position: sticky;
    }
  }

  .sidebar .nav-link {
    font-weight: 500;
    color: #333;
  }

  .sidebar .nav-link .feather {
    margin-right: 4px;
    color: #999;
  }

  .sidebar .nav-link.active {
    color: #007bff;
  }

  .sidebar .nav-link:hover .feather,
  .sidebar .nav-link.active .feather {
    color: inherit;
  }

  .sidebar-heading {
    font-size: .75rem;
    text-transform: uppercase;
  }

  .sidebar hr {
    margin:0px;
  }

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
  .nav-item:hover {
    background-color: #DDD;
  }
  .editIceberg{
    width: 12%;
    height: 100%;
    float:right;
    cursor: pointer;
    padding:19px 0;
    color:#343a40;
  }
  .formSearch{
    width: 100% !important;
    margin: 5px 5px 8px 5px;
  }
  .sidebar-sticky{
    padding-top: 0.8rem;
  }
  .formAddIceberg {
    margin: 10px auto 30px auto;
  }
  .activeLink{
    background-color: #DDD;;
  }
</style>
