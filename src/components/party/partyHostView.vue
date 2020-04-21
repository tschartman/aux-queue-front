<template>
  <div>
    <div v-if="party" class="row justify-center" q-ma-md>
      <q-btn @click="confirmShutDown" flat color="red">shut down party</q-btn>
    </div>
    <currentPlayback
      :currentlyPlaying="party.currentlyPlaying"
      :controller="true"
    />
    <div class="row justify-center">
      <h6>Your party</h6>
    </div>
    <q-scroll-area style="height: 200px;">
      <suggestedSongs
        v-if="party.queue.length > 0"
        :host="true"
        :songs="party.queue"
      />
      <div v-else class="row justify-center text-body1">
        No suggested Songs. Invite more people to your party so that can suggest
        some!
      </div>
    </q-scroll-area>
  </div>
</template>
<script>
import { QScrollArea } from "quasar";
import suggestedSongs from "src/components/songs/suggestedSongs";
import currentPlayback from "components/playback/currentPlayback";
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
  methods: {
    confirmShutDown() {
      this.$q.notify({
        message: "Are you sure you want to shut down the party?",
        actions: [
          { label: "Nevermind", color: "white", handler: () => {} },
          {
            label: "Shut Down",
            color: "red",
            handler: () => {
              this.$emit("shutDownParty");
            }
          }
        ]
      });
    }
  }
};
</script>
