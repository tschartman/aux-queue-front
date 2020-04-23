<template>
  <div>
    <div v-if="party" class="row justify-center" q-ma-md>
      <q-btn @click="confirmShutDown" flat color="red">shut down party</q-btn>
    </div>
    <q-pull-to-refresh @refresh="pullRefreshSong">
      <currentPlayback
        :currentlyPlaying="party.currentlyPlaying"
        :controller="true"
      />
    </q-pull-to-refresh>
    <div class="row justify-center">
      <h6>Your party</h6>
    </div>
    <q-pull-to-refresh @refresh="pullRefreshQueue">
      <q-scroll-area style="height: 200px;">
        <suggestedSongs
          v-if="party.queue.length > 0"
          :host="true"
          :songs="party.queue"
          @removeAction="removeSong"
          @playAction="playSong"
        />
        <div v-else class="row justify-center text-body1">
          No suggested Songs. Invite more people to your party so that can
          suggest some!
        </div>
      </q-scroll-area>
    </q-pull-to-refresh>
  </div>
</template>
<script>
import { spotify_api } from "src/utils/spotify-api";
import { QScrollArea, QPullToRefresh } from "quasar";
import suggestedSongs from "src/components/songs/suggestedSongs";
import currentPlayback from "components/playback/currentPlayback";
import { REMOVE_SONG_MUTATION } from "src/graphql/queries/partyQueries";
const alerts = [
  {
    color: "negative",
    message: "Error occured removing song",
    icon: "report_problem"
  }
];
export default {
  components: {
    suggestedSongs,
    currentPlayback,
    QScrollArea,
    QPullToRefresh
  },
  props: {
    party: Object,
    method: { type: Function }
  },
  data() {
    return {};
  },
  methods: {
    async removeSong(song) {
      const removeSong = await this.$apollo.mutate({
        mutation: REMOVE_SONG_MUTATION,
        variables: {
          id: song.id
        }
      });
      if (removeSong.data.removeSong.ok) {
        this.$emit("removeSong", song);
      } else {
        this.queue.notify(alerts[0]);
      }
    },
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
    },
    playSong(song) {
      spotify_api.put("/me/player/play", { uris: [song.songUri] });
    },
    pullRefreshSong(done) {
      this.$emit("refreshSong", this.party.host.userName, done);
      done();
    },
    pullRefreshQueue(done) {
      this.$emit("refreshQueue", done);
    }
  }
};
</script>
