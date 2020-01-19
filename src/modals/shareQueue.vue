<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-h6">Share Your Queue!</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <button @click="copy">
          Copy to clipboard
        </button>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    copy() {
      let code = this.$store.getters.spotifyToken;
      this.$clipboard("auxqueue.com/share?code=" + code);
    }
  }
};
</script>
