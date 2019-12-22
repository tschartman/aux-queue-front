<template>
  <div>
    <p>HIYA!</p>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";

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

      const config = {
        headers: {
          Authorization: "Bearer " + this.$store.getters.token
        }
      };

      console.log(this.$store.getters.token);

      axios
        .put("http://localhost:8000/users/1/spotify/", data, config)
        .then(res => {
          console.log(res);
          this.$router.push("/");
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
