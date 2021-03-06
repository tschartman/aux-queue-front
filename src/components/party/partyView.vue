<template>
  <div>
    <p class="text-overline title">Requests Remaining: {{ songRequests }}</p>
    <div class="q-pa-md">
      <searchContainer @selectSong="suggestSong" />
    </div>
    <div class="row justify-center" q-ma-md>
      <q-btn @click="$emit('leaveParty')" flat color="red">Leave</q-btn>
    </div>
    <q-pull-to-refresh @refresh="pullRefreshSong">
      <currentPlayback
        :currentlyPlaying="party.currentlyPlaying"
        :controller="false"
      />
    </q-pull-to-refresh>
    <q-scroll-area style="height: 300px;">
      <suggestedSongs
        v-if="party.queue.length > 0"
        :host="false"
        @likeAction="likeSong"
        @dislikeAction="dislikeSong"
        :songs="party.queue"
      />
      <div v-else class="row justify-center text-body1">
        No suggested Songs. Search for a song and suggest one!
      </div>
    </q-scroll-area>
  </div>
</template>
<script>
import { QScrollArea, QPullToRefresh } from "quasar";
import suggestedSongs from "src/components/songs/suggestedSongs";
import currentPlayback from "components/playback/currentPlayback";
import searchContainer from "components/songs/searchContainer";
import {
  RATE_SONG_MUTATION,
  REMOVE_RATING_MUTATION
} from "src/graphql/queries/partyQueries";
const alerts = [
  {
    color: "negative",
    message: "Error occured during rating",
    icon: "report_problem"
  },
  {
    color: "negative",
    message: "You are out out song requests",
    icon: "report_problem"
  }
];
export default {
  components: {
    suggestedSongs,
    currentPlayback,
    QScrollArea,
    searchContainer,
    QPullToRefresh
  },
  props: {
    party: Object,
    method: { type: Function }
  },
  data() {
    return {};
  },
  computed: {
    songRequests() {
      const guest = this.party.guests.find(
        g => g.user.userName === this.$store.getters.user.userName
      );
      return guest.allowedRequests - guest.amountRequested;
    }
  },
  methods: {
    async likeSong(song) {
      const user = this.$store.getters.user;
      if (song.rating.find(r => r.user.userName === user.userName && r.like)) {
        const removeRating = await this.$apollo.mutate({
          mutation: REMOVE_RATING_MUTATION,
          variables: {
            id: song.id
          }
        });
        if (removeRating.data.removeRating.ok) {
          this.$emit("updateQueue", "removeRating", song);
        } else {
          this.$q.notify(alerts[0]);
        }
      } else {
        const rateSong = await this.$apollo.mutate({
          mutation: RATE_SONG_MUTATION,
          variables: {
            id: song.id,
            like: true
          }
        });
        if (rateSong.data.rateSong.ok) {
          this.$emit("updateQueue", "likeSong", song);
        } else {
          this.$q.notify(alerts[0]);
        }
      }
    },
    async dislikeSong(song) {
      const user = this.$store.getters.user;
      if (song.rating.find(r => r.user.userName === user.userName && !r.like)) {
        const removeRating = await this.$apollo.mutate({
          mutation: REMOVE_RATING_MUTATION,
          variables: {
            id: song.id
          }
        });
        if (removeRating.data.removeRating.ok) {
          this.$emit("updateQueue", "removeRating", song);
        } else {
          this.$q.notify(alerts[0]);
        }
      } else {
        const rateSong = await this.$apollo.mutate({
          mutation: RATE_SONG_MUTATION,
          variables: {
            id: song.id,
            like: false
          }
        });
        if (rateSong.data.rateSong.ok) {
          this.$emit("updateQueue", "dislikeSong", song);
        } else {
          this.$q.notify(alerts[0]);
        }
      }
    },
    suggestSong(song) {
      if (this.songRequests > 0) {
        this.$emit("suggestSong", song);
      } else {
        this.$q.notify(alerts[1]);
      }
    },
    pullRefreshSong(done) {
      this.$emit("refreshSong", this.party.host.userName, done);
      done();
    }
  }
};
</script>
<style scoped>
.title {
  margin: auto;
  text-align: center;
}
</style>
