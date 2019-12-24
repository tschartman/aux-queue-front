<template>
  <div>
    <p>HIYA!</p>
  </div>
</template>
<script>
import Vue from "vue";
import { app_api } from "../utils/app-api";

Vue.component("Link");

export default {
  name: "Link",
  components: {},
  data() {
    return {};
  },

  computed: {},
  methods: {},

  created() {
    if (this.$route.query.token && this.$route.query.refresh) {
      const data = {
        access_token: this.$route.query.token,
        refresh_token: this.$route.query.refresh
      };
      app_api.get("/users/").then(res => {
        app_api
          .put("/users/" + res.data[0].id + "/spotify/", data)
          .then(() => {
            this.$store
              .dispatch("linkSpotify")
              .then(res => {
                console.log(res);
                this.$router.push("/");
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  }
};
</script>
