<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-h6">Share Your Queue!</div>
      </q-card-section>
      <q-btn class="q-ma-lg" @click="copy">
        Copy to clipboard
      </q-btn>
    </q-card>
  </div>
</template>
<script>
import { QBtn } from "quasar";
const alerts = [
  {
    color: "secondary",
    message: "Copied to clipboard!",
    icon: "thumb_up"
  }
];
export default {
  components: {
    QBtn
  },
  data() {
    return {
      model: null
    };
  },
  methods: {
    copy() {
      let code = this.$store.getters.spotifyToken;
      let base = window.webpackHotUpdate
        ? "http://localhost:8080"
        : "https://auxqueue.com";
      this.$clipboard(base + "/shareQueue?code=" + code);
      this.$q.notify(alerts[0]);
    }
  },
  created() {}
};
</script>
