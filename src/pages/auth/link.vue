<template>
  <div>
    <p>HIYA!</p>
  </div>
</template>
<script>
import { SPOTIFY_AUTH_MUTATION } from "src/graphql/queries/authQueries";
export default {
  name: "Link",
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    async linkSpotify(token, refresh) {
      const linkSpotify = await this.$apollo.mutate({
        mutation: SPOTIFY_AUTH_MUTATION,
        variables: {
          accessToken: token,
          refreshToken: refresh
        }
      });
      if (linkSpotify.data) {
        let data = {
          access_token: token,
          refresh_token: refresh
        };
        this.$store.dispatch("linkSpotify", data);
        this.$router.push("/");
      }
    }
  },
  async created() {
    if (this.$route.query.token && this.$route.query.refresh) {
      this.linkSpotify(this.$route.query.token, this.$route.query.refresh);
    }
  }
};
</script>
