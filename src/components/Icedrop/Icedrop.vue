<template>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-9 px-4">
    <div class="row">
      <div class="col-12 col-xs-12 col-sm-4 col-md-3 col mb-2" v-if="icedrop" v-cloak>
        <div class="jumbotron">
          <h4>{{ icedrop.icedropTitle }}</h4>
          <p>{{ icedrop.icedropPublicStatus }}</p>
          <a target="_blank" :href="icedrop.icedropUrl">Site</a>
        </div>
      </div>
      <div class="my-3 p-3 bg-white rounded box-shadow comments">
        <h6 class="border-bottom border-gray pb-2 mb-0">Commentaires</h6>
        <div class="media text-muted pt-3">
          <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded bg-blue userImg" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16306e7f617%20text%20%7B%20fill%3A%23007bff%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A2pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16306e7f617%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20fill%3D%22%23007bff%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2211.958333492279053%22%20y%3D%2216.999999976158144%22%3E32x32%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" >
          <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <strong class="d-block text-gray-dark">@username</strong>
            Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
          </p>
        </div>
        <div class="media text-muted pt-3">
          <img data-src="holder.js/32x32?theme=thumb&bg=e83e8c&fg=e83e8c&size=1" alt="" class="mr-2 rounded" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16306e7f622%20text%20%7B%20fill%3A%23e83e8c%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A2pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16306e7f622%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20fill%3D%22%23e83e8c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2211.958333492279053%22%20y%3D%2216.999999976158144%22%3E32x32%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E">
          <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <strong class="d-block text-gray-dark">@username</strong>
            Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {busDatas} from '../../main'
import axios from 'axios'

export default {
  name: 'Icedrop',
  data () {
    return {
      iceberg: null,
      icedrops: null,
      icedrop: null
    }
  },
  mounted () {
    this.getIceberg()
  },
  methods: {
    getIceberg () {
      this.iceberg = null
      this.icedrops = null
      let icebergId = this.$route.path.split('/')[1]
      let icedropId = this.$route.path.split('/')[3]

      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      axios.get(this.getPathFromApiHost('iceberg/' + icebergId))
        .then(response => {
          this.iceberg = response.data
          // check if icedrops
          if (this.iceberg.icedrops.length === 0) {
            this.$router.push({path: '/' + icebergId})
          }

          this.icedrops = this.iceberg.icedrops

          let result = response.data.icedrops.filter(function (icedrop) {
            if (icedrop._id.indexOf(icedropId) === -1) {
              return
            }
            return icedrop
          })

          if (result.length === 0) {
            this.$router.push({name: 'Page404'})
          }
          this.icedrop = result[0]
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
  .col{
    padding-right: 5px;
    padding-left: 5px;
  }

  html,
  body {
    overflow-x: hidden; /* Prevent scroll on narrow devices */
  }

  body {
    padding-top: 56px;
  }

  @media (max-width: 991.98px) {
    .offcanvas-collapse {
      position: fixed;
      top: 56px; /* Height of navbar */
      bottom: 0;
      left: 100%;
      width: 100%;
      padding-right: 1rem;
      padding-left: 1rem;
      overflow-y: auto;
      visibility: hidden;
      background-color: #343a40;
      transition-timing-function: ease-in-out;
      transition-duration: .3s;
      transition-property: left, visibility;
    }
    .offcanvas-collapse.open {
      left: 0;
      visibility: visible;
    }
  }

  .nav-scroller {
    position: relative;
    z-index: 2;
    height: 2.75rem;
    overflow-y: hidden;
  }

  .nav-scroller .nav {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    padding-bottom: 1rem;
    margin-top: -1px;
    overflow-x: auto;
    color: rgba(255, 255, 255, .75);
    text-align: center;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .nav-underline .nav-link {
    padding-top: .75rem;
    padding-bottom: .75rem;
    font-size: .875rem;
    color: #6c757d;
  }

  .nav-underline .nav-link:hover {
    color: #007bff;
  }

  .nav-underline .active {
    font-weight: 500;
    color: #343a40;
  }

  .text-white-50 { color: rgba(255, 255, 255, .5); }

  .bg-purple { background-color: #6f42c1; }

  .border-bottom { border-bottom: 1px solid #e5e5e5; }

  .box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }

  .lh-100 { line-height: 1; }
  .lh-125 { line-height: 1.25; }
  .lh-150 { line-height: 1.5; }

  .userImg {
    width: 32px;
    height: 32px;
  }
  .comments {
    text-align: left;
  }
</style>
