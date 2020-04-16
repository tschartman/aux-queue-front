<template>
  <div>
    <currentPlayback
      :currentlyPlaying="party.currentlyPlaying"
      :controller="false"
    />
    <div class="row justify-center">
      <h6>{{ party.host.userName }}'s party</h6>
    </div>
    <q-scroll-area style="height: 200px;">
      <suggestedSongs
        @likeAction="likeSong"
        @dislikeAction="dislikeSong"
        :songs="party.queue"
      />
    </q-scroll-area>
  </div>
</template>
<script>
import { QScrollArea } from "quasar";
import suggestedSongs from "src/components/suggestedSongs";
import currentPlayback from "components/currentPlayback";
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
    }
  }
};
</script>
