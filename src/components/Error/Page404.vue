<template>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-9 px-4">
    <h1>404</h1>
    <p>{{ msg }}</p>
    <router-link to="/" tag="a">Accueil</router-link>
  </main>
</template>

<script>
export default {
  name: '404',
  data () {
    return {
      msg: 'Page introuvable, vous êtes perdu ?'
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-size: 30px;
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
