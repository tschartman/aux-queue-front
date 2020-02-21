<template>
  <div>
    <p>HIYA!</p>
  </div>
</template>
<script>
import Vue from "vue";
import { SPOTIFY_AUTH_MUTATION } from "src/graphql/queries/authQueries";
Vue.component("Link");

export default {
  name: "Link",
  components: {},
  data() {
    return {};
  },

  computed: {},
  methods: {},

  async created() {
    if (this.$route.query.token && this.$route.query.refresh) {
      const data = {
        access_token: this.$route.query.token,
        refresh_token: this.$route.query.refresh
      };
      const response = await this.$apollo.mutate({
        mutation: SPOTIFY_AUTH_MUTATION,
        variables: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token
        }
      });
      console.log(response);
      if (response.data) {
        let data = {
          access_token: data.data.user.access_token,
          refresh_token: data.data.user.refresh_token
        };
        await this.$store.dispatch("linkSpotify", data);
        this.$router.push("/");
      }
    }
  }
};
</script>
