<template>
  <div>
    <div class="q-pa-md">
      <searchContainer @selectSong="suggestSong" />
    </div>
    <div class="row justify-center" q-ma-md>
      <q-btn @click="$emit('leaveParty')" flat color="red">Leave</q-btn>
    </div>
    <currentPlayback
      :currentlyPlaying="party.currentlyPlaying"
      :controller="false"
    />
    <div class="row justify-center">
      <h6>{{ party.host.userName }}'s party</h6>
    </div>
    <q-scroll-area style="height: 200px;">
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
import { QScrollArea } from "quasar";
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
  }
];
export default {
  components: {
    suggestedSongs,
    currentPlayback,
    QScrollArea,
    searchContainer
  },
  props: {
    party: Object,
    method: { type: Function }
  },
  data() {
    return {};
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
      this.$emit("suggestSong", song);
    }
  }
};
</script>
