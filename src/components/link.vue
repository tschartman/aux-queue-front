<template>
  <div>
    <p>HIYA!</p>
  </div>
</template>
<script>
import Vue from "vue";

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
    console.log(this.$route.query.token);
    console.log(this.$route.query.refresh);
  }
};
</script>
