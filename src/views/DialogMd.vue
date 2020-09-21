<template>
    <v-card>
      <v-card-title class="headline">Conseils markdown</v-card-title>

      <v-card-text>
        Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
        >
          Fermer
        </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
export default {
  name: "DialogMd",
}
</script>

<style scoped>

</style>
