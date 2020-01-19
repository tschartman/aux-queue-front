<template>
  <div>
    <p>HIYA!</p>
  </div>
</template>
<script>
import Vue from "vue";
Vue.component("Share");

export default {
  name: "Share",
  components: {},
  data() {
    return {};
  },

  computed: {},
  methods: {},

  created() {
    if (this.$route.query.code) {
      this.$store.dispatch("setSpotify", this.$route.query.code);
      this.$router.push("/");
    }
  }
};
</script>
