<template>
  <div>
    <currentPlayback
      :currentlyPlaying="party.currentlyPlaying"
      :controller="true"
    />
    <div class="row justify-center">
      <h6>Your party</h6>
    </div>
    <q-scroll-area style="height: 200px;">
      <suggestedSongs :songs="party.queue" />
    </q-scroll-area>
  </div>
</template>
<script>
import { QScrollArea } from "quasar";
import suggestedSongs from "src/components/suggestedSongs";
import currentPlayback from "components/currentPlayback";
// const alerts = [
//   {
//     color: "negative",
//     message: "Error occured during rating",
//     icon: "report_problem"
//   }
// ];
export default {
  components: {
    suggestedSongs,
    currentPlayback,
    QScrollArea
  },
  props: {
    party: Object,
    method: { type: Function }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
