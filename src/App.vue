<template>
  <v-app id="app">
    <div id="titlebar">
      <v-toolbar dense flat>
        <v-spacer></v-spacer>
        <v-toolbar-title>Editmark</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </div>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  created() {
    const dark = localStorage.getItem(`darkmode`)
    dark === 'true' ? this.$vuetify.theme.dark = true : this.$vuetify.theme.dark = false;
  }
}

</script>

<style lang="scss">

pre{
  background-color: #2b2b2b;
  border-radius: 15px;

}

pre > code{
  background-color: transparent !important;
  color: white !important;
}

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  #titlebar {
    -webkit-user-select: none;
    -webkit-app-region: drag;
  }
</style>
